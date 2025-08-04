// src/components/about/AboutACM.jsx

import AnimatedTitle from "../AnimatedTitle";
import { BentoCard, BentoTilt } from "../Bento"; 
import CountUp from "../CountUp";

const acmCards = [
  {
    title: "Global Network",
    description: "Connect with a worldwide community of leaders and innovators in the computing field.",
    video: "videos/globalnet.mp4",
  },
  {
    title: "100,000+ Members",
    description: "Part of the world's largest computing society, shaping the future of technology.",
    video: "videos/members.mp4",
  },
  {
    title: "Excellence",
    description: "Upholding the highest standards in research, practice, and ethics in computing.",
    video: "videos/excellence.mp4",
  },
  {
    title: "Innovation",
    description: "Driving progress by fostering dialogue, sharing resources, and solving challenges.",
    video: "videos/innovation.mp4",
  },
];

const AboutACM = () => {
  return (
    <section className="bg-black text-blue-50 py-32 px-3 md:px-10">
      <div className="container mx-auto">
        <AnimatedTitle
          title="About ACM"
          containerClass="text-center !text-white"
        />
        <p className="mt-8 mb-20 max-w-3xl mx-auto text-center font-general text-lg text-blue-50/80">
          The Association for Computing Machinery (ACM) is the world's largest educational and scientific computing society, uniting computing educators, researchers, and professionals to inspire dialogue, share resources, and address the field's challenges.
        </p>

        {/* Bento Grid - CORRECTED */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {acmCards.map((card, index) => (
            <BentoTilt key={index} className="bento-tilt_2 row-span-1 h-[50vh]">
              <BentoCard
                src={card.video}
                title={card.title}
                description={card.description}
              />
            </BentoTilt>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-28 flex flex-col md:flex-row justify-around items-center gap-10 md:gap-20 p-10 border-t border-b border-white/10">
          <div className="text-center">
            <h3 className="font-general text-lg uppercase text-blue-50/60">Founded In</h3>
            <p className="text-6xl font-bebas-neue text-blue-300">
              <CountUp from={0} to={1947} duration={2} />
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-general text-lg uppercase text-blue-50/60">Members</h3>
            <p className="text-6xl font-bebas-neue text-blue-300">
              <CountUp from={0} to={100000} duration={2} />+
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-general text-lg uppercase text-blue-50/60">Countries</h3>
            <p className="text-6xl font-bebas-neue text-blue-300">
              <CountUp from={0} to={190} duration={2} />+
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutACM;