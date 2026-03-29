import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "AMOS2021-MOI";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const headers: HeadersInit = {
  "Accept": "application/vnd.github.v3+json",
  ...(GITHUB_TOKEN && { "Authorization": "Bearer " + GITHUB_TOKEN }),
};

export async function GET() {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch("https://api.github.com/users/" + GITHUB_USERNAME, { headers }),
      fetch("https://api.github.com/users/" + GITHUB_USERNAME + "/repos?per_page=100&sort=updated", { headers }),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      return NextResponse.json({ error: "Failed to fetch GitHub data" }, { status: 500 });
    }

    const user = await userRes.json();
    const repos = await reposRes.json();

    const publicRepos = repos.filter((r: { private: boolean }) => !r.private);

    const totalStars = publicRepos.reduce(
      (sum: number, repo: { stargazers_count: number }) => sum + repo.stargazers_count, 0
    );

    const totalForks = publicRepos.reduce(
      (sum: number, repo: { forks_count: number }) => sum + repo.forks_count, 0
    );

    const languages: Record<string, number> = {};
    publicRepos.forEach((repo: { language: string | null }) => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    const topRepos = publicRepos
      .sort((a: { stargazers_count: number }, b: { stargazers_count: number }) =>
        b.stargazers_count - a.stargazers_count
      )
      .slice(0, 6)
      .map((repo: {
        name: string;
        description: string | null;
        stargazers_count: number;
        forks_count: number;
        language: string | null;
        html_url: string;
        updated_at: string;
        topics: string[];
      }) => ({
        name: repo.name,
        description: repo.description || "",
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language || "Unknown",
        url: repo.html_url,
        updatedAt: repo.updated_at,
        topics: repo.topics || [],
      }));

    const languageColors: Record<string, string> = {
      TypeScript: "#3178c6",
      JavaScript: "#f1e05a",
      Python: "#3572A5",
      HTML: "#e34c26",
      CSS: "#563d7c",
      Java: "#b07219",
      Go: "#00ADD8",
      Rust: "#dea584",
      Unknown: "#8b8b8b",
    };

    return NextResponse.json({
      stats: {
        publicRepos: user.public_repos,
        followers: user.followers,
        following: user.following,
        totalStars,
        totalForks,
        bio: user.bio,
        location: user.location,
        avatarUrl: user.avatar_url,
        profileUrl: user.html_url,
        name: user.name,
      },
      topRepos: topRepos.map((repo: {
        name: string;
        description: string;
        stars: number;
        forks: number;
        language: string;
        url: string;
        updatedAt: string;
        topics: string[];
      }) => ({
        ...repo,
        languageColor: languageColors[repo.language] || "#8b8b8b",
      })),
      languages: Object.entries(languages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([name, count]) => ({
          name,
          count,
          color: languageColors[name] || "#8b8b8b",
        })),
    });

  } catch (error) {
    console.error("GitHub API error:", error);
    return NextResponse.json({ error: "Failed to fetch GitHub data" }, { status: 500 });
  }
}