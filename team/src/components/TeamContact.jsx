import AnimatedTitle from "./AnimatedTitle";
import Button from "./Button";

const TeamContact = () => {
  return (
    <div id="contact" className="my-20 min-h-96 w-screen px-10">
      <div className="relative rounded-lg bg-black py-24 text-blue-50 sm:overflow-hidden">
        <div className="flex flex-col items-center text-center">
          <p className="mb-10 font-general text-[10px] uppercase">
            Join BMSCE ACM Student Chapter Team
          </p>

          <AnimatedTitle
            title="Ready to join <br /> our amazing <br /> team?"
            className="special-font !md:text-[6.2rem] w-full font-zentry !text-5xl !font-black !leading-[.9]"
          />

          <div className="mt-10 space-y-4">
            <p className="text-gray-400 max-w-2xl">
              We're always looking for passionate individuals who want to make a difference in the tech community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                title="Apply Now" 
                containerClass="cursor-pointer bg-blue-600 hover:bg-blue-700" 
              />
              <Button 
                title="Contact Team" 
                containerClass="cursor-pointer border border-white/20 hover:border-blue-300" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamContact; 