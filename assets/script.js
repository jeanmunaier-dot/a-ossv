// ---- Sticky header shadow on scroll ----
const header = document.getElementById("siteHeader");
const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// ---- Mobile nav toggle ----
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("open");
    navLinks.classList.toggle("open");
  });
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navToggle.classList.remove("open");
      navLinks.classList.remove("open");
    })
  );
}

// ---- Scroll reveal ----
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
);
revealEls.forEach((el) => revealObserver.observe(el));

// ---- Product card pointer glow (subtle tilt) ----
document.querySelectorAll(".product-card").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * -4;
    const ry = ((x / rect.width) - 0.5) * 4;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  });
  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

// ---- Animated stat counter ----
document.querySelectorAll("[data-count-to]").forEach((el) => {
  const target = parseFloat(el.getAttribute("data-count-to"));
  const suffix = el.getAttribute("data-suffix") || "";
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      obs.unobserve(el);
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  });
  obs.observe(el);
});

// ---- Contact form -> WhatsApp lead message (no backend on static hosting) ----
const leadForm = document.getElementById("leadForm");
if (leadForm) {
  leadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(leadForm);
    const nome = (data.get("nome") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const telefone = (data.get("telefone") || "").toString().trim();
    const assunto = (data.get("assunto") || "").toString().trim();
    const mensagem = (data.get("mensagem") || "").toString().trim();

    const lines = [
      "Olá! Vim pelo site da Aços Valiriano e gostaria de uma cotação.",
      nome && `Nome: ${nome}`,
      email && `E-mail: ${email}`,
      telefone && `Telefone: ${telefone}`,
      assunto && `Assunto: ${assunto}`,
      mensagem && `Mensagem: ${mensagem}`,
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/message/XRI6LP23MOQJP1?text=${encodeURIComponent(lines)}`, "_blank", "noopener");
  });
}
