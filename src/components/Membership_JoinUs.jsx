import React from "react";
import { ScrollTimeline } from "./scroll-timeline";
import AnimatedTitle from "./AnimatedTitle";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const membershipEvents = [
  { type: "Student Chapter", title: "Workshops & Events", description: "Gain access to exclusive workshops and events organized by the local chapter."},
  { type: "Global Membership", title: "ACM Digital Library", description: "Get full access to the world's largest repository of computing literature."},
  { type: "Student Chapter", title: "Hands-on Local Projects", description: "Participate in practical projects to apply your skills and build your portfolio."},
  { type: "Global Membership", title: "ACM Magazine Subscription", description: "Stay updated with the latest trends through a subscription to ACM's flagship magazine."},
  { type: "Student Chapter", title: "Peer & Faculty Networking", description: "Build valuable connections with fellow students and faculty members in your field."},
  { type: "Global Membership", title: "Global Networking & Events", description: "Connect with professionals and experts from around the world through global events."},
  { type: "Student Chapter", title: "Leadership & Volunteering", description: "Take on leadership roles and volunteer to develop soft skills and give back."},
  { type: "Global Membership", title: "Conference Discounts", description: "Enjoy significant discounts on registration for ACM-sponsored conferences."},
  { type: "Student Chapter", title: "Activity Discounts", description: "Receive discounts on various chapter activities, competitions, and merchandise."},
  { type: "Global Membership", title: "Career Opportunities", description: "Access a wealth of career resources, job boards, and research opportunities."},
];

const Membership = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  React.useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [inView, controls]);

  const fadeUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: "easeOut" },
    },
  };

  const studentBenefits = membershipEvents.filter(e => e.type === "Student Chapter");
  const globalBenefits = membershipEvents.filter(e => e.type === "Global Membership");

  return (
    <section className="bg-black text-white py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <AnimatedTitle
          title="Membership <b>O</b>ptions"
          containerClass="mb-12 md:mb-20 text-center"
          className="special-font !md:text-[5rem] w-full font-zentry !text-5xl !font-black !leading-[.9]"
        />
        
        {/* Desktop / Large Screens */}
        <div className="hidden lg:block">
          <div className="relative">
            <div className="flex justify-between w-full mb-12">
              <div className="w-full lg:w-[calc(50%-80px)] text-center">
                <h2 className="text-xl text-gray-400 uppercase tracking-widest">[ Chapter Membership ]</h2>
              </div>
              <div className="w-full lg:w-[calc(50%-80px)] text-center">
                <h2 className="text-xl text-gray-400 uppercase tracking-widest">[ Global Membership ]</h2>
              </div>
            </div>
   
            <ScrollTimeline
              events={membershipEvents.map(e => ({...e, year: e.type}))}
              darkMode={true}
              progressIndicator={true}
            />
          </div>
        </div>

        {/* Mobile & Tablet View */}
        <div className="block_joinus lg:hidden">
          <motion.div 
            ref={ref} 
            variants={fadeUp} 
            initial="hidden" 
            animate={controls} 
            className="space-y-16"
          >
            <div>
              <h2 className="text-xl text-gray-400 uppercase mb-8 tracking-widest text-center bg-black">[ Student Chapter ]</h2>
              <ul className="space-y-6 text-lg sm:text-xl md:text-2xl text-center">
                {studentBenefits.map(item => <li key={item.title}>{item.title}</li>)}
              </ul>
            </div>
       
            <div>
              <h2 className="text-xl text-gray-400 uppercase mb-8 tracking-widest text-center bg-black">[ Global Membership ]</h2>
              <ul className="space-y-6 text-lg sm:text-xl md:text-2xl text-center">
                {globalBenefits.map(item => <li key={item.title}>{item.title}</li>)}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Note at the End */}
        <div className="mt-16 text-center text-gray-400 text-sm md:text-base">
          <p>* All Student Chapter benefits are automatically included with ACM Global Membership.</p>
        </div>
      </div>
    </section>
  );
};

export default Membership;
