document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector("#search-input");
  const searchBtn = document.querySelector("#search-btn");
  if (!searchInput || !searchBtn) return;

  const productContainers = [
    ...document.querySelectorAll(
      "#deals, .deals, [data-products='true'], .products"
    ),
  ];
  const products = [...document.querySelectorAll(".product-card")];
  if (products.length === 0) return;

  const noMatchMsg = document.createElement("p");
  Object.assign(noMatchMsg.style, {
    display: "none",
    textAlign: "center",
    marginTop: "20px",
    color: "var(--text-clr)",
    fontFamily: '"Montserrat", sans-serif',
    fontSize: "0.95rem",
  });

  const lastContainer =
    productContainers[productContainers.length - 1] || document.body;
  lastContainer.insertAdjacentElement("afterend", noMatchMsg);

  let activeIndex = -1;
  let visibleProducts = [...products];

  const ghost = document.createElement("div");
  Object.assign(ghost.style, {
    position: "absolute",
    pointerEvents: "none",
    color: "#999",
    whiteSpace: "pre",
    overflow: "hidden",
  });

  const wrapper = searchInput.parentElement;
  wrapper.style.position = "relative";
  wrapper.appendChild(ghost);

  function syncGhostStyle() {
    const s = getComputedStyle(searchInput);
    Object.assign(ghost.style, {
      font: s.font,
      padding: s.padding,
      border: s.border,
      lineHeight: s.lineHeight,
      top: searchInput.offsetTop + "px",
      left: searchInput.offsetLeft + "px",
      width: searchInput.clientWidth + "px",
      height: searchInput.clientHeight + "px",
    });
  }

  function fuzzyScore(text, query) {
    text = text.toLowerCase();
    query = query.toLowerCase();
    if (!query) return 0;
    if (text === query) return 1000;
    if (text.startsWith(query)) return 500 - text.length;
    const index = text.indexOf(query);
    if (index !== -1) return 300 - index;
    return -1;
  }

  function clearHighlights() {
    products.forEach((p) => {
      const title = p.querySelector(".product-info h3");
      const desc = p.querySelector(".product-info p");
      if (title) title.innerHTML = title.textContent;
      if (desc) desc.innerHTML = desc.textContent;
    });
  }

  function scrollToProducts() {
    const container = productContainers[0];
    if (container)
      container.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function pauseAllVideos() {
    document.querySelectorAll(".product-video").forEach((v) => v.pause());
  }

  function resumeVisibleVideos() {
    visibleProducts.forEach((product) => {
      const video = product.querySelector(".product-video");
      if (video) video.play().catch(() => {});
    });
  }

  function resetSearch() {
    clearHighlights();
    products.forEach((p) => (p.style.display = ""));
    visibleProducts = [...products];
    noMatchMsg.style.display = "none";
    activeIndex = -1;
    ghost.textContent = "";
    resumeVisibleVideos();
  }

  function updateGhostText(value) {
    if (!value) {
      ghost.textContent = "";
      return;
    }

    const match = products
      .map((p) => p.querySelector(".product-info h3")?.textContent || "")
      .find((t) => t.toLowerCase().startsWith(value.toLowerCase()));

    if (!match) {
      ghost.textContent = "";
      return;
    }

    const remaining = match.slice(value.length);
    ghost.textContent = " ".repeat(value.length) + remaining;
  }

  function liveSearch() {
    const query = searchInput.value.trim().toLowerCase();
    clearHighlights();

    if (!query) {
      resetSearch();
      return;
    }

    scrollToProducts();

    const scored = products
      .map((product) => {
        const name =
          product.querySelector(".product-info h3")?.textContent || "";
        const desc =
          product.querySelector(".product-info p")?.textContent || "";
        const score = Math.max(
          fuzzyScore(name, query),
          fuzzyScore(desc, query)
        );
        return { product, score };
      })
      .filter((x) => x.score >= 0)
      .sort((a, b) => b.score - a.score);

    visibleProducts = scored.map((x) => x.product);

    products.forEach((p) => (p.style.display = "none"));
    visibleProducts.forEach((p) => (p.style.display = ""));

    if (visibleProducts.length === 0) {
      noMatchMsg.textContent = `No results found for "${query}".`;
      noMatchMsg.style.display = "block";
      pauseAllVideos();
    } else {
      noMatchMsg.style.display = "none";
      resumeVisibleVideos();
    }
  }

  function performExactSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      resetSearch();
      return;
    }

    const exact = products.filter((p) => {
      const name =
        p.querySelector(".product-info h3")?.textContent.toLowerCase() || "";
      return name === query;
    });

    if (exact.length > 0) {
      products.forEach((p) => (p.style.display = "none"));
      exact.forEach((p) => (p.style.display = ""));
      visibleProducts = exact;
      scrollToProducts();
    } else {
      liveSearch();
    }
  }

  function updateActiveHighlight() {
    visibleProducts.forEach((p, index) => {
      p.classList.toggle("active-search-item", index === activeIndex);
    });
    if (visibleProducts[activeIndex]) {
      visibleProducts[activeIndex].scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
  }

  syncGhostStyle();
  window.addEventListener("resize", syncGhostStyle);

  searchInput.addEventListener("input", () => {
    const value = searchInput.value;
    updateGhostText(value);
    if (!value) {
      resetSearch();
      return;
    }
    liveSearch();
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (visibleProducts.length > 0) {
        activeIndex = (activeIndex + 1) % visibleProducts.length;
        updateActiveHighlight();
      }
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (visibleProducts.length > 0) {
        activeIndex =
          (activeIndex - 1 + visibleProducts.length) % visibleProducts.length;
        updateActiveHighlight();
      }
    }

    if (e.key === "Enter") {
      e.preventDefault();
      performExactSearch();
    }

    if (e.key === "Escape") {
      searchInput.value = "";
      resetSearch();
    }
  });

  searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!searchInput.value.trim()) {
      resetSearch();
      return;
    }
    performExactSearch();
  });
});
