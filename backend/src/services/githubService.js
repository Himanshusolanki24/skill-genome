const axios = require("axios");
const { getSkillInfo } = require("../data/skillColors");

// GitHub API base URL
const GITHUB_API = "https://api.github.com";

// Get GitHub token from environment (optional but recommended for higher rate limits)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Log token status at startup (don't log the actual token for security)
if (GITHUB_TOKEN) {
    const maskedToken = GITHUB_TOKEN.substring(0, 4) + '...' + GITHUB_TOKEN.substring(GITHUB_TOKEN.length - 4);
    console.log(`GitHub Token configured: Yes (${maskedToken})`);
} else {
    console.log('GitHub Token configured: No (Rate limits will be restricted)');
}


// Build headers with optional authentication
function getGitHubHeaders() {
    const headers = {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "GyaniX-App",
    };

    if (GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
    }

    return headers;
}

/**
 * Fetch all public repositories for a GitHub username
 */
async function fetchUserRepos(username) {
    try {
        const response = await axios.get(`${GITHUB_API}/users/${username}/repos`, {
            params: {
                per_page: 100, // Get up to 100 repos
                sort: "updated",
            },
            headers: getGitHubHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('GitHub API Error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            message: error.message,
            data: error.response?.data
        });
        if (error.response?.status === 404) {
            throw new Error(`GitHub user "${username}" not found`);
        }
        if (error.response?.status === 403) {
            throw new Error("GitHub API rate limit exceeded. Try again later.");
        }
        if (error.response?.status === 401) {
            throw new Error("GitHub token is invalid or expired");
        }
        throw new Error(`Failed to fetch GitHub repositories: ${error.message}`);
    }
}

/**
 * Fetch languages used in a specific repository
 */
async function fetchRepoLanguages(owner, repo) {
    try {
        const response = await axios.get(
            `${GITHUB_API}/repos/${owner}/${repo}/languages`,
            {
                headers: getGitHubHeaders(),
            }
        );
        return response.data;
    } catch (error) {
        // Return empty if we can't fetch languages for a repo
        return {};
    }
}

/**
 * Extract all skills from a GitHub username
 */
async function extractSkillsFromGitHub(username) {
    // Fetch all repositories
    const repos = await fetchUserRepos(username);

    if (!repos || repos.length === 0) {
        return {
            username,
            skills: [],
            repoCount: 0,
            message: "No public repositories found",
        };
    }

    // Aggregate languages from all repos
    const languageStats = {};
    const repoNames = [];

    for (const repo of repos) {
        if (!repo.fork) {
            // Skip forked repos
            repoNames.push(repo.name);

            // Add primary language
            if (repo.language) {
                languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
            }

            // Fetch detailed language breakdown for top repos
            if (repoNames.length <= 10) {
                try {
                    const languages = await fetchRepoLanguages(username, repo.name);
                    for (const lang of Object.keys(languages)) {
                        languageStats[lang] = (languageStats[lang] || 0) + 1;
                    }
                } catch (e) {
                    // Continue even if one repo fails
                }
            }
        }
    }

    // Convert to array and sort by frequency
    const skills = Object.entries(languageStats)
        .map(([name, count]) => ({
            ...getSkillInfo(name),
            frequency: count,
            proficiency: calculateProficiency(count, repos.length),
        }))
        .sort((a, b) => b.frequency - a.frequency);

    return {
        username,
        skills,
        repoCount: repoNames.length,
        topRepos: repoNames.slice(0, 5),
    };
}

/**
 * Calculate proficiency level based on usage frequency
 */
function calculateProficiency(count, totalRepos) {
    const ratio = count / totalRepos;
    if (ratio >= 0.5) return "Expert";
    if (ratio >= 0.3) return "Advanced";
    if (ratio >= 0.15) return "Intermediate";
    return "Beginner";
}

module.exports = { extractSkillsFromGitHub };
