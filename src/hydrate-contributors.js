async function hydrateContributors() {
  const coreRow = document.getElementById("core-row");
  const commitersRow = document.getElementById("contributors-row");

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

  const response = await fetch("/contributors.json");

  if (!response.ok) {
    throw new Error(`Error while fetching contributors list: ${response.status}`);
  }

  const contributors = await response.json();

  for (const contributor of contributors) {
    if (bots.includes(contributor.login)) {
      continue;
    }
    else if (coreContributors.includes(contributor.login)) {
      const contributorElement = createContributorElement(
        contributor,
        "core"
      );
      coreRow.appendChild(contributorElement);
    }
    else {
      const contributorElement = createContributorElement(contributor);
      commitersRow.appendChild(contributorElement);
    }
  }
}

function createContributorElement(data, type = "contributor") {
  const cLink = document.createElement("a");

  cLink.href = data.html_url;
  cLink.target = "_blank";
  cLink.className = `${type}-avatar`;

  const img = document.createElement("img");
  img.src = `${data.avatar_url}`;
  img.alt = data.login;

  const nameDiv = document.createElement("div");
  nameDiv.className = `${type}-name`;
  nameDiv.textContent = data.login;

  cLink.appendChild(img);
  cLink.appendChild(nameDiv);

  return cLink;
}

hydrateContributors();
// console.log(await getContributors());
