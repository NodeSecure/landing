const kPackages = [
  {
    name: "@nodesecure/authors",
    emoji: "🧑",
    description: "NodeSecure (npm) authors analysis package",
    stars: 100,
    download: 10_000
  },
  {
    name: "@nodesecure/ci",
    emoji: "⚙️",
    stars: 100,
    description: "NodeSecure tool enabling secured continuous integration",
    download: 10_000
  },
  {
    name: "@nodesecure/cli",
    emoji: "💻",
    description: "JavaScript security CLI that allow you to deeply analyze the dependency tree of a given package or local Node.js project.",
    stars: 100,
    download: 10_000
  },
  {
    name: "@nodesecure/conformance",
    emoji: "✅",
    description: "SPDX license conformance for NodeSecure",
    stars: 100,
    download: 10_000
  },
  {
    name: "@nodesecure/contact", emoji: "✉️", description: "", stars: 100, download: 10_000
  },
  {
    name: "@nodesecure/documentation-ui",
    emoji: "📚",
    description: "UI for NodeSecure tools (helps, flags etc).",
    stars: 100,
    download: 10_000
  },
  {
    name: "@nodesecure/domain-check",
    emoji: "🌐",
    description: "Node.js module which helps you to check informations about domains",
    stars: 100,
    download: 10_000
  },
  {
    name: "@nodesecure/estree-ast-utils",
    emoji: "🌲",
    description: "Utilities for AST (ESTree compliant)",
    stars: 100,
    download: 10_000
  },
  {name: "@nodesecure/flags", emoji: "🚩", description: "NodeSecure security flags", stars: 100, download: 10_000},
  {
    name: "@nodesecure/fs-walk",
    emoji: "👣",
    description: "Modern FileSystem (fs) utilities to lazy walk directories Asynchronously (but also Synchronously)",
    stars: 100,
    download: 10_000
  },
  {
    name: "@nodesecure/github",
    emoji: "🐙",
    description: "Download and Extract Github repository",
    stars: 100,
    download: 10_000
  },
  {
    name: "@nodesecure/gitlab",
    emoji: "🦊",
    description: "Download and extract gitlab repository",
    stars: 100,
    download: 10_000
  },
  {name: "@nodesecure/i18n", emoji: "🌍", description: "NodeSecure Internationalization", stars: 100, download: 10_000},
  {
    name: "@nodesecure/js-x-ray",
    emoji: "🔍",
    description: "JavaScript & Node.js open-source SAST scanner. A static analyser for detecting most common malicious patterns",
    stars: 100,
    download: 10_000
  },
  {
    name: "@nodesecure/licenses-conformance",
    emoji: "📜",
    description: "Parse spdx license expressions into structured object",
    stars: 100,
    download: 10_000
  },
  {name: "@nodesecure/mama", emoji: "🗂️", description: "Manifest Manager", stars: 100, download: 10_000},
  {
    name: "@nodesecure/npm-registry-sdk",
    emoji: "🗃️",
    description: "Node.js SDK to fetch data from the npm API.",
    stars: 100,
    download: 10_000
  },
  {name: "@nodesecure/npm-types", emoji: "📦", description: "", stars: 100, download: 10_000},
  {name: "@nodesecure/ntlp", emoji: "🧠", stars: 100, download: 10_000},
  {
    name: "@nodesecure/ossf-scorecard-sdk",
    emoji: "📈",
    description: "Node.js SDK for OpenSSF scorecard",
    stars: 100,
    download: 10_000
  },
  {name: "@nodesecure/rc", emoji: "🧾", description: "", stars: 100, download: 10_000},
  {
    name: "@nodesecure/scanner",
    emoji: "⚡",
    description: "A package API to run a static analysis of your module's dependencies. This is the CLI engine!",
    stars: 100,
    download: 10_000
  },
  {name: "@nodesecure/sec-literal", emoji: "🛡️", stars: 100, download: 10_000},
  {name: "@nodesecure/size-satisfies", emoji: "📏", stars: 100, download: 10_000},
  {name: "@nodesecure/tarball", emoji: "🧵", description: "NodeSecure tarball scanner", stars: 100, download: 10_000},
  {
    name: "@nodesecure/tree-walker",
    emoji: "🚶‍♂️",
    description: "Fetch and walk the dependency tree of a given manifest",
    stars: 100,
    download: 10_000
  },
  {name: "@nodesecure/ts-source-parser", emoji: "🔠", description: "", stars: 100, download: 10_000},
  {name: "@nodesecure/utils", emoji: "🧰", description: "Utilities for NodeSecure", stars: 100, download: 10_000},
  {
    name: "@nodesecure/vis-network",
    emoji: "🕸️",
    description: "NodeSecure vis.js network front-end module",
    stars: 100,
    download: 10_000
  },
  {
    name: "@nodesecure/vulnera",
    emoji: "vulnera.png",
    description: "Programmatically fetch security vulnerabilities with one or many strategies (NPM Audit, Sonatype, Snyk, Node.js DB).",
    stars: 100,
    download: 10_000
  }
];

const packagesContainer = document.getElementById("packages")
const packagesList = document.createElement("ul")

packagesList.classList.add("packages__list")
packagesContainer.append(packagesList)

kPackages.forEach(pkg => {
  const packagesListItem = document.createElement("li")
  packagesListItem.classList.add("packages__list-item", "project-card", "skew")
  packagesListItem.innerHTML = `
  <a href="${buildLink(pkg)}" target="_blank" rel="noopener noreferrer" class="package__link project-content">
     <article class="project-content__wrapper">
        <header class="project-header">
            ${buildEmoji(pkg)}
           <h2>${pkg.name}</h2>
        </header>
        <p class="description">${pkg.description || ''}</p>
        <footer class="project-footer">
           <span class="stars">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                    <path fill="white" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382z" clip-rule="evenodd"/>
                </svg>
                ${pkg.stars}
            </span>
           <span class="download">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <path fill="white" d="M15.22 6.268a.75.75 0 0 1 .968-.431l5.942 2.28a.75.75 0 0 1 .431.97l-2.28 5.94a.75.75 0 1 1-1.4-.537l1.63-4.251-1.086.484a11.2 11.2 0 0 0-5.45 5.173.75.75 0 0 1-1.199.19L9 12.312l-6.22 6.22a.75.75 0 0 1-1.06-1.061l6.75-6.75a.75.75 0 0 1 1.06 0l3.606 3.606a12.7 12.7 0 0 1 5.68-4.974l1.086-.483-4.251-1.632a.75.75 0 0 1-.432-.97" clip-rule="evenodd"/>
            </svg>
                ${pkg.download}
        </footer>
     </article>
   </a>
  `
  packagesList.append(packagesListItem)
})


function buildEmoji(pkg) {
  return pkg.emoji.endsWith('.png') ?
    `<img src="./images/${pkg.emoji}" alt="${pkg.name} icon" width="24" height="24" loading="lazy" class="project-emoji" />`
    : `<span>${pkg.emoji}</span>`
}

function buildLink(pkg) {
  const [_, name] = pkg.name.split("/")
  return `https://github.com/NodeSecure/${name}`
}
