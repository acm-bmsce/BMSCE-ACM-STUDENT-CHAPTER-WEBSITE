
import { ReactLenis } from "lenis/dist/lenis-react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";

import { useRef } from "react";
import AnimatedTitle from "./AnimatedTitle";
import Button from "./Button";

const SECTION_HEIGHT = 1500;

const SmoothScroll = () => {
  return (
    <div className="bg-zinc-950">
      <ReactLenis
        root
        options={{
          lerp: 0.05,
        }}
      >

        
      </ReactLenis>
    </div>
  );
};




export default SmoothScroll;
