document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  const isHome = path === "/" || path.endsWith("/index.html");
  if (!isHome) return;

  const showcase = document.querySelector(".showcase");
  if (!showcase) return;

  const video = document.createElement("video");
  video.src = "./video";
  video.muted = true;
  video.autoplay = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = "auto";
  video.controls = false;
  video.setAttribute(
    "controlsList",
    "nodownload nofullscreen noremoteplayback"
  );
  video.setAttribute("disablePictureInPicture", "");

  Object.assign(video.style, {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    position: "absolute",
    inset: "0",
  });

  showcase.appendChild(video);

  const STORAGE_KEY = "showcase_video_time";
  const savedTime = localStorage.getItem(STORAGE_KEY);
  if (savedTime) video.currentTime = parseFloat(savedTime);

  setInterval(() => {
    if (!video.paused && !video.seeking) {
      localStorage.setItem(STORAGE_KEY, video.currentTime);
    }
  }, 500);

  const tryPlay = () => {
    video.play().catch(() => {
      window.addEventListener(
        "touchstart",
        () => {
          video.play();
        },
        { once: true }
      );
    });
  };

  tryPlay();
});
