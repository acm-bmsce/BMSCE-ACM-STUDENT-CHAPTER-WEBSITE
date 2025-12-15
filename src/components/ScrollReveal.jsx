import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function ScrollCard({ children, delay = 0 }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={
                isInView
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 60, scale: 0.95 }
            }
            transition={{
                duration: 0.8,
                delay,
                ease: [0.25, 1, 0.5, 1],
            }}
        >
            {children}
        </motion.div>
    );
}
