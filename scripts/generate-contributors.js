// Import Node.js Dependencies
import { writeFile } from "node:fs/promises";
import { loadEnvFile } from "node:process";
loadEnvFile();

async function generateContributors() {
  const contributors = await getContributors();
  const path = "public/contributors.json";
  const payload = JSON.stringify(contributors, null, 2);

  await writeFile(path, payload);
}

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
  const response = await fetch(
    `https://api.github.com/repos/NodeSecure/${repository}/contributors`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
      }
    });

  return response.json();
}

async function getContributors() {
  const allContributors = await Promise.all(repositories.map((repository) => getRepositoryContributors(repository)));
  const contributors = allContributors.flat();

  const uniqueContributors = new Map();
  for (const contributor of contributors) {
    if (!uniqueContributors.get(contributor.login)) {
      uniqueContributors.set(contributor.login, contributor);
    }
  }

  return Array.from(uniqueContributors.values());
}
await generateContributors();
