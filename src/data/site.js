// Static chapter content. Sourced from the current bmsce.acm.org site and the
// acm-bmsce/BMSCE-ACM-STUDENT-CHAPTER-WEBSITE repository.
//
// The values admins edit (stats, recognition, team, previous cores, socials, contact email,
// Join links, the About timeline) live in content/site.json and are re-exported below under
// their usual names, so pages import them exactly as before.
import content from "../../content/site.json";

export const CHAPTER = {
  name: "BMSCE ACM Student Chapter",
  tagline: "Innovating the Future Through Technology & Community",
  inaugurated: "22 Feb 2022",
  email: content.chapter.email,
  address: ["B.M.S. College of Engineering", "Bull Temple Road, Basavanagudi", "Bengaluru, Karnataka 560019"],
  forms: content.chapter.forms,
  hundredDays: "https://100daysofcode.pages.dev/",
  // Public Web3Forms key already used by the chapter's contact form.
  web3formsKey: "a9925f1a-3d23-4c37-bdd9-62a0dd159e67",
};


export const NAV = [
  { to: "/", label: "Home", img: "/img/core2026.webp" },
  { to: "/events", label: "Events", img: "/img/events-bg.webp" },
  { to: "/projects", label: "Projects", img: "/img/56.webp" },
  { to: "/placements", label: "Placements", img: "/img/15.webp" },
  { to: "/team", label: "Team", img: "/img/42.webp" },
  { to: "/about", label: "About Us", img: "/img/10.webp" },
  { to: "/join", label: "Join Us", img: "/img/sh-6.webp" },
];


export const DOMAINS = [
  {
    title: "Technical",
    text: "Promoting innovation through coding, projects, and hackathon participation.",
    img: "/img/coding-session.webp",
  },
  {
    title: "Media & Design",
    text: "Showcasing our work through creative visuals, content, and design.",
    img: "/img/orient-camera.webp",
  },
  {
    title: "Seminars & Workshops",
    text: "Hosting expert talks and hands-on learning sessions.",
    img: "/img/speaker-2.webp",
  },
  {
    title: "Research",
    text: "Exploring CSE, AI, ML, and emerging tech through research and publications.",
    img: "/img/speaker-6.webp",
  },
  {
    title: "Event Management",
    text: "Planning and executing events with seamless coordination.",
    img: "/img/sh-13.webp",
  },
  {
    title: "Community Service",
    text: "Driving impact through outreach, education, and social initiatives.",
    img: "/img/15.webp",
  },
];



// Organisations that appear across the chapter's events (speakers, partners, platforms).
export const COLLABORATORS = [
  "ACM India",
  "ACM India Council",
  "BMS College of Engineering",
  "RVCE",
  "Google DeepMind",
  "IBM Research",
  "TCS Research",
  "IISc",
  "Amazon",
  "TechGig",
  "Google Cloud",
  "HackerRank",
];

export const ABOUT_ACM = {
  text: "The Association for Computing Machinery (ACM) is the world's largest educational and scientific computing society, uniting computing educators, researchers, and professionals to inspire dialogue, share resources, and address the field's challenges.",
  link: "https://india.acm.org/",
  pillars: [
    { title: "Global Network", text: "Connect with a worldwide community of leaders and innovators in the computing field.", img: "/img/globalnet.webp" },
    { title: "100,000+ Members", text: "Part of the world's largest computing society, shaping the future of technology.", img: "/img/members.webp" },
    { title: "Excellence", text: "Upholding the highest standards in research, practice, and ethics in computing.", img: "/img/excellence.webp" },
    { title: "Innovation", text: "Driving progress by fostering dialogue, sharing resources, and solving challenges.", img: "/img/innovation.webp" },
  ],
  stats: [
    { value: 1947, label: "Founded in", plain: true },
    { value: 100000, suffix: "+", label: "Members" },
    { value: 190, suffix: "+", label: "Countries" },
  ],
};

export const ABOUT_CHAPTER = {
  text: "The BMSCE ACM Student Chapter is a vibrant community of passionate computer science enthusiasts, researchers, and innovators dedicated to advancing the field of computing at BMS College of Engineering. We foster an environment of learning, collaboration, and innovation where students can explore cutting-edge technologies, participate in research, and build lasting professional networks.",
  values: [
    { title: "Innovation", text: "We encourage creative problem-solving and the development of novel technologies through projects and workshops." },
    { title: "Community", text: "Building a strong, supportive network of students and faculty to foster collaboration and shared growth." },
    { title: "Excellence", text: "Striving for technical and academic excellence in all our endeavors, from coding competitions to research papers." },
    { title: "Growth", text: "Providing opportunities for personal and professional development, preparing members for future careers." },
  ],
  mission:
    "Join the quest at BMSCE ACM Student Chapter where tech meets purpose. We're on a mission to spark innovation, grow leaders, and connect classrooms to real-world impact through learning, service, and collaboration.",
};






export const WHY_JOIN = [
  { title: "Member-only discounts", text: "Enjoy up to 30% off on events, workshops, and exclusive member benefits." },
  { title: "Skill development & recognition", text: "Earn volunteering points, build your portfolio, and get recognized for your contributions." },
  { title: "Hands-on experience", text: "Join local chapter teams and work on real-time projects that make a difference." },
  { title: "Global ACM access", text: "Access Communications of the ACM, XRDS, TechNews, the Digital Library, and the Career Center." },
  { title: "Open to all branches", text: "Computer Science, Electronics, Mechanical or Civil. Everyone is welcome to innovate with us." },
  { title: "Long-term benefits", text: "A 4-year chapter membership gives you access to all BMSCE ACM events and activities; international ACM resources, communities, and conferences come with ACM Global Membership." },
  { title: "Exclusive ACM programs", text: "Get access and discounts to Summer Schools, Winter Schools, PhD Clinics, CSPathshala, the ACM India AI Olympiad and many more." },
];

export const MEMBERSHIP = {
  chapter: [
    ["Workshops & Events", "Gain access to exclusive workshops and events organized by the local chapter."],
    ["Hands-on Local Projects", "Participate in practical projects to apply your skills and build your portfolio."],
    ["Peer & Faculty Networking", "Build valuable connections with fellow students and faculty members in your field."],
    ["Leadership & Volunteering", "Take on leadership roles and volunteer to develop soft skills and give back."],
    ["Activity Discounts", "Receive discounts on chapter activities, competitions, and merchandise."],
  ],
  global: [
    ["ACM Digital Library", "Get full access to the world's largest repository of computing literature."],
    ["ACM Magazine Subscription", "Stay updated with the latest trends through ACM's flagship magazine."],
    ["Global Networking & Events", "Connect with professionals and experts from around the world through global events."],
    ["Conference Discounts", "Enjoy significant discounts on registration for ACM-sponsored conferences."],
    ["Career Opportunities", "Access a wealth of career resources, job boards, and research opportunities."],
  ],
};

export const SOCIALS = content.socials;
export const STATS = content.stats;
export const RECOGNITION = content.recognition;
export const JOURNEY = content.journey;
export const FACULTY = content.team.faculty;
export const CORE = content.team.core;
export const ADVISORS = content.team.advisors;
export const TEAM_PHOTO = content.teamPhoto;
export const PREVIOUS_CORE = content.previousCore;
export const HIGHLIGHTS = content.highlights || [];
