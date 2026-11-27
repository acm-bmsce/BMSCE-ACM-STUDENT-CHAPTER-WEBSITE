import { z } from "zod";
import { httpUrl, urlOrSitePath } from "../validators/common.js";

/**
 * The shape of each content file the admin panel can save. Saves are checked against these
 * before anything is written, so a bad edit can never break the website's build.
 * Unknown fields on events/projects/insights are kept (older entries carry a few extras).
 */

const text = (max) => z.string().trim().max(max);
const optText = (max) => text(max).optional().or(z.literal(""));
const optLink = urlOrSitePath().optional().or(z.literal(""));
const optNum = z.union([z.number().finite().min(0).max(1e7), z.null()]).optional();
const isoDate = z.string().refine((v) => !Number.isNaN(Date.parse(v)), "Enter a valid date");

const event = z
  .object({
    _id: text(64).min(1),
    slug: z.string().regex(/^[a-z0-9-]{1,80}$/, "Link name: lowercase letters, numbers and dashes"),
    status: z.enum(["published", "draft"]),
    title: text(200).min(2, "Title is required"),
    description: text(4000).min(2, "Short description is required"),
    fullDescription: optText(20000),
    date: isoDate,
    endDate: isoDate.optional().or(z.literal("")).or(z.null()),
    location: optText(200),
    image: optLink,
    gallery: z.array(urlOrSitePath()).max(40).optional(),
    outcomes: z.union([z.array(text(400)).max(30), text(4000), z.null()]).optional(),
    attendees: optNum,
    type: optText(40),
    is_featured: z.boolean().optional(),
    is_team_event: z.boolean().optional(),
    teamMin: optNum,
    teamMax: optNum,
    memberPrice: optNum,
    nonMemberPrice: optNum,
    acmExclusive: z.boolean().optional(),
    capacity: optNum,
  })
  .passthrough();

const project = z
  .object({
    _id: text(64).min(1),
    title: text(200).min(2, "Title is required"),
    description: text(4000).min(2, "Description is required"),
    author: optText(200),
    githubUrl: z.union([httpUrl(), z.literal("")]).optional(),
    imageUrl: optLink,
    categories: z.array(text(60)).max(20).optional(),
    techStack: z.array(text(60)).max(40).optional(),
    status: z.enum(["APPROVED", "PENDING", "REJECTED"]).optional(),
  })
  .passthrough();

const insight = z
  .object({
    _id: text(64).min(1),
    personName: text(120).min(2, "Name is required"),
    description: text(300).min(2, "Role and company are required"),
    image: optLink,
    insta_link: z.union([httpUrl(), z.literal("")]).optional(),
    year: z.union([z.string().max(12), z.number()]).optional(),
  })
  .passthrough();

const person = z.object({
  name: text(80).min(1, "Name is required"),
  role: text(80).min(1, "Role is required"),
  detail: optText(200),
  img: optLink,
  linkedin: z.union([httpUrl(), z.literal("")]).optional(),
  email: z.union([z.string().trim().email("Enter a valid email").max(120), z.literal("")]).optional(),
});

const site = z.object({
  chapter: z.object({
    email: z.string().trim().email("Enter a valid email"),
    forms: z.object({ chapter: httpUrl(), global: httpUrl() }),
  }),
  socials: z.array(z.object({ label: text(40).min(1), href: httpUrl() })).max(12),
  stats: z
    .array(
      z.object({
        value: z.number().finite().min(0),
        suffix: optText(8),
        decimals: z.number().int().min(0).max(2).optional(),
        label: text(60).min(1, "Label is required"),
      })
    )
    .max(12),
  recognition: z.array(z.object({ year: text(12).min(1), title: text(100).min(1), text: text(500).min(1) })).max(20),
  team: z.object({ faculty: z.array(person).max(20), core: z.array(person).max(40), advisors: z.array(person).max(20) }),
  teamPhoto: z.object({ img: urlOrSitePath(), caption: text(120), alt: optText(200) }),
  previousCore: z
    .array(
      z.object({
        year: text(12).min(1),
        img: urlOrSitePath(),
        w: z.number().int().positive().optional(),
        h: z.number().int().positive().optional(),
        members: z.array(z.tuple([text(80).min(1), text(80)])).max(40),
      })
    )
    .max(20),
  // Event highlights on the home page (newest first). Empty photo lists show placeholders.
  highlights: z
    .array(
      z.object({
        year: text(12).min(1),
        title: text(120).min(1),
        when: optText(160),
        text: optText(400),
        stats: z.array(z.object({ value: text(12).min(1), label: text(40).min(1) })).max(4),
        photos: z.array(z.object({ src: urlOrSitePath(), alt: optText(200) })).max(6),
        link: optLink,
      })
    )
    .max(12)
    .optional(),
  journey: z.array(z.object({ year: text(16).min(1), title: text(160).min(1), text: text(600).min(1) })).max(60),
});

const unique = (key, label) => (list, ctx) => {
  const seen = new Set();
  list.forEach((item, i) => {
    if (seen.has(item[key])) ctx.addIssue({ code: "custom", path: [i, key], message: `Two entries share the same ${label}` });
    seen.add(item[key]);
  });
};

export const CONTENT = {
  events: { path: "content/events.json", label: "Events", schema: z.array(event).max(2000).superRefine(unique("_id", "ID")).superRefine(unique("slug", "link name")) },
  projects: { path: "content/projects.json", label: "Projects", schema: z.array(project).max(500).superRefine(unique("_id", "ID")) },
  insights: { path: "content/insights.json", label: "Insight Series", schema: z.array(insight).max(500).superRefine(unique("_id", "ID")) },
  site: { path: "content/site.json", label: "Pages & team", schema: site },
};
