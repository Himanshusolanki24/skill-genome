// Skill color mapping for popular programming languages and frameworks
const skillColors = {
    // Programming Languages
    JavaScript: { color: "#F7DF1E", textColor: "#000000", category: "language" },
    TypeScript: { color: "#3178C6", textColor: "#FFFFFF", category: "language" },
    Python: { color: "#3776AB", textColor: "#FFFFFF", category: "language" },
    Java: { color: "#ED8B00", textColor: "#000000", category: "language" },
    "C++": { color: "#00599C", textColor: "#FFFFFF", category: "language" },
    C: { color: "#A8B9CC", textColor: "#000000", category: "language" },
    "C#": { color: "#512BD4", textColor: "#FFFFFF", category: "language" },
    Go: { color: "#00ADD8", textColor: "#FFFFFF", category: "language" },
    Rust: { color: "#DEA584", textColor: "#000000", category: "language" },
    Ruby: { color: "#CC342D", textColor: "#FFFFFF", category: "language" },
    PHP: { color: "#777BB4", textColor: "#FFFFFF", category: "language" },
    Swift: { color: "#F05138", textColor: "#FFFFFF", category: "language" },
    Kotlin: { color: "#7F52FF", textColor: "#FFFFFF", category: "language" },
    Scala: { color: "#DC322F", textColor: "#FFFFFF", category: "language" },
    Dart: { color: "#0175C2", textColor: "#FFFFFF", category: "language" },
    Shell: { color: "#89E051", textColor: "#000000", category: "language" },
    PowerShell: { color: "#5391FE", textColor: "#FFFFFF", category: "language" },
    Lua: { color: "#000080", textColor: "#FFFFFF", category: "language" },
    R: { color: "#276DC3", textColor: "#FFFFFF", category: "language" },
    MATLAB: { color: "#E16737", textColor: "#FFFFFF", category: "language" },
    Perl: { color: "#39457E", textColor: "#FFFFFF", category: "language" },
    Haskell: { color: "#5D4F85", textColor: "#FFFFFF", category: "language" },
    Elixir: { color: "#6E4A7E", textColor: "#FFFFFF", category: "language" },
    Clojure: { color: "#5881D8", textColor: "#FFFFFF", category: "language" },
    "Objective-C": { color: "#438EFF", textColor: "#FFFFFF", category: "language" },

    // Web Technologies
    HTML: { color: "#E34F26", textColor: "#FFFFFF", category: "web" },
    CSS: { color: "#1572B6", textColor: "#FFFFFF", category: "web" },
    SCSS: { color: "#CC6699", textColor: "#FFFFFF", category: "web" },
    Sass: { color: "#CC6699", textColor: "#FFFFFF", category: "web" },
    Less: { color: "#1D365D", textColor: "#FFFFFF", category: "web" },

    // Frameworks & Libraries
    React: { color: "#61DAFB", textColor: "#000000", category: "framework" },
    Vue: { color: "#4FC08D", textColor: "#FFFFFF", category: "framework" },
    Angular: { color: "#DD0031", textColor: "#FFFFFF", category: "framework" },
    Svelte: { color: "#FF3E00", textColor: "#FFFFFF", category: "framework" },
    "Next.js": { color: "#000000", textColor: "#FFFFFF", category: "framework" },
    "Node.js": { color: "#339933", textColor: "#FFFFFF", category: "framework" },
    Express: { color: "#000000", textColor: "#FFFFFF", category: "framework" },
    Django: { color: "#092E20", textColor: "#FFFFFF", category: "framework" },
    Flask: { color: "#000000", textColor: "#FFFFFF", category: "framework" },
    FastAPI: { color: "#009688", textColor: "#FFFFFF", category: "framework" },
    "Spring Boot": { color: "#6DB33F", textColor: "#FFFFFF", category: "framework" },
    Rails: { color: "#CC0000", textColor: "#FFFFFF", category: "framework" },
    Laravel: { color: "#FF2D20", textColor: "#FFFFFF", category: "framework" },

    // Data & ML
    TensorFlow: { color: "#FF6F00", textColor: "#FFFFFF", category: "ml" },
    PyTorch: { color: "#EE4C2C", textColor: "#FFFFFF", category: "ml" },
    Jupyter: { color: "#F37626", textColor: "#FFFFFF", category: "ml" },
    "Jupyter Notebook": { color: "#F37626", textColor: "#FFFFFF", category: "ml" },
    Pandas: { color: "#150458", textColor: "#FFFFFF", category: "ml" },
    NumPy: { color: "#013243", textColor: "#FFFFFF", category: "ml" },

    // DevOps & Cloud
    Docker: { color: "#2496ED", textColor: "#FFFFFF", category: "devops" },
    Kubernetes: { color: "#326CE5", textColor: "#FFFFFF", category: "devops" },
    Terraform: { color: "#7B42BC", textColor: "#FFFFFF", category: "devops" },
    AWS: { color: "#FF9900", textColor: "#000000", category: "cloud" },
    Azure: { color: "#0078D4", textColor: "#FFFFFF", category: "cloud" },
    GCP: { color: "#4285F4", textColor: "#FFFFFF", category: "cloud" },

    // Databases
    SQL: { color: "#336791", textColor: "#FFFFFF", category: "database" },
    PostgreSQL: { color: "#336791", textColor: "#FFFFFF", category: "database" },
    MySQL: { color: "#4479A1", textColor: "#FFFFFF", category: "database" },
    MongoDB: { color: "#47A248", textColor: "#FFFFFF", category: "database" },
    Redis: { color: "#DC382D", textColor: "#FFFFFF", category: "database" },
    GraphQL: { color: "#E10098", textColor: "#FFFFFF", category: "database" },

    // Mobile
    "React Native": { color: "#61DAFB", textColor: "#000000", category: "mobile" },
    Flutter: { color: "#02569B", textColor: "#FFFFFF", category: "mobile" },
    Android: { color: "#3DDC84", textColor: "#000000", category: "mobile" },
    iOS: { color: "#000000", textColor: "#FFFFFF", category: "mobile" },

    // Tools
    Git: { color: "#F05032", textColor: "#FFFFFF", category: "tool" },
    GitHub: { color: "#181717", textColor: "#FFFFFF", category: "tool" },
    GitLab: { color: "#FC6D26", textColor: "#FFFFFF", category: "tool" },
    Jenkins: { color: "#D24939", textColor: "#FFFFFF", category: "tool" },

    // Default for unknown languages
    Default: { color: "#6B7280", textColor: "#FFFFFF", category: "other" },
};

// Get skill info with fallback to default
function getSkillInfo(skillName) {
    const normalizedName = skillName.charAt(0).toUpperCase() + skillName.slice(1).toLowerCase();

    // Try exact match first
    if (skillColors[skillName]) {
        return { name: skillName, ...skillColors[skillName] };
    }

    // Try normalized name
    if (skillColors[normalizedName]) {
        return { name: normalizedName, ...skillColors[normalizedName] };
    }

    // Try case-insensitive match
    const matchingKey = Object.keys(skillColors).find(
        key => key.toLowerCase() === skillName.toLowerCase()
    );

    if (matchingKey) {
        return { name: matchingKey, ...skillColors[matchingKey] };
    }

    // Return with default styling
    return {
        name: skillName,
        ...skillColors.Default,
        category: "other"
    };
}

module.exports = { skillColors, getSkillInfo };
