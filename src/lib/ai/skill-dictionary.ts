// Skill dictionary for AI resume parsing & matching
// Case-insensitive partial match is used during parsing

export const SKILL_DICTIONARY: string[] = [
  // ── Tech: Languages ──────────────────────────────────────────────────────
  "JavaScript", "TypeScript", "Python", "Java", "Kotlin", "Swift",
  "C", "C++", "C#", "PHP", "Ruby", "Go", "Rust", "Scala", "R",
  "MATLAB", "Bash", "Shell", "Dart", "Flutter",

  // ── Tech: Frontend ───────────────────────────────────────────────────────
  "React", "Next.js", "Vue.js", "Angular", "Svelte", "Nuxt.js",
  "HTML", "CSS", "SASS", "SCSS", "TailwindCSS", "Bootstrap",
  "Redux", "Zustand", "Webpack", "Vite",

  // ── Tech: Backend ────────────────────────────────────────────────────────
  "Node.js", "Express.js", "FastAPI", "Django", "Flask", "Laravel",
  "Spring Boot", "NestJS", "Rails", "ASP.NET",

  // ── Tech: Database ───────────────────────────────────────────────────────
  "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite",
  "Elasticsearch", "Firebase", "Supabase", "DynamoDB",

  // ── Tech: DevOps & Cloud ─────────────────────────────────────────────────
  "Docker", "Kubernetes", "AWS", "Google Cloud", "Azure",
  "CI/CD", "GitHub Actions", "Jenkins", "Terraform", "Ansible",
  "Linux", "Nginx", "Apache",

  // ── Tech: Other ──────────────────────────────────────────────────────────
  "Git", "GitHub", "REST API", "GraphQL", "WebSocket",
  "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning",
  "Data Science", "Pandas", "NumPy", "Scikit-learn",
  "Prisma", "Mongoose", "Sequelize",

  // ── Marketing ────────────────────────────────────────────────────────────
  "SEO", "SEM", "Google Ads", "Facebook Ads", "Meta Ads",
  "Content Strategy", "Content Marketing", "Social Media Marketing",
  "Email Marketing", "Google Analytics", "Copywriting",
  "Branding", "Digital Marketing", "Marketing Automation",
  "HubSpot", "Mailchimp", "Salesforce",

  // ── Finance ──────────────────────────────────────────────────────────────
  "Financial Modeling", "Excel", "SAP", "Accounting",
  "Budgeting", "Tax Planning", "Financial Analysis",
  "Bloomberg", "PowerBI", "Tableau", "SQL", "Audit",
  "IFRS", "GAAP", "Cost Accounting", "Cash Flow",

  // ── Design ───────────────────────────────────────────────────────────────
  "Figma", "Adobe XD", "Photoshop", "Illustrator", "InDesign",
  "UI/UX Design", "User Research", "Wireframing", "Prototyping",
  "Canva", "Sketch", "After Effects", "Premiere Pro",

  // ── HR & Management ──────────────────────────────────────────────────────
  "Project Management", "Agile", "Scrum", "Kanban", "JIRA",
  "Confluence", "Trello", "Notion", "Asana",
  "Team Leadership", "Communication", "Leadership",
  "Recruitment", "Talent Acquisition", "People Management",

  // ── Soft Skills ──────────────────────────────────────────────────────────
  "Problem Solving", "Critical Thinking", "Presentation",
  "Public Speaking", "Negotiation", "Time Management",
  "Analytical Thinking", "Attention to Detail", "Teamwork",
];

// Synonym map for partial matching during candidate-job matching
export const SKILL_SYNONYMS: Record<string, string[]> = {
  "JavaScript": ["JS", "ECMAScript", "ES6", "ES2015"],
  "TypeScript": ["TS"],
  "Python": ["Py"],
  "Machine Learning": ["ML", "AI/ML"],
  "Deep Learning": ["DL"],
  "REST API": ["RESTful", "REST"],
  "PostgreSQL": ["Postgres"],
  "MongoDB": ["Mongo"],
  "Docker": ["Containerization"],
  "Kubernetes": ["K8s"],
  "Amazon Web Services": ["AWS"],
  "Google Cloud": ["GCP"],
  "Microsoft Azure": ["Azure"],
  "CI/CD": ["DevOps Pipeline", "Continuous Integration"],
  "React": ["ReactJS", "React.js"],
  "Vue.js": ["Vue", "VueJS"],
  "Node.js": ["NodeJS", "Node"],
  "Next.js": ["NextJS"],
  "UI/UX Design": ["UX Design", "UI Design", "UX/UI"],
  "Project Management": ["PM"],
  "Agile": ["Agile Methodology"],
  "Git": ["Version Control"],
  "TailwindCSS": ["Tailwind"],
};
