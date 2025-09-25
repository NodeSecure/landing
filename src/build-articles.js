// Import Node.js Dependencies
import fs from "node:fs";
import path from "node:path";

// Import Third-party Dependencies
import { marked } from "marked";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const inputDir = "./articles";
const outputDir = "./blog";

// processes all markdown files in articles directory
export function convertAllMarkdownArticles(authors) {
  if (!fs.existsSync(inputDir)) {
    throw new Error(`${inputDir} directory does not exist`);
  }

  const files = fs.readdirSync(inputDir).filter((file) => file.endsWith(".md"));

  const articles = files.map((file) => {
    const filePath = path.join(inputDir, file);

    return generateBlogPost(filePath);
  });

  // Generate index page
  generateBlogIndex(articles, authors);
}

function generateBlogPost(markdownFile) {
  const markdownContent = fs.readFileSync(markdownFile, "utf8");
  const fileName = path.basename(markdownFile, ".md");

  // retrieve metadata and dirty html from yaml file
  const { metadata, content } = parseYamlFile(markdownContent);

  // replace external links tags
  const contentWithLinks = content
    // 1. dev.to articles
    .replace(
      /{%\s*link\s+(https?:\/\/[^\s%]+)\s*%}/g,
      '<a href="$1" target="_blank" rel="noopener" class="external-article-link">↪ Read article</a>'
    )
    // 2. youtube videos
    .replace(
      /{%\s*youtube\s+([a-zA-Z0-9_-]{11})\s*%}/g,
      `<a href="https://www.youtube.com/watch?v=$1" 
        target="_blank" 
        rel="noopener" 
        class="external-article-link">
        ▶ Watch on YouTube
      </a>`
    // 2. github links
    ).replace(
      /{%\s*github\s+([a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+)\s*%}/g,
      '<a href="https://github.com/$1" target="_blank" rel="noopener" class="external-article-link">🔗 GitHub: $1</a>'
    );

  const htmlContent = marked.parse(contentWithLinks);

  // sanitize html
  const window = new JSDOM("").window;
  const DOMPurify = createDOMPurify(window);
  const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent, {
    ADD_ATTR: ["target", "rel", "class"]
  });

  metadata.readTime = getReadTimeEstimation(sanitizedHtmlContent);

  const baseArticleTemplate = fs.readFileSync(
    `${outputDir}/article-base-template.html`,
    "utf-8"
  );

  const articleTemplate = baseArticleTemplate.replace(
    "<article></article>",
    `
    <article>
      <div class="article-content">
        <h1 class="article-title">${metadata.title}</h1>
        ${sanitizedHtmlContent}
      </div>
    </article>`
  );

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `${fileName}.html`);
  fs.writeFileSync(outputPath, articleTemplate);

  return { ...metadata, path: `${fileName}.html` };
}

function parseYamlFile(content) {
  if (!content.startsWith("---")) {
    return { metadata: {}, content };
  }

  const lines = content.split("\n");
  let endLineIndex = -1;

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      endLineIndex = i;
      break;
    }
  }

  if (endLineIndex === -1) {
    return { metadata: {}, content };
  }

  // extract frontmatter
  const frontmatterLines = lines.slice(1, endLineIndex);
  const markdownLines = lines.slice(endLineIndex + 1);

  const markdownContent = markdownLines.join("\n").trim();

  const metadata = {};

  for (const line of frontmatterLines) {
    const trimmedLine = line.trim();
    if (trimmedLine && trimmedLine.includes(":")) {
      const [key, ...valueParts] = trimmedLine.split(":");

      const dataKey = key.trim();
      const dataValue = valueParts.join(":").trim();

      if (dataKey === "date") {
        const [day, month, year] = dataValue.split("/").map(Number);
        const date = new Date(year, month - 1, day);
        metadata[dataKey] = date;
      }
      else {
        metadata[dataKey] = dataValue;
      }
    }
  }

  return { metadata, content: markdownContent };
}

function generateBlogIndex(articles, authors) {
  const articlesList = articles
    .sort((articleA, articleB) => articleB.date - articleA.date)
    .map((article) => {
      const coreContributor = authors.filter(
        (c) => c.github === article.author
      )?.[0];

      const imgSource = coreContributor?.github
        ? `https://github.com/${coreContributor.github}.png`
        : "https://img.icons8.com/ios-glyphs/30/test-account.png";

      return `
      <div class="article-card">
        <div class="article-card-content">
          <div class="article-card-header">
            <a target="_blank" rel="noopener" href="https://github.com/${coreContributor.github}">
              <img class="authorImg" src="${imgSource}" alt="Thomas">
            </a>
            <div class="article-card-header-infos">
              <span>${coreContributor?.name || article.author}</span>
              <span style="display: flex; align-items: center; gap: 10px;">
                <span style="display: flex; align-items: center; gap: 5px;">
                  <img 
                    src="https://img.icons8.com/material-rounded/24/calendar--v1.png" 
                    alt="calendar" 
                    style="width:18px;height:18px;filter:invert(1) brightness(2);"
                  />
                  <span>${formatDate(article.date)}</span>
                </span>
                <span style="display: flex; align-items: center; gap: 5px;"> 
                  <img 
                    src="https://img.icons8.com/forma-regular/24/clock.png" 
                    alt="clock" 
                    style="width:18px;height:18px;filter:invert(1) brightness(2);"
                  />
                  <span>${article.readTime} min read</span>
                </span>
              </span>
            </div>
          </div>
          <a 
            href="${article.path}" 
            title="${article.title}" 
            class="article-link">
            <span>${article.title}</span>
          </a>
          <p>${article.description}</p>
      </div>
      </div>
      `;
    })
    .join("\n    ");

  const baseTemplate = fs.readFileSync(
    `${outputDir}/index-base-template.html`,
    "utf-8"
  );

  const indexTemplate = baseTemplate.replace(
    '<section class="articles-list"></section>',
    `
    <section class="articles-list">
      ${articlesList}
    </section>`
  );

  const indexPath = path.join(outputDir, "index.html");
  fs.writeFileSync(indexPath, indexTemplate);
}

function formatDate(date) {
  if (!(date instanceof Date)) {
    return date;
  }

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}

function getReadTimeEstimation(content) {
  // remove HTML tags to get plain text, regroup white spaces
  const text = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  // get words count, filtering empty elements out
  const wordCount = text.split(" ").filter(Boolean).length;

  // calculate minutes, round up to nearest integer - one minute min
  return Math.max(1, Math.ceil(wordCount / 200));
}

(async() => {
  const response = await fetch(
    "https://raw.githubusercontent.com/NodeSecure/Governance/main/contributors.json"
  );

  if (!response.ok) {
    throw new Error(
      `Error while fetching contributors list: ${response.status}`
    );
  }

  const contributors = await response.json();
  const authors = contributors.core;

  convertAllMarkdownArticles(authors);
})();
