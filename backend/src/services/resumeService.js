const pdfParse = require("pdf-parse");
const { getSkillInfo } = require("../data/skillColors");

// Common programming skills to search for in resumes
const SKILL_KEYWORDS = [
    // Languages
    "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust",
    "Ruby", "PHP", "Swift", "Kotlin", "Scala", "Dart", "R", "MATLAB",
    "Perl", "Haskell", "Elixir", "Clojure", "Objective-C", "Shell", "Bash",

    // Web
    "HTML", "CSS", "SCSS", "Sass", "Less", "Tailwind", "Bootstrap",

    // Frameworks
    "React", "Vue", "Angular", "Svelte", "Next.js", "Nuxt", "Gatsby",
    "Node.js", "Express", "Fastify", "NestJS", "Django", "Flask", "FastAPI",
    "Spring Boot", "Spring", "Rails", "Laravel", "ASP.NET", "Blazor",

    // Mobile
    "React Native", "Flutter", "SwiftUI", "Jetpack Compose", "Xamarin",
    "Android", "iOS",

    // Databases
    "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch",
    "DynamoDB", "Cassandra", "Firebase", "Supabase", "GraphQL", "Prisma",

    // Cloud & DevOps
    "AWS", "Azure", "GCP", "Google Cloud", "Docker", "Kubernetes", "Terraform",
    "Jenkins", "GitHub Actions", "GitLab CI", "CircleCI", "Ansible",

    // Data & ML
    "TensorFlow", "PyTorch", "Keras", "Scikit-learn", "Pandas", "NumPy",
    "Machine Learning", "Deep Learning", "NLP", "Computer Vision",
    "Data Science", "Data Analysis", "Big Data", "Spark", "Hadoop",

    // Tools
    "Git", "GitHub", "GitLab", "Bitbucket", "Jira", "Confluence",
    "Figma", "Sketch", "Adobe XD", "Photoshop",

    // Concepts
    "REST API", "GraphQL", "Microservices", "CI/CD", "Agile", "Scrum",
    "TDD", "Unit Testing", "Integration Testing", "DevOps", "SRE",
];

/**
 * Extract skills from resume PDF
 */
async function extractSkillsFromResume(pdfBuffer) {
    try {
        // Parse PDF to text
        const pdfData = await pdfParse(pdfBuffer);
        const text = pdfData.text.toLowerCase();

        // Find matching skills
        const foundSkills = new Map();

        for (const skill of SKILL_KEYWORDS) {
            const searchTerm = skill.toLowerCase();

            // Check for exact word match (with word boundaries)
            const regex = new RegExp(`\\b${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
            const matches = text.match(regex);

            if (matches && matches.length > 0) {
                foundSkills.set(skill, matches.length);
            }
        }

        // Convert to array with skill info
        const skills = Array.from(foundSkills.entries())
            .map(([name, count]) => ({
                ...getSkillInfo(name),
                frequency: count,
                proficiency: count >= 3 ? "Advanced" : count >= 2 ? "Intermediate" : "Beginner",
            }))
            .sort((a, b) => b.frequency - a.frequency);

        return {
            skills,
            totalPages: pdfData.numpages,
            extractedText: text.length > 0,
        };
    } catch (error) {
        throw new Error("Failed to parse resume PDF: " + error.message);
    }
}

module.exports = { extractSkillsFromResume };
