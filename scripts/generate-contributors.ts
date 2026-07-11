// Import Node.js Dependencies
import { writeFile } from "node:fs/promises";
import path from "node:path";

// Import Third-party Dependencies
import { GithubClient } from "@openally/github.sdk";

const github = new GithubClient({
  token: process.env.GITHUB_TOKEN
});

const bots = [
  "dependabot[bot]",
  "allcontributors[bot]",
  "snyk-bot",
  "step-security-bot",
  "github-actions[bot]",
  "greenkeeper[bot]"
];

const repositories = [
  "cli",
  "vulnera",
  "ci",
  "scanner",
  "report",
  "js-x-ray",
  "npm-registry-sdk",
  "ossf-scorecard-sdk",
  "github",
  "gitlab",
  "flags"
];

const contributors = await Array.fromAsync(getContributors());
await writeFile(
  path.join(
    import.meta.dirname, "..", "public", "contributors.json"
  ),
  JSON.stringify(contributors, null, 2)
);

interface GovernanceContributor {
  name: string;
  status: "active" | "inactive";
  github: string;
  company: {
    name: string;
    title: string;
  };
  links: {
    linkedin?: string;
    x?: string;
  };
}

interface Contributor {
  login: string;
  status: "active" | "inactive";
  html_url?: string;
  avatar_url?: string;
  contributions: number;
}

interface ExtendedContributor extends Contributor {
  type: "core" | "contributor" | "committer";
}

async function* getContributors(): AsyncIterableIterator<ExtendedContributor> {
  const flattenedContributors = await fetchRemoteContributors();

  const governanceRawFile = await github.fetchRawFile("NodeSecure/Governance", "contributors.json");
  const governanceData = JSON.parse(governanceRawFile) as {
    core: GovernanceContributor[];
    committers: GovernanceContributor[];
  };

  const coreContributorLogins = new Map<string, { type: "core" | "committer"; status: "active" | "inactive"; }>([
    ...governanceData.core.map(
      (contributor) => [contributor.github, { type: "core", status: contributor.status }] as const
    ),
    ...governanceData.committers.map(
      (contributor) => [contributor.github, { type: "committer", status: contributor.status }] as const
    )
  ]);

  for (const contributor of flattenedContributors) {
    const { type, status } = coreContributorLogins.get(contributor.login) || {
      type: "contributor",
      status: "active"
    };

    yield { ...contributor, type, status };
  }
}

async function fetchRemoteContributors(): Promise<Contributor[]> {
  const flattenedContributors = (await Promise.all(
    repositories.map((repository) => github.repos.NodeSecure[repository].contributors())
  )).flat();

  const uniqueContributors = new Map<string, Contributor>();

  for (const contributor of flattenedContributors) {
    if (!contributor.login || bots.includes(contributor.login)) {
      continue;
    }

    if (uniqueContributors.has(contributor.login)) {
      const existingContributor = uniqueContributors.get(contributor.login)!;
      existingContributor.contributions += contributor.contributions;
    }
    else {
      uniqueContributors.set(contributor.login, {
        login: contributor.login,
        status: "active",
        html_url: contributor.html_url,
        avatar_url: contributor.avatar_url,
        contributions: contributor.contributions
      });
    }
  }

  return Array.from(uniqueContributors.values())
    .sort((left, right) => right.contributions - left.contributions);
}
