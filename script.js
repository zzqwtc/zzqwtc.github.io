const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const linkHtml = (link) =>
  `<a href="${escapeHtml(link.url || "#")}">${escapeHtml(link.label || "link")}</a>`;

const getJson = async (path) => {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Unable to load ${path}`);
  return response.json();
};

const byId = (id) => document.getElementById(id);

const renderProfile = (profile) => {
  document.title = `${profile.name || "Academic"} - Homepage`;
  byId("profile-name").textContent = profile.name || "";
  byId("profile-role").textContent = profile.role || "";
  byId("profile-department").textContent = profile.department || "";
  byId("profile-university").textContent = profile.university || "";
  byId("profile-location").textContent = profile.location || "";
  byId("profile-email").textContent = profile.email || "";

  const photo = byId("profile-photo");
  photo.src = profile.photo || "assets/portrait-placeholder.png";
  photo.alt = `Portrait of ${profile.name || "profile owner"}`;

  byId("profile-links").innerHTML = (profile.links || [])
    .map(linkHtml)
    .join('<span>|</span>');

  const scholar = (profile.links || []).find((link) => /scholar/i.test(link.label || ""));
  if (scholar) byId("scholar-link").href = scholar.url;

  byId("about-content").innerHTML = (profile.about || [])
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
};

const renderNews = (items) => {
  byId("news-list").innerHTML = items
    .map(
      (item) => `<li><time>${escapeHtml(item.date)}</time><span>${escapeHtml(item.text)}</span></li>`
    )
    .join("");
};

const renderTutorials = (items) => {
  byId("tutorial-list").innerHTML = items
    .map(
      (item) => `
        <div class="tutorial-item">
          <img src="${escapeHtml(item.thumbnail || "assets/research-visual.png")}" alt="Tutorial thumbnail" width="120" height="82" />
          <div>
            <p><a href="${escapeHtml(item.links?.[0]?.url || "#")}">${escapeHtml(item.title)}</a></p>
            <p class="venue">${escapeHtml(item.venue)}</p>
            <p>${(item.links || []).map(linkHtml).join('<span class="sep">|</span>')}</p>
          </div>
        </div>`
    )
    .join("");
};

const renderPublications = (items) => {
  const categories = [...new Set(items.map((item) => item.category || "Publications"))];

  byId("publication-list").innerHTML = categories
    .map((category) => {
      const papers = items.filter((item) => (item.category || "Publications") === category);
      return `
        <h3>${escapeHtml(category)}</h3>
        <ul class="paper-list">
          ${papers.map(renderPaper).join("")}
        </ul>`;
    })
    .join("");
};

const renderPaper = (paper) => {
  const hasThumb = Boolean(paper.thumbnail);
  const links = paper.links || [];
  const primary = links[0] || { label: "pdf", url: "#" };
  const extra = links.slice(1).map(linkHtml).join('<span>|</span>');

  return `
    <li class="paper-item ${hasThumb ? "paper-item--thumb" : "paper-item--text"}">
      ${
        hasThumb
          ? `<span class="paper-thumb"><img src="${escapeHtml(paper.thumbnail)}" alt="" width="92" height="64" /></span>`
          : ""
      }
      <span class="paper-badge">${linkHtml(primary)}</span>
      <span class="paper-body">
        <a class="paper-title" href="${escapeHtml(primary.url || "#")}">${escapeHtml(paper.title)}</a>
        <br />
        ${escapeHtml(paper.authors)}
        <br />
        <em>${escapeHtml(paper.venue)}</em>, ${escapeHtml(paper.year)}
        ${extra ? `<br />${extra}` : ""}
      </span>
    </li>`;
};

const renderServices = (items) => {
  byId("service-list").innerHTML = items
    .map((item) => `<li>${escapeHtml(item.text || item)}</li>`)
    .join("");
};

const renderEducation = (items) => {
  byId("education-list").innerHTML = items
    .map(
      (item) => `
        <p>
          <strong>${escapeHtml(item.institution)}</strong>
          <br />
          ${escapeHtml(item.degree)}, ${escapeHtml(item.period)}
          ${item.extra ? `<br />${escapeHtml(item.extra)}` : ""}
        </p>`
    )
    .join("");
};

const renderLinks = (items) => {
  byId("useful-links").innerHTML = items
    .map((item) => `<li>${linkHtml(item)}</li>`)
    .join("");
};

const main = async () => {
  try {
    const [profile, news, tutorials, publications, services, education, links] = await Promise.all([
      getJson("content/profile.json"),
      getJson("content/news.json"),
      getJson("content/tutorials.json"),
      getJson("content/publications.json"),
      getJson("content/services.json"),
      getJson("content/education.json"),
      getJson("content/links.json")
    ]);

    renderProfile(profile);
    renderNews(news);
    renderTutorials(tutorials);
    renderPublications(publications);
    renderServices(services);
    renderEducation(education);
    renderLinks(links);
  } catch (error) {
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<p class="load-error">Content failed to load. Please check the JSON files in the content folder.</p>`
    );
    console.error(error);
  }
};

main();
