// Shared header, footer, page transitions, scroll effects and demo forms.
const root = document.documentElement,
  reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
const first = !sessionStorage.getItem("wov-seen");
const page = location.pathname.split("/").pop() || "index.html";
const links = [
  ["events.html", "Events"],
  ["stories.html", "Driver stories"],
  ["music.html", "Music"],
  ["media.html", "Media"],
  ["shop.html", "Shop"],
  ["membership.html", "Membership"],
];
const cur = (p) =>
  p === page || (p === "stories.html" && page === "story.html")
    ? ' aria-current="page"'
    : "";
document.getElementById("site-header").outerHTML =
  `<header class="nav"><div class="wrap"><a class="logo" href="index.html">Wheels of Vic</a><nav aria-label="Main">${links.map((l) => `<a href="${l[0]}"${cur(l[0])}>${l[1]}</a>`).join("")}</nav></div></header>`;
document.getElementById("site-footer").outerHTML =
  `<footer><div class="wrap"><span>© 2026 Wheels of Vic, Victoria, BC</span><span>Instagram, YouTube, TikTok</span></div></footer>`;
// loader (longer on first visit) and page transition curtain
const reveal = () =>
  setTimeout(() => root.classList.remove("cover"), first ? 1300 : 200);
addEventListener("load", () => {
  sessionStorage.setItem("wov-seen", "1");
  reveal();
});
addEventListener("pageshow", (e) => {
  if (e.persisted) reveal();
});
document.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (
    !a ||
    a.target ||
    e.metaKey ||
    e.ctrlKey ||
    e.shiftKey ||
    a.origin !== location.origin ||
    (a.pathname === location.pathname && a.hash)
  )
    return;
  e.preventDefault();
  root.classList.add("cover");
  setTimeout(() => (location.href = a.href), reduce ? 0 : 550);
});
// home hero: fades back and shrinks while the next sections slide over it
const hero = document.querySelector(".hero"),
  w = document.getElementById("wheel"),
  h = document.querySelectorAll(".hero h1 span");
if (hero && !reduce) {
  let t = 0;
  addEventListener(
    "scroll",
    () => {
      if (t) return;
      t = requestAnimationFrame(() => {
        const y = scrollY,
          p = Math.min(y / innerHeight, 1);
        hero.style.opacity = 1 - p * 0.9;
        hero.style.transform = `scale(${1 - p * 0.08})`;
        w.style.transform = `rotate(${y * 0.3}deg)`;
        h.forEach(
          (s, i) =>
            (s.style.transform = `translateX(${(i ? 1 : -1) * p * 140}px)`),
        );
        t = 0;
      });
    },
    { passive: true },
  );
}
// marquee needs its content twice for a seamless loop
document
  .querySelectorAll(".marquee div")
  .forEach((m) => (m.innerHTML += m.innerHTML));
// demo forms: show a message only. Connect to an email or form service to collect real data.
document.querySelectorAll("form[data-demo]").forEach((f) =>
  f.addEventListener("submit", (e) => {
    e.preventDefault();
    f.nextElementSibling.textContent = f.dataset.demo;
    f.reset();
  }),
);
// stories
const g = document.getElementById("storyGrid");
if (g)
  g.innerHTML = STORIES.slice(0, +g.dataset.limit || 99)
    .map(
      (s) =>
        `<a class="card" href="story.html?id=${s.id}"><div class="plate" style="background-image:linear-gradient(90deg,${s.g[0]},${s.g[1]},${s.g[0]})">${s.car}</div><div class="meta"><b>${s.driver}</b><span>${s.line}</span></div></a>`,
    )
    .join("");
const sd = document.getElementById("story");
if (sd) {
  const i = Math.max(
      0,
      STORIES.findIndex(
        (s) => s.id === new URLSearchParams(location.search).get("id"),
      ),
    ),
    s = STORIES[i],
    n = STORIES[(i + 1) % STORIES.length];
  document.title = `${s.driver} | Wheels of Vic`;
  sd.innerHTML = `<h1 style="font-size:clamp(3rem,9vw,6.5rem)">${s.driver}’s ${s.car}</h1><div class="plate story-hero" style="background:linear-gradient(135deg,${s.g[0]},${s.g[1]})"></div><div class="story-body">${s.body.map((p) => `<p>${p}</p>`).join("")}</div><p><a class="btn" href="stories.html">All stories</a> <a class="btn hot" href="story.html?id=${n.id}">Next: ${n.driver}</a></p>`;
}
// scroll reveal for cards (runs once per card)
if (!reduce && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((x) => {
        if (x.isIntersecting) {
          x.target.classList.add("in");
          io.unobserve(x.target);
        }
      }),
    { threshold: 0.15 },
  );
  const arm = () =>
    document.querySelectorAll(".card,.event,.tier").forEach((c) => {
      c.classList.add("rv");
      io.observe(c);
    });
  arm();
}
