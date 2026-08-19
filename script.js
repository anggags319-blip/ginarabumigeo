/* ============================================================
   GINARA BUMI KONSTRUKSI — script.js
   ============================================================ */

// ===== YEAR =====
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();


// ===== MOBILE MENU =====
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        menuToggle.classList.toggle("active");
    });

    navMenu.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            menuToggle.classList.remove("active");
        });
    });
}


// ===== STICKY HEADER =====
const header = document.getElementById("header");

window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}, { passive: true });


// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
});

revealEls.forEach(el => revealObserver.observe(el));


// ===== COUNTER ANIMATION =====
function animateCount(el, target, duration = 1800) {
    let start = null;
    const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        // Ease out quad
        const eased = 1 - (1 - progress) * (1 - progress);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
    };
    requestAnimationFrame(step);
}

const counterEls = document.querySelectorAll(".count");
let countersStarted = false;

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
            countersStarted = true;
            counterEls.forEach(el => {
                const target = parseInt(el.getAttribute("data-target"), 10);
                animateCount(el, target);
            });
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector(".hero-stats");
if (heroStats) counterObserver.observe(heroStats);


// ===== FAQ ACCORDION =====
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
    const btn = item.querySelector(".faq-q");
    const answer = item.querySelector(".faq-a");

    btn.addEventListener("click", () => {
        const isOpen = btn.getAttribute("aria-expanded") === "true";

        // Close all others
        faqItems.forEach(other => {
            if (other !== item) {
                other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
                other.querySelector(".faq-a").classList.remove("open");
            }
        });

        // Toggle current
        btn.setAttribute("aria-expanded", !isOpen);
        answer.classList.toggle("open", !isOpen);
    });
});


// ===== PARTICLE CANVAS =====
const canvas = document.getElementById("particleCanvas");

if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animFrameId;

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.35;
            this.speedY = (Math.random() - 0.5) * 0.35;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.life = 0;
            this.maxLife = Math.random() * 300 + 150;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life++;

            if (this.life > this.maxLife) this.reset();
        }

        draw() {
            const fade = Math.min(this.life / 30, 1) * Math.min((this.maxLife - this.life) / 30, 1);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(184, 148, 63, ${this.opacity * fade})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 10000));
        for (let i = 0; i < count; i++) {
            const p = new Particle();
            p.life = Math.random() * p.maxLife;
            particles.push(p);
        }
    }

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(184, 148, 63, ${(1 - dist / 100) * 0.06})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawLines();
        animFrameId = requestAnimationFrame(animate);
    }

    // Only run if hero is visible
    const heroSection = document.querySelector(".hero");
    const canvasObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                resizeCanvas();
                initParticles();
                animate();
            } else {
                cancelAnimationFrame(animFrameId);
            }
        });
    });

    if (heroSection) canvasObserver.observe(heroSection);

    window.addEventListener("resize", () => {
        resizeCanvas();
        initParticles();
    }, { passive: true });
}


// ===== SMOOTH ACTIVE NAV LINK =====
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.style.color = "";
        if (link.getAttribute("href") === `#${current}`) {
            link.style.color = "rgba(255,255,255,0.95)";
        }
    });
}, { passive: true });


// ===== PORTFOLIO CARD TILT =====
document.querySelectorAll(".portfolio-visual").forEach(card => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.02)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "";
        card.style.transition = "transform .5s ease";
    });

    card.addEventListener("mouseenter", () => {
        card.style.transition = "transform .1s ease";
    });
});