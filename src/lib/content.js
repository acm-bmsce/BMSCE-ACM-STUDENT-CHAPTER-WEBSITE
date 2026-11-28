// Admin-editable sections (stats, team, recognition). They live in content/site.json, which the
// admin panel commits to the repository; every save redeploys the site, so the values here are
// always the latest published ones.
import { STATS, FACULTY, CORE, ADVISORS, RECOGNITION } from "../data/site";

export const SITE_CONTENT = {
  stats: STATS,
  team: { faculty: FACULTY, core: CORE, advisors: ADVISORS },
  recognition: RECOGNITION,
};

export const useSiteContent = () => SITE_CONTENT;
