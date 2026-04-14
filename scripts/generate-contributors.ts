// Import Node.js Dependencies
import { writeFile } from "node:fs/promises";
import { loadEnvFile } from "node:process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  loadEnvFile();
} catch {
  // .env file is optional
}

interface Contributor {
  login: string;
  html_url: string;
  avatar_url: string;
  type?: "core" | "contributor";
}

interface CoreContributor {
  github: string;
}

interface CoreContributorsResponse {
  core: CoreContributor[];
}

async function generateContributors(): Promise<void> {
  const contributors = await getContributors();
  const filepath = path.join(
    __dirname,
    "..",
    "public",
    "contributors.json"
  );
  const payload = JSON.stringify(contributors, null, 2);

  await writeFile(filepath, payload);
}

const bots: string[] = [
  "dependabot[bot]",
  "allcontributors[bot]",
  "snyk-bot",
  "step-security-bot",
  "github-actions[bot]",
  "greenkeeper[bot]"
];

const repositories: string[] = [
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

async function getRepositoryContributors(repository: string): Promise<Contributor[]> {
  const headers: Record<string, string> = {};
  // GITHUB_TOKEN is not necessary to make request to /contributors
  // but the rate limits for calls without auth is very low.
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(
    `https://api.github.com/repos/NodeSecure/${repository}/contributors`,
    {
      headers
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch contributors for ${repository}: ${response.status}`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
  throw new Error("Invalid response format");
}

return data as Contributor[];
}

async function getCoreContributors(): Promise<string[]> {
  const responseCore = await fetch("https://raw.githubusercontent.com/NodeSecure/Governance/main/contributors.json");
  
  if (!responseCore.ok) {
    throw new Error(`Failed to fetch core contributors: ${responseCore.status}`);
  }
  
  const responseCoreContributors = await responseCore.json() as CoreContributorsResponse;
  const coreContributors = responseCoreContributors.core.map((contributor: CoreContributor) => contributor.github);

  return coreContributors;
}

async function getContributors(): Promise<Contributor[]> {
  const allContributors = await Promise.all(
    repositories.map((repository) => getRepositoryContributors(repository))
  );
  const contributors = allContributors.flat();

  const uniqueContributors = new Map<string, Contributor>();

  const coreContributors = await getCoreContributors();

  for (const contributor of contributors) {
    if (bots.includes(contributor.login) || uniqueContributors.has(contributor.login)) {
      continue;
    }

    if (coreContributors.includes(contributor.login)) {
      contributor.type = "core";
    }
    else {
      contributor.type = "contributor";
    }
    uniqueContributors.set(contributor.login, contributor);
  }

  return Array.from(uniqueContributors.values());
}

await generateContributors();
