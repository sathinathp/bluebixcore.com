// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }
});

// 1. Particle Canvas Engine
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let animId;
  let particles = [];
  const count = 60;
  const color = 'rgba(59, 130, 246, 0.4)';

  function resize() {
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  function init() {
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = color.replace(/[\d.]+\)$/, `${p.opacity})`);
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = color.replace(/[\d.]+\)$/, `${0.08 * (1 - dist / 120)})`);
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  resize();
  init();
  draw();

  window.addEventListener('resize', () => {
    resize();
    init();
  });
})();

// 2. Typewriter Effect
(function initTypewriter() {
  const words = ["Future", "Growth", "Success", "Career"];
  const target = document.getElementById("typewriter");
  if (!target) return;

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];
    if (!isDeleting) {
      target.textContent = currentWord.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(type, 1500);
        return;
      }
    } else {
      target.textContent = currentWord.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }
    setTimeout(type, isDeleting ? 40 : 80);
  }
  type();
})();

// 3. Header Scroll Effect & Mobile Drawer
(function initHeader() {
  const header = document.getElementById("main-header");
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");
  const iconOpen = document.getElementById("menu-icon-open");
  const iconClose = document.getElementById("menu-icon-close");

  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 10) {
        header.classList.remove("py-0", "border-gray-100");
        header.classList.add("py-1", "border-gray-200", "shadow-md");
      } else {
        header.classList.remove("py-1", "border-gray-200", "shadow-md");
        header.classList.add("py-0", "border-gray-100");
      }
    });
  }

  if (toggle && menu) {
    let isOpen = false;
    toggle.addEventListener("click", () => {
      isOpen = !isOpen;
      if (isOpen) {
        menu.classList.remove("max-h-0", "opacity-0");
        menu.classList.add("max-h-96", "opacity-100");
        if (iconOpen) iconOpen.classList.add("hidden");
        if (iconClose) iconClose.classList.remove("hidden");
      } else {
        menu.classList.remove("max-h-96", "opacity-100");
        menu.classList.add("max-h-0", "opacity-0");
        if (iconOpen) iconOpen.classList.remove("hidden");
        if (iconClose) iconClose.classList.add("hidden");
      }
    });

    document.querySelectorAll(".mobile-nav-link").forEach(link => {
      link.addEventListener("click", () => {
        isOpen = false;
        menu.classList.remove("max-h-96", "opacity-100");
        menu.classList.add("max-h-0", "opacity-0");
        if (iconOpen) iconOpen.classList.remove("hidden");
        if (iconClose) iconClose.classList.add("hidden");
      });
    });
  }
})();

// 4. Scroll Reveal & Count-up Observer
(function initObservers() {
  const reveals = document.querySelectorAll(".animate-reveal");
  const counters = document.querySelectorAll(".counter");
  let countersAnimated = false;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => revealObserver.observe(el));

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute("data-target"), 10);
          const suffix = counter.getAttribute("data-suffix") || "";
          let start = 0;
          const duration = 2000;
          const step = Math.ceil(target / (duration / 16));

          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              counter.textContent = target.toLocaleString() + suffix;
              clearInterval(timer);
            } else {
              counter.textContent = start.toLocaleString() + suffix;
            }
          }, 16);
        });
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => counterObserver.observe(c));
})();

// 5. 3D Tilt Card Effect
(function initTiltCards() {
  const cards = document.querySelectorAll(".tilt-card");
  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (y - 0.5) * -8;
      const rotateY = (x - 0.5) * 8;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    });
  });
})();

// 6. Magnetic Buttons Effect
(function initMagneticButtons() {
  const btns = document.querySelectorAll(".magnetic-btn");
  btns.forEach(btn => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0px, 0px)";
    });
  });
})();

