// BILLBOARD SLIDES: add pictures to the images/ folder, then list them here.
// src: image path like "images/meet1.jpg" (leave "" to show a colour block). href: optional link.
const BILLBOARD = [
  {
    // Meets
    src: "images/Meets.jpg",
    g: ["#1d4a5c", "#2f7a8a"],
    title: "Fall meet",
    text: "Date and place to be announced.",
    href: "events.html",
    cta: "Event details",
  },
  {
    // Driver Stories
    src: "images/Driver_stories.jpg",
    g: ["#8a2a1a", "#d9391f"],
    title: "Driver stories",
    text: "The people behind Victoria’s cars.",
    href: "stories.html",
    cta: "Read stories",
  },
  // {
  //   // Music
  //   src: "",
  //   g: ["#2b3cff", "#6b78ff"],
  //   title: "Live jazz and R&B",
  //   text: "Local artists, local roads.",
  //   href: "music.html",
  //   cta: "See the music",
  // },
  {
    // Photography
    src: "",
    g: ["#3b5b45", "#6f9a7c"],
    title: "Photo and film",
    text: "Shot around Greater Victoria.",
    href: "media.html",
    cta: "Watch and view",
  },
];
(() => {
  const el = document.getElementById("billboard");
  if (!el) return;
  const track = el.querySelector(".track"),
    dots = el.querySelector(".dots"),
    bar = el.querySelector(".bar i");
  const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  let i = 0,
    timer;
  track.innerHTML = BILLBOARD.map(
    (s) =>
      `<div class="slide" style="background-image:${s.src ? `url(${s.src})` : `linear-gradient(135deg,${s.g[0]},${s.g[1]})`}"><div class="cap"><h3>${s.title}</h3><p>${s.text}</p>${s.href ? `<a class="btn" href="${s.href}">${s.cta || "Learn more"}</a>` : ""}</div></div>`,
  ).join("");
  dots.innerHTML = BILLBOARD.map(
    (s, k) => `<button aria-label="Show slide ${k + 1}"></button>`,
  ).join("");
  const restart = () => {
    clearTimeout(timer);
    bar.classList.remove("run");
    void bar.offsetWidth;
    if (reduce) return;
    bar.classList.add("run");
    timer = setTimeout(() => go(i + 1), 5000);
  };
  const go = (n) => {
    i = (n + BILLBOARD.length) % BILLBOARD.length;
    track.style.transform = `translateX(-${i * 100}%)`;
    [...dots.children].forEach((d, k) => d.classList.toggle("on", k === i));
    restart();
  };
  dots.onclick = (e) => {
    const k = [...dots.children].indexOf(e.target);
    if (k > -1) go(k);
  };
  el.querySelector(".prev").onclick = () => go(i - 1);
  el.querySelector(".next").onclick = () => go(i + 1);
  el.addEventListener("mouseenter", () => {
    clearTimeout(timer);
    bar.classList.remove("run");
  });
  el.addEventListener("mouseleave", restart);
  go(0);
})();
