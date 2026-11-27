import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PAGES } from "../data/seo";
import { applySeo } from "./seo";

const SUFFIX = " · BMSCE ACM Student Chapter";

/**
 * Sets the document title for a page (a main page uses its title from data/seo.js), and keeps
 * the description and canonical address in step. `exact` skips the site suffix; `description`
 * overrides the page's (an event's own page uses its summary).
 */
export default function useTitle(title, exact = false, description) {
  const { pathname } = useLocation();
  useEffect(() => {
    const page = PAGES[pathname === "/" ? "/" : pathname.replace(/\/+$/, "")];
    const full = exact ? title : page ? page.title : `${title}${SUFFIX}`;
    document.title = full;
    applySeo(pathname, description ? { title: full, description } : {});
  }, [title, exact, description, pathname]);
}
