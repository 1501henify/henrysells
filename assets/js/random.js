function runShuffle() {
  const container = document.querySelector(".deals");
  if (!container) return;

  const cards = [...container.querySelectorAll(".product-card")];
  if (cards.length === 0) return;

  let savedOrder = localStorage.getItem("productOrder");
  savedOrder = savedOrder ? JSON.parse(savedOrder) : null;

  if (!savedOrder) {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const frag = document.createDocumentFragment();
    shuffled.forEach((c) => frag.appendChild(c));
    container.appendChild(frag);

    localStorage.setItem(
      "productOrder",
      JSON.stringify(shuffled.map((c) => c.dataset.product))
    );
  } else {
    const map = {};
    cards.forEach((c) => (map[c.dataset.product] = c));

    const frag = document.createDocumentFragment();
    savedOrder.forEach((id) => map[id] && frag.appendChild(map[id]));

    container.appendChild(frag);
  }
}

// Wait for DOM, then wait for loader if needed
document.addEventListener("DOMContentLoaded", () => {
  if (window.__firstLoad__) {
    window.addEventListener("site-initial-load-complete", runShuffle);
  } else {
    runShuffle();
  }
});
