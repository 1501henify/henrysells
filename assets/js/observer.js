document.addEventListener("DOMContentLoaded", () => {
  const videos = Array.from(document.querySelectorAll(".product-video"));
  const visibleSet = new Set();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      videos.forEach((v) => v.pause());
    } else {
      visibleSet.forEach((i) => {
        videos[i].play().catch(() => {});
      });
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const index = videos.indexOf(entry.target);
        const video = entry.target;

        if (entry.isIntersecting) {
          visibleSet.add(index);
          if (video.ended) video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          visibleSet.delete(index);
          video.pause();
        }
      });
    },
    { threshold: 0.65 }
  );

  videos.forEach((v) => {
    observer.observe(v);
    v.muted = true;
    v.playsInline = true;
    v.preload = "metadata";
    v.loop = true;
    v.pause();
  });
});
