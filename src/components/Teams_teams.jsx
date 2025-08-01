import React, { useState } from 'react';
import FacultyAdvisorSection from './FacultyAdvisorSection_teams';
import Coreteam from './CoreTeam_teams';
import Studentadvisor from './StudentAdvisor_teams';

const teamData = {
  facultyAdvisor: [
    {
      name: "Dr. Gowrishankar",
      role: "Faculty Advisor, Dean Academics",
      image: "./img/gowrishankar.jpeg",
      socials: {
        linkedin: "https://www.linkedin.com/in/kushal-b-n-1404002b4/",
        email: "john.smith@bmsce.ac.in"
      },
      funFact: "Published 50+ research papers"
    },
    {
      name: "New Faculty Member",
      role: "New Role",
      image: "",
      socials: {
        linkedin: "https://linkedin.com/in/newfaculty",
        email: "newfaculty@example.com"
      },
      funFact: "Enjoys hiking."
    }
  ],
  coreTeam: [{
    name: "H S Adwi",
    role: "Chair",
    image: "img/Adwi.jpeg",
    socials: {
      linkedin: "https://linkedin.com/in/newfaculty",
      email: "newfaculty@example.com"
    },
    funFact: "Enjoys hiking."
  },
  {
    name: "Indraneel M",
    role: "Vice Chair",
    image: "/img/harsha.webp",
    socials: {
      linkedin: "https://linkedin.com/in/newfaculty",
      email: "newfaculty@example.com"
    },
    funFact: "Enjoys hiking."
  },
  {
    name: "Roshini B",
    role: "Secretary",
    image: "./img/roshini.jpeg",
    socials: {
      linkedin: "https://linkedin.com/in/newfaculty",
      email: "newfaculty@example.com"
    },
    funFact: "Enjoys hiking."
  },
  {
    name: "Hrithik M",
    role: "Web Master",
    image: "./img/Hrithik (1).jpg",
    socials: {
      linkedin: "https://linkedin.com/in/newfaculty",
      email: "newfaculty@example.com"
    },
    funFact: "Enjoys hiking."
  },
  {
    name: "Kanishka Sharma",
    role: "Membership Chair",
    image: "/img/harsha.webp",
    socials: {
      linkedin: "https://linkedin.com/in/newfaculty",
      email: "newfaculty@example.com"
    },
    funFact: "Enjoys hiking."
  },
  {
    name: "Dhruva G S",
    role: "Treasurer",
    image: "/img/harsha.webp",
    socials: {
      linkedin: "https://linkedin.com/in/newfaculty",
      email: "newfaculty@example.com"
    },
    funFact: "Enjoys hiking."
  },
  {
    name: "Srikanth M",
    role: "Senior Co-Ordinator",
    image: "./img/Srikanth.jpeg",
    socials: {
      linkedin: "https://linkedin.com/in/newfaculty",
      email: "newfaculty@example.com"
    },
    funFact: "Enjoys hiking."
  }
  ],
  studentAdvisor: [
    {
      name: "Bhuvan Kumar SG",
      role: "Student Advisor",
      image: "./img/Bhuvan.jpg",
      socials: {
        linkedin: "https://linkedin.com/in/newfaculty",
        email: "newfaculty@example.com"
      },
      funFact: "Enjoys hiking."
    },
    {
      name: "Srujana A Rao",
      role: "Student Advisor",
      image: "./img/Srujana.jpeg",
      socials: {
        linkedin: "https://linkedin.com/in/newfaculty",
        email: "newfaculty@example.com"
      },
      funFact: "Enjoys hiking."
    }
  ]
};

const Teams = () => {
  const [selectedMember, setSelectedMember] = useState(null);

  const handleMemberClick = member => setSelectedMember(member);
  const closeModal = () => setSelectedMember(null);

  return (
    <section className="min-h-screen bg-black text-blue-100 p-5 space-y-10">
      <div className="pt-20">
        <div className="text-center mt-8">
          <p className="text-gray-400 max-w-2xl mx-auto">
            Get to know the passionate individuals driving innovation and community at BMSCE ACM Student Chapter
          </p>
        </div>
      </div>
      {teamData.facultyAdvisor?.length > 0 &&
        <FacultyAdvisorSection
          members={teamData.facultyAdvisor}
          sectionKey="facultyAdvisor"
          onMemberClick={handleMemberClick}
        />}
      {teamData.coreTeam?.length > 0 &&
        <Coreteam
          members={teamData.coreTeam}
          sectionKey="coreTeam"
          onMemberClick={handleMemberClick}
        />}
      {teamData.studentAdvisor?.length > 0 &&
        <Studentadvisor
          members={teamData.studentAdvisor}
          sectionKey="studentAdvisor"
          onMemberClick={handleMemberClick}
        />}
      {/* Modal Logic as before */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative bg-black border border-white/20 rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl"
            >×</button>
            <div className="text-center">
              <img
                src={selectedMember.image}
                alt={selectedMember.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-2xl font-bold text-white mb-2">{selectedMember.name}</h3>
              <p className="text-blue-300 text-lg mb-4">{selectedMember.role}</p>
              <p className="text-gray-400 mb-6 italic">"{selectedMember.funFact}"</p>
              <div className="flex justify-center gap-4">
                {selectedMember.socials.linkedin && (
                  <a href={selectedMember.socials.linkedin} className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors">
                    <FaLinkedin className="text-white" />
                  </a>
                )}
                {selectedMember.socials.github && (
                  <a href={selectedMember.socials.github} className="p-3 bg-gray-800 rounded-full hover:bg-gray-900 transition-colors">
                    <FaGithub className="text-white" />
                  </a>
                )}
                {selectedMember.socials.email && (
                  <a href={`mailto:${selectedMember.socials.email}`} className="p-3 bg-red-600 rounded-full hover:bg-red-700 transition-colors">
                    <MdEmail className="text-white" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Teams;
