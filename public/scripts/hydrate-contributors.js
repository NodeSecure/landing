async function hydrateContributors() {
  const coreRow = document.getElementById("core-row");
  const commitersRow = document.getElementById("contributors-row");
  const emiritusRow = document.getElementById("emiritus-row");

  const response = await fetch("/contributors.json");

  if (!response.ok) {
    throw new Error(`Error while fetching contributors list: ${response.status}`);
  }

  const contributors = await response.json();

  for (const contributor of contributors) {
    const contributorHTMLElement = createContributor(contributor);

    if (
      contributor.type === "core" ||
      contributor.type === "committer"
    ) {
      if (contributor.status === "inactive") {
        contributorHTMLElement.className = "emeritus-avatar";
        emiritusRow.appendChild(contributorHTMLElement);
      }
      else {
        contributorHTMLElement.className = "core-avatar";
        coreRow.appendChild(contributorHTMLElement);
      }
    }
    else {
      contributorHTMLElement.className = "contributor-avatar";
      commitersRow.appendChild(contributorHTMLElement);
    }
  }
}

function createContributor(data) {
  const cLink = document.createElement("a");

  cLink.href = data.html_url;
  cLink.target = "_blank";
  cLink.rel = "noopener";
  cLink.dataset.tooltip = data.login;
  cLink.setAttribute("aria-label", data.login);

  const img = document.createElement("img");
  img.src = data.avatar_url;
  img.alt = "";
  img.loading = "lazy";

  cLink.appendChild(img);

  return cLink;
}

hydrateContributors().catch(console.error);
