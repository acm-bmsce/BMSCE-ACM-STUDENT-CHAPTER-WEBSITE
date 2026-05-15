import React, { useState } from 'react';
import FacultyAdvisorSection from './FacultyAdvisorSection';
import Coreteam from './CoreTeam_teams';
import Studentadvisor from './StudentAdvisor_teams';
import AnimatedTitle from './AnimatedTitle';
import Card from './Teamcaard/TeamCard';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const teamData = {
  facultyAdvisor: [
    {
      name: "Dr. Gowrishankar",
      role1: "Faculty Advisor",
      role2: "Faculty Advisor, Dean academics",
      image: "./img/gowrishankar.webp",
      socials: {
        linkedin: "https://www.linkedin.com/in/kushal-b-n-1404002b4/",
        email: "gowrishankar.cse@bmsce.ac.in"
      },
      funFact: "Published 50+ research papers"
    },
    {
      name: "Dr. Seemanthini K Gowda",
      role1: "Faculty Sponsor",
      role2: "Faculty Sponsor,Associate Professor, Dept of Machine Learning",
      image: "./img/Seemanthini.webp",
      socials: {
        linkedin: "https://www.linkedin.com/in/dr-seemanthini-k-87115466/",
        email: "seemanthinik.mel@bmsce.ac.in"
      },
      funFact: "Enjoys hiking."
    }
  ],
  coreTeam: [{
    name: "Fazal M A",
    role1: "Chair",
    role2: "Chair",
    image: "img/Fazal.webp",
    socials: {
      linkedin: "https://www.linkedin.com/in/adwi-h-s-31b96928b/",
      email: "hsadwi.ai23@bmsce.ac.in"
    },
    funFact: "Enjoys hiking."
  },
  {
    name: "Naysha",
    role1: "Vice Chair",
    role2: "Vice Chair",
    image: "/img/Naysha.webp",
    socials: {
      linkedin: "https://www.linkedin.com/in/indraneel-mulpuru-219a332bb/",
      email: "indraneel.ec23@bmsce.ac.in"
    },
    funFact: "Enjoys hiking."
  },
  {
    name: "Devanand K Pathange",
    role1: "Secretary",
    role2: "Secretary",
    image: "./img/Devanand.webp",
    socials: {
      linkedin: "https://www.linkedin.com/in/devanand-k-pathange-b6175432b?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      email: "devanandk.cs24@bmsce.ac.in"
    },
    funFact: "Enjoys hiking."
  },
  {
    name: "Aprameya A Rao",
    role1: "WebMaster and Technical Head",
    role2: "WebMaster and Technical Head",
    image: "./img/Aprameya.webp",
    socials: {
      linkedin: "https://www.linkedin.com/in/aprameya-a-rao/",
      email: "aprameyaa.cs24@bmsce.ac.in"
    },
    funFact: "Enjoys hiking."
  },
  {
    name: "Praneeth Nandan. R",
    role1: "Treasurer",
    role2: "Treasurer",
    image: "/img/Praneeth.webp",
    socials: {
      linkedin: "https://www.linkedin.com/in/praneeth-nandan-r-22430b333?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      email: "praneethnandan.ai24@bmsce.ac.in"
    },
    funFact: "Enjoys hiking."
  },
  {
    name: "Aravind B N",
    role1: "Membership Chair",
    role2: "Membership Chair",
    image: "/img/Aravind.webp",
    socials: {
      linkedin: "https://www.linkedin.com/in/aravind-b-n-9464aa32b/",
      email: "aravindbn.cs24@bmsce.ac.in"
    },
    funFact: "Enjoys hiking."
  },
  {
    name: "Subhodh K Raj",
    role1: "Senior Coordinator",
    role2: "Senior Coordinator",
    image: "./img/Subodh.webp",
    socials: {
      linkedin: "https://www.linkedin.com/in/subhodh-k-raj-0b3a67332?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      email: "subhodhk.cd24@bmsce.ac.in"
    },
    funFact: "Enjoys hiking."
  },
  {
    name: "Anish Saranath",
    role1: "Senior Coordinator",
    role2: "Senior Coordinator",
    image: "./img/Anish.webp",
    socials: {
      linkedin: "https://www.linkedin.com/in/anish-s-0a96843a3/",
      email: "anishsaranath.cs24@bmsce.ac.in"
    },
    funFact: "Enjoys hiking."
  },
  {
    name: "Sanskar Raut",
    role1: "Media Head",
    role2: "Media Head",
    image: "./img/Sanskar.webp",
    socials: {
      linkedin: "https://www.linkedin.com/in/sanskarraut1734/",
      email: "sanskarvishwas.ad24@bmsce.ac.in"
    },
    funFact: "Enjoys hiking."
  }
  ],
  studentAdvisor: [
    {
      name: "Adwi H S",
      role1: "Student Advisor",
      role2: "Student Advisor",
      image: "./img/Adwi _HS.webp",
      socials: {
        linkedin: "https://www.linkedin.com/in/bhuvan-kumar-sg-52ba3a295/",
        email: "bhuvan.cd22@bmsce.ac.in"
      },
      funFact: "Enjoys hiking."
    },
    {
      name: "Hrithik M",
      role1: "Student Advisor",
      role2: "Student Advisor",
      image: "./img/Hrithik.webp",
      socials: {
        linkedin: "https://www.linkedin.com/in/srujana-a-rao/",
        email: "srujana.cd22@bmsce.ac.in"
      },
      funFact: "Enjoys hiking."
    }

  ],
  mediahead: [
    {
      name: "Sanskar",
      role1: "Media Head",
      role2: "Media Head",
      image: "./img/Sanskar.webp",
      socials: {
        linkedin: "https://www.linkedin.com/in/bhuvan-kumar-sg-52ba3a295/",
        email: "bhuvan.cd22@bmsce.ac.in"
      },
      funFact: "Enjoys hiking."
    },
  
  ]
};

const Teams = () => {
  const [selectedMember, setSelectedMember] = useState(null);

  const handleMemberClick = member => setSelectedMember(member);
  const closeModal = () => setSelectedMember(null);

  return (
    <section className="min-h-screen bg-black text-blue-100 p-5 space-y-10 mb-5">
      <div className="pt-20">
        {/* <div className="text-center mt-8">
          <p className="text-gray-400 max-w-2xl mx-auto">
            Get to know the passionate individuals driving innovation and community at BMSCE ACM Student Chapter
          </p>
        </div> */}
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