// 7. Testimonials Carousel Controller
(function initTestimonials() {
  const testimonials = [
    {
      quote: '"Partnership with Bluebix has been amazing. Their professionalism and management skills are exceptional. We thank the team members for their effort."',
      name: "Harley Klien",
      role: "CEO, Abacus Inc",
      initials: "HK"
    },
    {
      quote: '"We have been using Bluebix staffing services for the past 10 years. Their expertise in placement has been very good. We highly recommend their services."',
      name: "Sarah Johnson",
      role: "HR Director",
      initials: "SJ"
    },
    {
      quote: '"Bluebix is an excellent aid for all our staffing needs. We have been constantly using their temporary staffing services from past 5 years."',
      name: "Michael Chen",
      role: "Operations Manager",
      initials: "MC"
    },
    {
      quote: '"We have partnered with Bluebix just a year back for recruitment purpose, and we are happy about our decision. Their courteous and prompt service is appreciated."',
      name: "Emily Roberts",
      role: "VP of Talent",
      initials: "ER"
    }
  ];

  let currentIndex = 0;
  const quoteEl = document.getElementById("testimonial-quote");
  const nameEl = document.getElementById("testimonial-name");
  const roleEl = document.getElementById("testimonial-role");
  const avatarEl = document.getElementById("testimonial-avatar");
  const prevBtn = document.getElementById("testimonial-prev");
  const nextBtn = document.getElementById("testimonial-next");
  const dots = document.querySelectorAll("#testimonial-dots .dot-btn");
  const miniCards = document.querySelectorAll(".t-mini-card");

  function update(index) {
    currentIndex = index;
    const item = testimonials[currentIndex];
    
    if (quoteEl) {
      quoteEl.style.opacity = '0';
      setTimeout(() => {
        quoteEl.textContent = item.quote;
        if (nameEl) nameEl.textContent = item.name;
        if (roleEl) roleEl.textContent = item.role;
        if (avatarEl) avatarEl.textContent = item.initials;
        quoteEl.style.opacity = '1';
      }, 150);
    }

    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.className = "dot-btn h-2 w-8 rounded-full bg-gradient-to-r from-[#2563eb] to-[#3b82f6] transition-all duration-500";
      } else {
        dot.className = "dot-btn h-2 w-2 rounded-full bg-border hover:bg-muted-foreground transition-all duration-500";
      }
    });

    miniCards.forEach((card, i) => {
      if (i === currentIndex) {
        card.className = "t-mini-card group relative overflow-hidden rounded-2xl border border-[#2563eb]/30 bg-[#2563eb]/5 p-5 text-left shadow-lg transition-all duration-500";
        const badge = card.querySelector(".rounded-xl");
        if (badge) badge.className = "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563eb] to-[#3b82f6] text-xs font-bold text-white";
      } else {
        card.className = "t-mini-card group relative overflow-hidden rounded-2xl border border-border/50 bg-white p-5 text-left transition-all duration-500 hover:border-[#2563eb]/20 hover:shadow-md";
        const badge = card.querySelector(".rounded-xl");
        if (badge) badge.className = "flex h-10 w-10 items-center justify-center rounded-xl bg-[#94a3b8] text-xs font-bold text-white";
      }
    });
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      update((currentIndex - 1 + testimonials.length) % testimonials.length);
    });

    nextBtn.addEventListener("click", () => {
      update((currentIndex + 1) % testimonials.length);
    });

    dots.forEach((dot, i) => dot.addEventListener("click", () => update(i)));
    miniCards.forEach((card, i) => card.addEventListener("click", () => update(i)));
  }
})();

// 8. Scroll to Top Controller
(function initScrollToTop() {
  const btn = document.getElementById("scroll-to-top");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      btn.classList.remove("translate-y-4", "opacity-0", "pointer-events-none");
      btn.classList.add("translate-y-0", "opacity-100");
    } else {
      btn.classList.remove("translate-y-0", "opacity-100");
      btn.classList.add("translate-y-4", "opacity-0", "pointer-events-none");
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
