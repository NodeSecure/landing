interface Contributor {
  login: string;
  html_url: string;
  avatar_url: string;
  type?: "core" | "contributor";
}

async function hydrateContributors(): Promise<void> {
  const coreRow = document.getElementById("core-row");
  const commitersRow = document.getElementById("contributors-row");

  if (!coreRow || !commitersRow) {
    console.error("Required elements not found in DOM");
    return;
  }

  const response = await fetch("/contributors.json");

  if (!response.ok) {
    throw new Error(`Error while fetching contributors list: ${response.status}`);
  }

  const contributors: Contributor[] = await response.json();

  for (const contributor of contributors) {
    if (contributor.type === "core") {
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

function createContributorElement(data: Contributor, type: "core" | "contributor" = "contributor"): HTMLAnchorElement {
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

hydrateContributors().catch(console.error);
