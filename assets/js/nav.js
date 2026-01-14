const current = document.getElementById("current");
const toggle = document.getElementById("nav-toggle");
const links = document.getElementById("nav-links");

/* =========================
   COLLECT LINKS (absolute)
========================= */
const allLinks = Array.from(links.querySelectorAll("a")).map((a) => {
  const url = new URL(a.getAttribute("href"), window.location.href);
  return {
    name: a.dataset.name,
    url: url,
    file: url.pathname.split("/").pop() || "index.html",
  };
});

/* =========================
   CURRENT PAGE
========================= */
function getCurrentFile() {
  let file = window.location.pathname.split("/").pop();
  return file === "" ? "index.html" : file;
}

const currentFile = getCurrentFile();

/* =========================
   FIND ACTIVE LINK
========================= */
const active =
  allLinks.find((l) => l.file === currentFile) ||
  allLinks.find((l) => l.file === "index.html");

current.textContent = active.name;

/* =========================
   BUILD NAV
========================= */
function rebuildLinks() {
  const others = allLinks.filter((l) => l.name !== active.name);

  links.innerHTML = others
    .map(
      (l, i) =>
        `<a href="${l.url.pathname}" data-name="${l.name}">${l.name}${
          i < others.length - 1 ? "," : ""
        }</a>`
    )
    .join(" ");

  attachEvents();
  closeNav();
}

/* =========================
   LINK HANDLING
========================= */
function attachEvents() {
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = a.href;
    });
  });
}

/* =========================
   VISIBILITY
========================= */
function openNav() {
  links.classList.add("show");
  links.classList.remove("hidden");
  links.style.pointerEvents = "auto";
  toggle.classList.add("open");
}

function closeNav() {
  links.classList.remove("show");
  links.classList.add("hidden");
  links.style.pointerEvents = "none";
  toggle.classList.remove("open");
}

/* =========================
   TOGGLE
========================= */
toggle.addEventListener("click", () => {
  links.classList.contains("show") ? closeNav() : openNav();
});

/* =========================
   SAFETY
========================= */
window.addEventListener("resize", closeNav);

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", rebuildLinks);
