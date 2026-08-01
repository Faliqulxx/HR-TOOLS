import { PrismaClient } from "@prisma/client";
import { calculateMatchScore } from "../src/lib/ai/matching";
import { generateSummary } from "../src/lib/ai/summary";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Clearing existing data...");

  await prisma.application.deleteMany();
  await prisma.jobRequirement.deleteMany();
  await prisma.candidateSkill.deleteMany();
  await prisma.candidateEducation.deleteMany();
  await prisma.candidateExperience.deleteMany();
  await prisma.candidateCertification.deleteMany();
  await prisma.job.deleteMany();
  await prisma.candidate.deleteMany();

  console.log("💼 Seeding Job Requisitions...");

  const jobsData = [
    {
      title: "Senior Full Stack Engineer",
      department: "Engineering",
      location: "Jakarta (Hybrid)",
      employmentType: "full-time",
      salaryMin: 18000000,
      salaryMax: 28000000,
      status: "active",
      description:
        "We are looking for a Senior Full Stack Engineer to lead web platform initiatives using Next.js, React, TypeScript, and PostgreSQL.",
      requirements: [
        { skillName: "React", isMandatory: true, weight: 2 },
        { skillName: "Next.js", isMandatory: true, weight: 2 },
        { skillName: "TypeScript", isMandatory: true, weight: 2 },
        { skillName: "Node.js", isMandatory: true, weight: 2 },
        { skillName: "PostgreSQL", isMandatory: false, weight: 1 },
        { skillName: "Docker", isMandatory: false, weight: 1 },
      ],
    },
    {
      title: "Staff Backend Specialist",
      department: "Core Engineering",
      location: "Remote",
      employmentType: "full-time",
      salaryMin: 22000000,
      salaryMax: 35000000,
      status: "active",
      description:
        "Seeking an experienced Staff Backend Developer skilled in Python, Golang, PostgreSQL microservices, and distributed architecture.",
      requirements: [
        { skillName: "Python", isMandatory: true, weight: 2 },
        { skillName: "Go", isMandatory: true, weight: 2 },
        { skillName: "PostgreSQL", isMandatory: true, weight: 2 },
        { skillName: "Docker", isMandatory: false, weight: 1 },
        { skillName: "Kubernetes", isMandatory: false, weight: 1 },
        { skillName: "Redis", isMandatory: false, weight: 1 },
      ],
    },
    {
      title: "Lead Data Scientist (AI/ML)",
      department: "Artificial Intelligence",
      location: "Jakarta (On-site)",
      employmentType: "full-time",
      salaryMin: 25000000,
      salaryMax: 40000000,
      status: "active",
      description:
        "Lead our AI initiatives in developing custom LLMs, NLP pipelines, PyTorch models, and big data analysis workflows.",
      requirements: [
        { skillName: "Python", isMandatory: true, weight: 2 },
        { skillName: "PyTorch", isMandatory: true, weight: 2 },
        { skillName: "Machine Learning", isMandatory: true, weight: 2 },
        { skillName: "SQL", isMandatory: false, weight: 1 },
        { skillName: "NLP", isMandatory: false, weight: 1 },
        { skillName: "Pandas", isMandatory: false, weight: 1 },
      ],
    },
    {
      title: "Senior Product Designer (UI/UX)",
      department: "Design & UX",
      location: "Bali / Remote",
      employmentType: "full-time",
      salaryMin: 15000000,
      salaryMax: 24000000,
      status: "active",
      description:
        "Design world-class SaaS web applications, user research workflows, interactive Figma prototypes, and design systems.",
      requirements: [
        { skillName: "Figma", isMandatory: true, weight: 2 },
        { skillName: "UI/UX Design", isMandatory: true, weight: 2 },
        { skillName: "User Research", isMandatory: true, weight: 2 },
        { skillName: "Prototyping", isMandatory: false, weight: 1 },
        { skillName: "Design Systems", isMandatory: false, weight: 1 },
      ],
    },
    {
      title: "DevOps & Cloud Engineer",
      department: "Infrastructure",
      location: "Jakarta (Hybrid)",
      employmentType: "full-time",
      salaryMin: 20000000,
      salaryMax: 30000000,
      status: "active",
      description:
        "Build automated CI/CD pipelines, manage Kubernetes clusters on AWS, and establish IaC using Terraform.",
      requirements: [
        { skillName: "AWS", isMandatory: true, weight: 2 },
        { skillName: "Kubernetes", isMandatory: true, weight: 2 },
        { skillName: "Docker", isMandatory: true, weight: 2 },
        { skillName: "Terraform", isMandatory: false, weight: 1 },
        { skillName: "CI/CD", isMandatory: false, weight: 1 },
      ],
    },
    {
      title: "Technical Product Manager",
      department: "Product",
      location: "Jakarta (Hybrid)",
      employmentType: "full-time",
      salaryMin: 20000000,
      salaryMax: 32000000,
      status: "active",
      description:
        "Drive product roadmap execution, coordinate developer sprints, refine user stories, and evaluate metric telemetry.",
      requirements: [
        { skillName: "Product Management", isMandatory: true, weight: 2 },
        { skillName: "Agile", isMandatory: true, weight: 2 },
        { skillName: "SQL", isMandatory: true, weight: 2 },
        { skillName: "Jira", isMandatory: false, weight: 1 },
        { skillName: "Data Analytics", isMandatory: false, weight: 1 },
      ],
    },
    {
      title: "Growth Marketing Manager",
      department: "Growth & Marketing",
      location: "Remote",
      employmentType: "full-time",
      salaryMin: 14000000,
      salaryMax: 22000000,
      status: "active",
      description:
        "Lead acquisition funnels, digital ad campaigns (Google/Meta), SEO content strategies, and user growth analytics.",
      requirements: [
        { skillName: "Digital Marketing", isMandatory: true, weight: 2 },
        { skillName: "SEO", isMandatory: true, weight: 2 },
        { skillName: "Google Analytics", isMandatory: true, weight: 2 },
        { skillName: "Copywriting", isMandatory: false, weight: 1 },
        { skillName: "Growth Hacking", isMandatory: false, weight: 1 },
      ],
    },
    {
      title: "Senior Financial Analyst",
      department: "Finance & Operations",
      location: "Jakarta (On-site)",
      employmentType: "full-time",
      salaryMin: 16000000,
      salaryMax: 25000000,
      status: "draft",
      description:
        "Analyze enterprise revenue models, build financial forecasts, manage budgeting, and prepare executive board reports.",
      requirements: [
        { skillName: "Financial Modeling", isMandatory: true, weight: 2 },
        { skillName: "Excel", isMandatory: true, weight: 2 },
        { skillName: "SQL", isMandatory: true, weight: 2 },
        { skillName: "Accounting", isMandatory: false, weight: 1 },
      ],
    },
  ];

  const createdJobs = await Promise.all(
    jobsData.map((j) =>
      prisma.job.create({
        data: {
          title: j.title,
          department: j.department,
          location: j.location,
          employmentType: j.employmentType,
          salaryMin: j.salaryMin,
          salaryMax: j.salaryMax,
          status: j.status,
          description: j.description,
          requirements: {
            create: j.requirements,
          },
        },
        include: { requirements: true },
      })
    )
  );

  console.log(`✅ Created ${createdJobs.length} Job Requisitions`);

  console.log("👤 Seeding Candidates database...");

  const candidatesRaw = [
    {
      fullName: "Alex Rivera",
      email: "alex.rivera@example.com",
      phone: "+62 812 9876 5432",
      linkedinUrl: "linkedin.com/in/alexrivera-dev",
      githubUrl: "github.com/alexrivera",
      portfolioUrl: "alexrivera.dev",
      resumeFileName: "Alex_Rivera_Senior_Fullstack.pdf",
      parsingStatus: "parsed",
      skills: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Docker", "TailwindCSS", "Git"],
      educations: [
        { institution: "Bandung Institute of Technology", degree: "Bachelor of Science", major: "Computer Science", gpa: 3.82, startYear: 2017, endYear: 2021 }
      ],
      experiences: [
        { company: "Tokopedia", position: "Senior Frontend Engineer", startDate: new Date("2021-08-01"), endDate: null, isCurrent: true, description: "Led frontend team building high-traffic checkout systems using Next.js and React." },
        { company: "Bukalapak", position: "Software Engineer", startDate: new Date("2019-06-01"), endDate: new Date("2021-07-31"), isCurrent: false, description: "Built micro-frontend components using React and TypeScript." }
      ],
      certifications: [{ name: "AWS Certified Developer", issuer: "Amazon Web Services", year: 2022 }]
    },
    {
      fullName: "Sarah Chen",
      email: "sarah.chen@example.com",
      phone: "+62 811 2345 6789",
      linkedinUrl: "linkedin.com/in/sarahchen-backend",
      githubUrl: "github.com/sarahchen",
      resumeFileName: "Sarah_Chen_Staff_Backend.pdf",
      parsingStatus: "parsed",
      skills: ["Python", "Go", "PostgreSQL", "Docker", "Kubernetes", "Redis", "FastAPI", "gRPC", "Kafka"],
      educations: [
        { institution: "Nanyang Technological University", degree: "Master of Engineering", major: "Software Engineering", gpa: 3.91, startYear: 2016, endYear: 2020 }
      ],
      experiences: [
        { company: "Gojek", position: "Staff Backend Engineer", startDate: new Date("2020-09-01"), endDate: null, isCurrent: true, description: "Architected high-throughput payment microservices handling 10M+ daily requests in Go and Python." }
      ],
      certifications: [{ name: "CKA: Certified Kubernetes Administrator", issuer: "CNCF", year: 2023 }]
    },
    {
      fullName: "Dr. Michael Vance",
      email: "m.vance@example.com",
      phone: "+62 813 4567 8901",
      linkedinUrl: "linkedin.com/in/michaelvance-ai",
      githubUrl: "github.com/mvance-ai",
      portfolioUrl: "mvance-ai.org",
      resumeFileName: "Michael_Vance_AI_Lead.pdf",
      parsingStatus: "parsed",
      skills: ["Python", "PyTorch", "Machine Learning", "NLP", "SQL", "Pandas", "Deep Learning", "TensorFlow", "Scikit-Learn"],
      educations: [
        { institution: "University of Indonesia", degree: "Doctor of Philosophy", major: "Computer Vision & AI", gpa: 3.95, startYear: 2015, endYear: 2019 }
      ],
      experiences: [
        { company: "Traveloka AI Lab", position: "Principal AI Researcher", startDate: new Date("2019-10-01"), endDate: null, isCurrent: true, description: "Pioneered neural recommendation engines and custom Transformer models." }
      ],
      certifications: [{ name: "TensorFlow Certified Developer", issuer: "Google", year: 2021 }]
    },
    {
      fullName: "David Kim",
      email: "david.kim@example.com",
      phone: "+62 815 6789 0123",
      linkedinUrl: "linkedin.com/in/davidkim-ux",
      portfolioUrl: "davidkimdesign.com",
      resumeFileName: "David_Kim_Lead_UIUX.pdf",
      parsingStatus: "parsed",
      skills: ["Figma", "UI/UX Design", "User Research", "Prototyping", "Design Systems", "Wireframing", "User Testing"],
      educations: [
        { institution: "Gadjah Mada University", degree: "Bachelor of Arts", major: "Industrial Design", gpa: 3.75, startYear: 2016, endYear: 2020 }
      ],
      experiences: [
        { company: "Grab Indonesia", position: "Senior Product Designer", startDate: new Date("2020-05-01"), endDate: null, isCurrent: true, description: "Designed merchant onboard dashboards and unified mobile design systems." }
      ],
      certifications: [{ name: "Google UX Design Professional Certificate", issuer: "Coursera", year: 2021 }]
    },
    {
      fullName: "Priya Patel",
      email: "priya.patel@example.com",
      phone: "+62 817 8901 2345",
      linkedinUrl: "linkedin.com/in/priyapatel-cloud",
      githubUrl: "github.com/priyacloud",
      resumeFileName: "Priya_Patel_DevOps.pdf",
      parsingStatus: "parsed",
      skills: ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD", "Linux", "Ansible", "Prometheus", "Python"],
      educations: [
        { institution: "National University of Singapore", degree: "Bachelor of Computing", major: "Computer Engineering", gpa: 3.80, startYear: 2017, endYear: 2021 }
      ],
      experiences: [
        { company: "Shopee", position: "Senior Cloud Infrastructure Engineer", startDate: new Date("2021-06-01"), endDate: null, isCurrent: true, description: "Managed multi-region AWS EKS clusters and automated Infrastructure-as-Code with Terraform." }
      ],
      certifications: [{ name: "AWS Solutions Architect Professional", issuer: "AWS", year: 2023 }]
    },
    {
      fullName: "Marcus Thorne",
      email: "marcus.t@example.com",
      phone: "+62 818 9012 3456",
      linkedinUrl: "linkedin.com/in/marcusthorne-pm",
      resumeFileName: "Marcus_Thorne_TPM.pdf",
      parsingStatus: "parsed",
      skills: ["Product Management", "Agile", "SQL", "Jira", "Data Analytics", "Scrum", "Roadmapping", "A/B Testing"],
      educations: [
        { institution: "INSEAD", degree: "Master of Business Administration", major: "Technology Management", gpa: 3.88, startYear: 2018, endYear: 2020 }
      ],
      experiences: [
        { company: "Blibli", position: "Senior Product Manager", startDate: new Date("2020-03-01"), endDate: null, isCurrent: true, description: "Managed search and recommendation algorithms, driving a 35% conversion lift." }
      ],
      certifications: [{ name: "Certified Scrum Product Owner (CSPO)", issuer: "Scrum Alliance", year: 2021 }]
    },
    {
      fullName: "Elena Rostova",
      email: "elena.rostova@example.com",
      phone: "+62 819 0123 4567",
      linkedinUrl: "linkedin.com/in/elenarostova-mkt",
      portfolioUrl: "elenagrowth.io",
      resumeFileName: "Elena_Rostova_Growth.pdf",
      parsingStatus: "parsed",
      skills: ["Digital Marketing", "SEO", "Google Analytics", "Copywriting", "Growth Hacking", "Meta Ads", "Content Strategy"],
      educations: [
        { institution: "University of Melbourne", degree: "Bachelor of Commerce", major: "Marketing", gpa: 3.70, startYear: 2017, endYear: 2020 }
      ],
      experiences: [
        { company: "Kredivo", position: "Growth Marketing Lead", startDate: new Date("2021-01-01"), endDate: null, isCurrent: true, description: "Scaled user acquisition 3x through algorithmic Meta ad optimization and organic SEO." }
      ],
      certifications: [{ name: "Google Ads Search Certification", issuer: "Google", year: 2022 }]
    },
    {
      fullName: "Chloe Bennett",
      email: "chloe.b@example.com",
      phone: "+62 812 1122 3344",
      linkedinUrl: "linkedin.com/in/chloebennett-fin",
      resumeFileName: "Chloe_Bennett_Finance.pdf",
      parsingStatus: "parsed",
      skills: ["Financial Modeling", "Excel", "SQL", "Accounting", "Financial Analysis", "PowerBI", "Bloomberg"],
      educations: [
        { institution: "Universitas Airlangga", degree: "Bachelor of Economics", major: "Finance & Banking", gpa: 3.85, startYear: 2016, endYear: 2020 }
      ],
      experiences: [
        { company: "Bank Mandiri", position: "Senior Financial Analyst", startDate: new Date("2020-07-01"), endDate: null, isCurrent: true, description: "Created complex 5-year financial projection models and enterprise risk assessments." }
      ],
      certifications: [{ name: "CFA Level II Candidate", issuer: "CFA Institute", year: 2023 }]
    },
    {
      fullName: "Rizky Pratama",
      email: "rizky.pratama@example.com",
      phone: "+62 813 2233 4455",
      githubUrl: "github.com/rizkypratama",
      resumeFileName: "Rizky_Pratama_Fullstack.pdf",
      parsingStatus: "parsed",
      skills: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "HTML5", "CSS3", "Git"],
      educations: [
        { institution: "Bina Nusantara University", degree: "Bachelor of Computer Science", major: "Software Engineering", gpa: 3.65, startYear: 2018, endYear: 2022 }
      ],
      experiences: [
        { company: "Xendit", position: "Full Stack Developer", startDate: new Date("2022-03-01"), endDate: null, isCurrent: true, description: "Developed merchant checkout widgets and transaction dashboard microservices." }
      ],
      certifications: []
    },
    {
      fullName: "Nadia Wijaya",
      email: "nadia.wijaya@example.com",
      phone: "+62 814 3344 5566",
      linkedinUrl: "linkedin.com/in/nadiawijaya-data",
      resumeFileName: "Nadia_Wijaya_Data.pdf",
      parsingStatus: "needs_review",
      skills: ["Python", "SQL", "Pandas", "Machine Learning", "Scikit-Learn", "Tableau"],
      educations: [
        { institution: "Sepuluh Nopember Institute of Technology", degree: "Bachelor of Science", major: "Statistics", gpa: 3.78, startYear: 2018, endYear: 2022 }
      ],
      experiences: [
        { company: "Halodoc", position: "Junior Data Analyst", startDate: new Date("2022-06-01"), endDate: null, isCurrent: true, description: "Analyzed tele-consultation retention funnels and user engagement data." }
      ],
      certifications: []
    },
    {
      fullName: "Budi Santoso",
      email: "budi.santoso@example.com",
      phone: "+62 815 4455 6677",
      resumeFileName: "Budi_Santoso_Resume.pdf",
      parsingStatus: "parsed",
      skills: ["Docker", "Kubernetes", "Linux", "AWS", "Bash", "Python"],
      educations: [
        { institution: "Telkom University", degree: "Bachelor of Engineering", major: "Telecommunication Engineering", gpa: 3.50, startYear: 2017, endYear: 2021 }
      ],
      experiences: [
        { company: "Indosat Ooredoo", position: "DevOps Specialist", startDate: new Date("2021-09-01"), endDate: null, isCurrent: true, description: "Automated server deployment scripts and managed container infrastructure." }
      ],
      certifications: []
    },
    {
      fullName: "Jessica Tan",
      email: "jessica.tan@example.com",
      phone: "+62 816 5566 7788",
      linkedinUrl: "linkedin.com/in/jessicatan-design",
      portfolioUrl: "jessicatan.design",
      resumeFileName: "Jessica_Tan_UIUX.pdf",
      parsingStatus: "parsed",
      skills: ["Figma", "UI/UX Design", "Prototyping", "User Research", "Illustrator"],
      educations: [
        { institution: "Pelita Harapan University", degree: "Bachelor of Design", major: "Visual Communication Design", gpa: 3.80, startYear: 2018, endYear: 2022 }
      ],
      experiences: [
        { company: "Tiket.com", position: "UI/UX Designer", startDate: new Date("2022-04-01"), endDate: null, isCurrent: true, description: "Designed flight booking UI flows and interactive prototype specs." }
      ],
      certifications: []
    }
  ];

  const createdCandidates = await Promise.all(
    candidatesRaw.map((c) =>
      prisma.candidate.create({
        data: {
          fullName: c.fullName,
          email: c.email,
          phone: c.phone,
          linkedinUrl: c.linkedinUrl,
          githubUrl: c.githubUrl,
          portfolioUrl: c.portfolioUrl,
          resumeFileUrl: `/uploads/${c.resumeFileName}`,
          resumeFileName: c.resumeFileName,
          rawText: `Resume content for ${c.fullName}. Skills: ${c.skills.join(", ")}.`,
          parsingStatus: c.parsingStatus,
          skills: {
            create: c.skills.map((s) => ({ skillName: s })),
          },
          educations: {
            create: c.educations,
          },
          experiences: {
            create: c.experiences,
          },
          certifications: {
            create: c.certifications,
          },
        },
        include: {
          skills: true,
          educations: true,
          experiences: true,
          certifications: true,
        },
      })
    )
  );

  console.log(`✅ Created ${createdCandidates.length} Candidate profiles`);

  console.log("⚡ Executing AI Matching Engine & Seeding Applications...");

  const statusOptions = ["new", "screening", "interview", "offered", "hired", "rejected"];

  const applicationPromises = [];

  for (const job of createdJobs) {
    const jobReqs = job.requirements.map((r) => ({
      skillName: r.skillName,
      isMandatory: r.isMandatory,
      weight: r.weight,
    }));

    for (let i = 0; i < createdCandidates.length; i++) {
      const candidate = createdCandidates[i];
      const candSkills = candidate.skills.map((s) => s.skillName);

      const matchResult = calculateMatchScore(jobReqs, candSkills);

      if (matchResult.score > 20 || i % 2 === 0) {
        const candidateSummary = generateSummary(
          {
            fullName: candidate.fullName,
            experiences: candidate.experiences,
            skills: candidate.skills,
            educations: candidate.educations,
            certifications: candidate.certifications,
          },
          { matchScore: matchResult.score, job: { title: job.title } }
        );

        let status = "new";
        if (matchResult.score >= 85) status = statusOptions[4]; // hired
        else if (matchResult.score >= 70) status = statusOptions[3]; // offered
        else if (matchResult.score >= 60) status = statusOptions[2]; // interview
        else if (matchResult.score >= 40) status = statusOptions[1]; // screening
        else if (matchResult.score < 30) status = statusOptions[5]; // rejected

        applicationPromises.push(
          prisma.application.create({
            data: {
              candidateId: candidate.id,
              jobId: job.id,
              matchScore: matchResult.score,
              matchDetail: matchResult.detail as unknown as import("@prisma/client").Prisma.InputJsonValue,
              aiSummary: candidateSummary,
              status,
            },
          })
        );
      }
    }
  }

  const seededApplications = await Promise.all(applicationPromises);

  console.log(`✅ Seeded ${seededApplications.length} Candidate Applications with AI Match Scores`);
  console.log("🚀 Database seeding finished successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
