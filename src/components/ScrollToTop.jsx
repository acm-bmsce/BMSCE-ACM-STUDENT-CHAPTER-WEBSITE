import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();
    const visitedRoutes = useRef(new Set());

    useEffect(() => {
        const alreadyVisited = visitedRoutes.current.has(pathname);

        if (alreadyVisited) {
            // Scroll only if the user has been here before
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Mark this route as visited
            visitedRoutes.current.add(pathname);
        }
    }, [pathname]);

    return null;
};

export default ScrollToTop;