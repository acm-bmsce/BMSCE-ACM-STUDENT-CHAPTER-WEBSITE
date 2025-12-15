import pos1 from '../assets/posters2025/2025-1.webp'
import pos2 from '../assets/posters2025/2025-2.webp'
import pos3 from '../assets/posters2025/2025-3.webp'
import pos4 from '../assets/posters2025/2025-4.webp'
import pos5 from '../assets/posters2025/2025-5.webp'
import pos6 from '../assets/posters2025/2025-6.webp'
import pos7 from '../assets/posters2025/2025-7.webp'
import pos8 from '../assets/posters2025/2025-8.webp'
import pos9 from '../assets/posters2025/2025-9.webp'
import pos10 from '../assets/posters2025/2025-10.webp'
import pos11 from '../assets/posters2025/2025-11.webp'
import pos12 from '../assets/posters2025/2025-12.webp'
import pos13 from '../assets/posters2025/vaultoftrails.jpeg'



const eventDataDesktop = [

    {
        id: '5',
        title: '15 Days Of Code',
        description: 'The primary objective of the 15 Days of Code event was to encourage coding consistency and problem-solving skills among participants. The event aimed to provide a platform for students to practice coding regularly, enhance their algorithmic thinking, and build resilience while solving increasingly challenging problems.',
        date: '2025-04-15',
        image: pos5,
        fullDescription:
            "The 15 Days of Code was an online coding challenge aimed at promoting regular practice and competitive coding skills. Participants solved a problem each day, starting with easy levels and gradually progressing to more challenging problems. The event witnessed enthusiastic participation, with many students showcasing consistency and determination.\n\n" +
            "Each challenge was released daily, and participants were encouraged to submit their solutions on the HackerRank platform. The event also featured a leaderboard, motivating participants to compete and improve their problem-solving capabilities. The final phase of the event presented harder problems, testing the endurance and coding proficiency of the remaining participants.\n\n" +
            "The event concluded successfully with the announcement of the top three participants, who demonstrated remarkable consistency and coding skills throughout the 15 days. The leaderboard topper at the end of the 15 days was awarded a course of their choice worth up to ₹700, while the 2nd and 3rd prize winners received free registration to the AI Agents Workshop organized by the BMSCE ACM Student Chapter."
        , outcomes: "The event successfully fostered a culture of consistent coding practice among students. Participants developed their problem-solving abilities, learned new algorithms, and enhanced their coding efficiency. Additionally, the competition spirit motivated participants to keep pushing their limits.",
        gallery: ["img/15doc-1.webp", "img/15doc-2.webp", "img/15doc-3.webp", "img/15doc-4.webp"],
        location: 'HackerRank (Online)',
        attendees: '150',
        year: "2025",
    },
    {
        id: '6',
        title: 'Algothon',
        description: "Algothon's main goals were to challenge and sharpen participants' algorithmic problem-solving and coding skills through a competitive three-round format. It aimed to foster logical thinking, efficient coding, and the application of theoretical knowledge in a practical setting. The event also sought to identify talent, build a community of algorithm enthusiasts, and provide a platform for learning, networking, and sparking interest in computer science. Ultimately, it was about testing abilities and encouraging growth in the field of algorithms.s",
        date: '2025-05-15',
        image: pos6,
        fullDescription:
            "Algothon was a competitive event, typically focused on algorithmic problem-solving or algorithmic trading. Participants, in teams, were presented with a series of questions or challenges that required them to apply their knowledge of algorithms, data structures, and programming skills. The structure of Algothon involved multiple rounds, and in this specific format, there were three rounds. In each round, participants worked to solve the given problems. For every question they answered correctly, they were awarded a certain number of points, which in this case was 10 points. The goal was to accumulate the highest score by correctly solving the maximum number of problems within the given time frame for each round."
        , outcomes: "The participant with the most points wins the Event.",
        gallery: ["img/algo-1.webp", "img/algo-2.webp"],
        location: 'SMV Hall PG Block',
        attendees: '22',
        year: "2025",
    },
    {
        id: '7',
        title: 'ESP-Cryptoverse',
        description: 'The objective of this Eminent Speaker Talk was to dive into the challenges of transforming theoretical cryptographic security into real-world applications and to learn how to build systems that withstand modern cyber threats.',
        date: '2025-05-08',
        image: pos7,
        fullDescription:
            "Mr. Sikhar Patranabis shared insights on the journey of cryptography from theoretical foundations to practical implementations, highlighting challenges in bridging provable security with real-world deployment. The talk explored the fascinating field of cryptography as pursued by IBM Research India, where around 200 researchers were engaged in pioneering work on threat management, cloud infrastructure, secure data and AI handling, as well as decentralized trust. The central theme was Zero Knowledge Proofs (ZKPs)—a groundbreaking cryptographic protocol that allowed one party (the prover) to convince another (the verifier) that a certain statement was true, without disclosing any additional information beyond the truth of the statement itself. ZKPs were built on four core principles: completeness (if the statement was true, an honest verifier would be convinced), soundness (a dishonest provider could not convince the verifier of a false statement), zero knowledge (no knowledge beyond the assertion was revealed), and succinctness (the proofs were short and efficiently verifiable). These principles were brought to life through intuitive examples, such as the color blindness test involving red and green balls and the Ali Baba cave scenario, both of which demonstrated how knowledge could be proven without exposure. The talk further delved into ZKPs of knowledge, such as demonstrating possession of a secret key (e.g., discrete logarithm problems) without revealing it, and highlighted the importance of arithmetic circuits for representing complex relations in general-purpose ZKP systems. These circuits formed the foundation of modern ZKP protocols, including SNARKs (Succinct Non-Interactive Arguments of Knowledge), which offered compact proof sizes and low verification costs. The talk also connected these cryptographic advances to real-world applications, particularly in blockchain technology, where zk-rollups were used to improve scalability. By offloading computation and enabling succinct verification of state updates, zk-rollups helped reduce gas fees, increase transaction throughput, and maintain the integrity of blockchain systems. Overall, the talk emphasized how cryptographic innovation was not only theoretically rich but also practically vital for the future of secure computing and scalable decentralized systems."
        , outcomes: "Participants gained valuable insights into how theoretical cryptographic concepts are applied to real-world systems. The talk enhanced their understanding of advanced security protocols and encouraged exploration of research opportunities in cryptography and blockchain scalability.",
        gallery: ["img/esp-1.webp", "img/esp-2.webp"],
        location: 'online',
        attendees: '30',
        year: "2025",
    },
    {
        id: '8',
        title: 'ACM India Town Hall',
        description: 'The Town Hall for ACM Students, held virtually on April 5th, 2025, brought together ACM student chapter members and faculty from across the country for an enriching interaction with the ACM India Council. The event aimed to foster collaboration, recognize excellence, and offer guidance on how student chapters can thrive and make meaningful contributions to the ACM community.',
        date: '2025-05-05',
        image: pos8,
        fullDescription:
            "Opening Remarks (2:00 PM – 2:20 PM):\n" +
            "The session began with warm welcomes from Dr. Yogesh Simmhan and Maria Dsouza Choudhary representing the ACM India Council, followed by opening remarks from Dr. Seemantini K, Faculty Sponsor of BMSCE ACM Student Chapter. Their words highlighted the importance of community, student involvement, and research-led growth in computing.\n\n" +

            "Awards Recognition (2:20 PM – 2:30 PM):\n" +
            "Dr. Ranga Rajagopal recognized the achievements of various student chapters and lauded their innovative contributions, particularly highlighting chapters that demonstrated exemplary initiative throughout the year.\n\n" +

            "AMA Session (2:30 PM – 2:50 PM):\n" +
            'A dynamic "Ask Me Anything" segment allowed students to directly interact with ACM leaders including Dr. Ponnurangam Kumaraguru, Dr. Yogesh Simmhan, Maria Dsouza Choudhary, Dr. Ranga Rajagopal, Dr. Geetanjali Kale, Dr. Abhijat Vichare, and Dr. Shourya Roy. Discussions ranged from research careers and project funding to navigating the student chapter ecosystem.\n\n' +

            "Region-wise Presentations (2:50 PM – 4:00 PM):\n" +
            "Student chapters from all six ACM India regions presented their key activities, challenges, and successes:\n" +
            "• Regions 1 & 2: Showcased vibrant initiatives, workshops, and inter-collegiate collaborations.\n" +
            "• Regions 3 & 4: Emphasized research outreach, inclusivity, and participation in national events.\n" +
            "• Regions 5 & 6: Displayed outstanding student-led events, social impact campaigns, and magazine releases.\n\n" +

            "Special Sessions:\n" +
            "• Activity-Based Funding (3:10 PM – 3:20 PM) by Dr. Rutvi Shah provided clear guidelines on how student chapters can avail funding by planning impactful activities.\n" +
            "• How to Win Awards? (3:35 PM – 3:45 PM) by Dr. Geetanjali Kale offered actionable insights into what makes a chapter stand out—documenting activities, collaboration, innovation, and community service."
        , outcomes: "• Student chapters are encouraged to maintain consistency, community engagement, and alignment with ACM’s core mission.\n" +
            "• Collaboration among chapters and proactive planning can lead to national recognition and awards.\n" +
            "• Regular documentation and social media presence significantly enhance a chapter’s visibility.\n" +
            "• The ACM India Council is highly supportive and open to student-led initiatives that create long-term impact.",
        gallery: ["img/townhall.webp"],
        location: 'Online',
        attendees: '125',
        year: "2025",
    },
    {
        id: '9',
        title: 'AGM 2025',
        description: 'The BMSCE ACM Student Chapter organized the Annual General Meeting 2025 to review the chapter’s key activities and achievements over the past year, discuss future plans and industry collaborations, introduce the newly elected student leadership team for 2025-26, and provide a platform for faculty and students to share their feedback and suggestions to enhance the chapter’s growth and impact.',
        date: '2025-03-20',
        image: pos9,
        fullDescription:
            "The event commenced with a welcome speech by Roshini, setting the stage for an engaging session. This was followed by the traditional lighting of the lamp by the dignitaries, symbolizing the beginning of a new tenure for the chapter. Next, the Faculty Core members, Dr. Gowrishankar who is the Faculty Advisor and Dr. Seemanthini K who is the Faculty Sponsor were introduced, acknowledging their continued support and guidance. The Outgoing Office Bearers were then introduced and presented with mementos and certificates, recognizing their efforts and contributions to the chapter over the past year. Dr. Seemanthini K, was also presented with a memento and certificate for her constant support and contribution as the Faculty Sponsor of the chapter. The Outgoing Office Bearers delivered speeches highlighting the chapter’s progress and achievements. Harshavardhan presented the Secretary report for the year 2024 - 25 highlighting the major events conducted by the chapter during the year. Srujana provided an overview of the chapter’s annual achievements and growth of the chapter in terms of recognition and memberships. Followed by this Bhuvan presented the financial report for the tenure 2024 - 25, specifying the opening and closing balance amount and income and expenditure amount. Following this, Meghana introduced the newly appointed Office Bearers by presenting their certificates for serving as the Junior Coordinators and officially welcomed them into their roles. The Chairperson for the tenure 2025 - 26 then addressed the gathering, outlining the chapter’s vision and goals for the year 2025 - 26. This was followed by a speech from Dr. Seemanthini K, the Faculty Sponsor, who shared valuable insights and guidance for the chapter’s future endeavors.  The event concluded with a vote of thanks, expressing gratitude to the attendees, to the faculty, outgoing leadership and members for their contributions. The Annual General Meeting served as a significant milestone in shaping the future of the BMSCE ACM Student Chapter, paving the way for continued growth and success"
        , outcomes: "The BMSCE ACM Student Chapter Annual General Meeting 2025 was a great chance to look back at the chapter’s progress, welcome the new leaders, and plan for the future. The open forum allowed students and faculty to share their thoughts, making the chapter’s vision for the next year stronger.",
        gallery: ["img/agm-1.webp", "img/agm-2.webp", "img/agm-3.webp"],
        location: 'Auditorium - 2, PJA Block',
        attendees: '41',
        year: "2025",
    },
    {
        id: '10',
        title: 'Samanvaya #1',
        description: 'The BMSCE ACM Student Chapter organized a community service event, SAMANVAYA #1 - Together for Change, as an initiative to give back to society. The event aimed to instill a sense of social responsibility among members while making a meaningful impact. A donation was made to provide lunch for 72 children at an orphanage, emphasizing the power of collective efforts in bringing change.',
        date: '2025-03-13',
        image: pos10,
        fullDescription:
            "The BMSCE ACM Student Chapter initiated its journey in community service with SAMANVAYA #1 - Together for Change on March 13, 2025. The event involved a donation drive where funds were collected from the members to provide lunch for 72 children at Amrutha Shishu Nivasa, an orphanage in Bengaluru.\n\n" +
            "• The donation amount was ₹2,000, out of which ₹1,000 was contributed through member donations, and ₹1,000 was allocated from the chapter’s treasury.\n" +
            "• A total of 14 members contributed financially, while 5 members visited the orphanage to deliver the donation and spend time with the children.\n" +
            "• This initiative marked the beginning of the club’s commitment to community welfare, reinforcing the belief that small efforts can create a lasting impact."
        , outcomes: "Encouraged social responsibility and community engagement among members. Fostered a sense of empathy and contribution towards underprivileged children. Strengthened the teamwork and initiative of the BMSCE ACM Student Chapter beyond technical activities. Set a precedent for future community service initiatives under the SAMANVAYA series.",
        gallery: ["img/sam-1.webp"],
        location: '',
        attendees: '14',
        year: "2025",
    },
    {
        id: '11',
        title: 'Trivi Arena',
        description: 'The BMSCE ACM Student Chapter in collaboration with BMSCE IEEE WIE organized an event named “Trivi Arena”, a tech-based trivia and puzzle competition. This event aimed to challenge participants’ technical knowledge, problem-solving skills, and ability to think quickly under pressure.',
        date: '2025-03-17',
        image: pos11,
        fullDescription:
            "The event was designed to provide an enjoyable yet intellectually stimulating experience for all participants, helping them learn while having fun. It consisted of three engaging rounds, each designed to test different skills. Participants faced a mix of trivia, technical challenges, and interactive gameplay.\n\n" +

            "Round 1: Quiz\n" +
            "Participants were given 20 questions displayed on the screen. Each team had to write their answer on a sheet within 30 seconds per question. This round lasted for 10 minutes and challenged participants' technical problem-solving abilities, testing their knowledge in various subjects.\n\n" +

            "Round 2: Tech and Fun\n" +
            "This round combined technical problem-solving with interactive gameplay. One team member solved 12 technical questions to earn letters in 15 minutes, while the other completed 3 online games to earn points and letters in 30 minutes. Participants earned letters from their performance in this round, which would be used in the final puzzle. This unique round introduced an exciting blend of logic and fun.\n\n" +

            "Round 3: Unscramble\n" +
            "In the final round, both team members worked together to find a 9-letter word using the letters they had earned. This round tested teamwork and logical reasoning under pressure and was limited to 10 minutes.\n\n" +

            "The event encouraged participants to think critically, work together effectively, and enjoy a mix of technical and entertaining activities. The team with the highest score at the end of all three rounds was declared the winner."
        , outcomes: '"Trivi Arena" provided an excellent opportunity for participants to sharpen their problem-solving, teamwork, and creative thinking abilities in a dynamic and encouraging atmosphere. The event enabled every team member to play to their strengths, promoting a sense of unity and cooperative effort among all participants.',
        gallery: ["img/ta-1.webp", "img/ta-2.webp", "img/ta-3.webp"],
        location: 'PJ Block, 6th floor, Computer Science Data Science Lab',
        attendees: '50',
        year: "2025",
    },

    {
        id: '12',
        title: 'CS Pathshala',
        description: 'BMSCE ACM Student Chapter conducted the CS Pathshala program as part of iTeach, an initiative by the BMS Rotaract Club. This collaboration brought a fresh technical perspective to the event, introducing students to key computational thinking concepts and fostering problem-solving skills in a creative and hands-on manner.',
        date: '2025-02-15',
        image: pos12,
        fullDescription:
            "The CS Pathshala program by the ACM India Council, conducted by the BMSCE ACM Student Chapter, was integrated into the iTeach initiative by the BMSCE Rotaract Club. This partnership focused on introducing computational thinking to students through dynamic, grade-specific activities that emphasized problem-solving, logical reasoning, and teamwork.\n\n" +

            "Grades 1 & 2: Pattern and Logical Thinking\n" +
            "• Pattern Parade: Students from Grade 1 solved simple patterns using coloured blocks, while Grade 2 created their own patterns for their peers to solve, enhancing their understanding of sequencing and categorization.\n" +
            "• Sorting Station: Grade 1 students categorized objects based on a single characteristic (e.g., colour), while Grade 2 worked with two characteristics (e.g., red squares vs. blue circles), reinforcing their logical thinking and sorting abilities.\n\n" +

            "Grades 3 & 4: Step-by-Step Instructions, Loops, and Decision-Making\n" +
            "• Battleship-style Game: The event included a creative game where Grade 3 students followed basic navigation steps, while Grade 4 students applied loops for efficiency and flowchart logic for smarter decision-making.\n\n" +

            "Grades 5 & 6: Problem Decomposition and Data Representation\n" +
            "• Treasure Hunt with Coordinates: Students worked in teams to find 'treasures' using coordinates. Grade 5 students identified treasures using single coordinates, while Grade 6 students solved riddles for the next clue.\n\n" +

            "Grade 7: Advanced Algorithms and Programming Concepts\n" +
            "• Algorithm Race: Students wrote step-by-step algorithms to create a paper airplane. They tested and debugged their instructions, learning the importance of clear instructions and iterative improvement.\n" +
            "• Nested Conditions Game: Students used real-life problem scenarios to create decision trees, learning about 'if-else' conditions and logical thinking.\n\n" +

            "This iTeach initiative helped foster computational thinking at various levels, from basic pattern recognition to more advanced algorithmic concepts, providing both volunteers and students a chance to develop essential problem-solving skills."
        , outcomes: "The CS Pathshala program by the ACM India Council introduced computational thinking to young learners through engaging activities. Collaborating with the iTeach initiative by BMSCE Rotaract Club, the event combined technical education with personal growth. Volunteers honed skills like communication and teamwork while fostering critical thinking and problem-solving among students.",
        gallery: ["img/csp-1.webp", "img/csp-2.webp"],
        location: 'Vidya Vinayaka Samsthe, Bengaluru',
        attendees: '100',
        year: "2025",
    },


]

export default eventDataDesktop