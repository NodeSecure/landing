// Import Node.js Dependencies
import { writeFile } from "node:fs/promises";
import { loadEnvFile } from "node:process";
import path from "node:path";
loadEnvFile();

async function generateContributors() {
  const contributors = await getContributors();
  const filepath = path.join(
    import.meta.dirname,
    "..",
    "public",
    "contributors.json"
  );
  const payload = JSON.stringify(contributors, null, 2);

  await writeFile(filepath, payload);
}
const coreContributors = [
  "fraxken",
  "PierreDemailly",
  "tony-go",
  "antoine-coulon",
  "Kawacrepe",
  "im-codebreaker",
  "clemgbld",
  "fabnguess"
];

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

async function getRepositoryContributors(repository) {
  const headers = {};
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

  return response.json();
}

async function getContributors() {
  const allContributors = await Promise.all(
    repositories.map((repository) => getRepositoryContributors(repository))
  );
  const contributors = allContributors.flat();

  const uniqueContributors = new Map();
  for (const contributor of contributors) {
    if (bots.includes(contributor.login)) {
      continue;
    }
    if (!uniqueContributors.get(contributor.login)) {
      if (coreContributors.includes(contributor.login)) {
        contributor.type = "core";
      }
      else {
        contributor.type = "contributor";
      }
      uniqueContributors.set(contributor.login, contributor);
    }
  }

  return Array.from(uniqueContributors.values());
}
await generateContributors();
