// Moments the page has to wait for before playing entrances: the chapter intro on first
// load, and the curtain of a page change. whenSettled() resolves once both are clear.
let resolveReady;
export const appReady = new Promise((r) => (resolveReady = r));
export const markReady = () => resolveReady?.();

let curtain = null;
let resolveCurtain;

/** The page-change curtain is down; entrances on the incoming page should hold. */
export function beginCurtain() {
  curtain = new Promise((r) => (resolveCurtain = r));
  document.documentElement.classList.add("pt-on");
}

/** The curtain is lifting: release held entrances so they play as the page is uncovered. */
export function endCurtain() {
  document.documentElement.classList.remove("pt-on");
  resolveCurtain?.();
  curtain = null;
  window.dispatchEvent(new Event("pt:done"));
}

export const curtainDown = () => document.documentElement.classList.contains("pt-on");
export const whenSettled = () => Promise.all([appReady, curtain || Promise.resolve()]);
