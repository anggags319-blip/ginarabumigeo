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


/* ============================================
   ARTICLE DATA & MODAL INTERACTIVITY (SEO)
   ============================================ */

const ARTICLES_DATA = {
    "artikel-sondir-pbg": {
        id: "artikel-sondir-pbg",
        title: "Panduan Lengkap Uji Sondir CPT (2.5T & 5T) untuk Syarat PBG/IMB Gedung di Jogja & Jateng",
        category: "Sondir & PBG",
        readTime: "6 min baca",
        author: "Tim Geoteknik",
        date: "20 Agustus 2026",
        waMessage: "Halo Ginara Bumi Geoteknik, saya telah membaca artikel tentang Uji Sondir CPT untuk PBG dan ingin berkonsultasi mengenai pengujian tanah lokasi proyek saya.",
        content: `
            <p>Pengujian tanah dengan <strong>Cone Penetration Test (CPT)</strong> atau yang populer dikenal sebagai <em>Uji Sondir</em> merupakan pengujian lapangan wajib yang dipersyaratkan oleh Tim Ahli Bangunan Gedung (TABG) Dinas Pekerjaan Umum di Daerah Istimewa Yogyakarta (Sleman, Bantul, Gunungkidul, Yogyakarta) maupun Jawa Tengah & Jawa Timur untuk penerbitan Persetujuan Bangunan Gedung (PBG) pengganti IMB.</p>
            
            <div class="modal-highlight-box">
                <strong>Mengapa Uji Sondir Wajib Sebelum Pembangunan?</strong><br>
                Uji sondir menentukan besarnya nilai perlawanan konus (qc) dan hambatan lekat (fs). Tanpa data sondir terkalibrasi, perencanaan fondasi gedung hanya berdasarkan andaikan (asumsi), yang berisiko fatal memicu penurunan fondasi tidak merata (differential settlement) hingga keretakan struktur utama gedung.
            </div>

            <h4>1. Jenis Uji Sondir: 2,5 Ton vs 5 Ton (Heavy Duty)</h4>
            <p>Ginara Bumi Geoteknik menyediakan dua kapasitas alat sondir lapangan sesuai dengan tipe beban gedung yang direncanakan:</p>

            <div class="modal-table-wrap">
                <table class="modal-table">
                    <thead>
                        <tr>
                            <th>Kapasitas Sondir</th>
                            <th>Peruntukan Konstruksi</th>
                            <th>Target Kedalaman &amp; Konus (qc)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Sondir Ringan (2.5 Ton)</strong></td>
                            <td>Rumah tinggal 1-3 lantai, ruko, perkantoran sedang, &amp; pagar panel.</td>
                            <td>Hingga qc &ge; 150 - 200 kg/cm² atau kedalaman 5 - 15 meter.</td>
                        </tr>
                        <tr>
                            <td><strong>Sondir Heavy Duty (5.0 Ton)</strong></td>
                            <td>Gedung bertingkat 4+, pabrik industri, pondasi tiang pancang/bored pile.</td>
                            <td>Hingga qc &ge; 250 - 500 kg/cm² atau menembus lapisan pasir padat/kerikil.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h4>2. Memahami Kurva Hasil Test &amp; Grafik Sondir</h4>
            <p>Laporan pengujian sondir dari kami menyajikan grafik hubungan kedalaman terhadap <em>Perlawanan Konus (qc)</em>, <em>Hambatan Lekat (fs)</em>, serta <em>Total Friction (JHP)</em>. Dari grafik ini, engineer struktur dapat dengan mudah menghitung:</p>
            <ul>
                <li><strong>Kedalaman Lapisan Tanah Keras:</strong> Ditandai saat pembacaan manometer mencapai nilai qc &ge; 150 kg/cm².</li>
                <li><strong>Kapasitas Daya Dukung Izin (Q-allowable):</strong> Menghitung daya dukung fondasi dangkal (footplate/cakar ayam) maupun fondasi tiang.</li>
                <li><strong>Potensi Hambatan Geser Tanah:</strong> Penting untuk perhitungan gaya gesek selimut tiang pancang.</li>
            </ul>

            <h4>3. Standar Acuan &amp; Kelengkapan Berkas PBG</h4>
            <p>Seluruh proses pengujian sondir Ginara Bumi Geoteknik mengacu pada <strong>SNI 2827:2008</strong> dan disajikan lengkap dengan sertifikat kalibrasi alat uji. Laporan siap dilampirkan langsung ke sistem SIMBG kementerian untuk verifikasi kelayakan teknis perizinan gedung Anda.</p>
        `
    },
    "artikel-bor-spt": {
        id: "artikel-bor-spt",
        title: "Pentingnya Bor Mesin SPT & Sampling Soil UDS dalam Perencanaan Fondasi Dalam Gedung Bertingkat",
        category: "Bor & Soil Test",
        readTime: "7 min baca",
        author: "Tim Geoteknik",
        date: "20 Agustus 2026",
        waMessage: "Halo Ginara Bumi Geoteknik, saya tertarik dengan layanan Bor Mesin SPT & UDS Soil Sampling untuk perencanaan gedung bertingkat.",
        content: `
            <p>Untuk bangunan bertingkat menengah hingga tinggi (high-rise building), jembatan, dan struktur industri berat, pengujian perlawanan tanah permukaan seperti sondir tidaklah cukup. Diperlukan penyelidikan tanah dalam menggunakan <strong>Bor Mesin Core Boring</strong> dilengkapi dengan <strong>Standard Penetration Test (SPT)</strong> dan pengujian sampel tanah laboratorium.</p>

            <div class="modal-highlight-box">
                <strong>Mengapa Bor Mesin SPT Dibutuhkan?</strong><br>
                Mesin bor mampu menembus lapisan batuan keras, kerikil padat, dan tanah keras berlapis yang tidak bisa ditembus konus sondir biasa, sekaligus mengukur kepadatan relatif tanah pada tiap interval kedalaman 1,5 hingga 2,0 meter.
            </div>

            <h4>1. Prosedur Uji Standard Penetration Test (SPT)</h4>
            <p>Pengujian SPT dilakukan dengan menatapkan penumbuk beban standar seberat 63,5 kg yang dijatuhkan secara bebas dari ketinggian 76 cm ke stang bor. Jumlah pukulan untuk memasukkan tabung sampel Split Spoon Sampler sejauh 30 cm terakhir dicatat sebagai nilai <strong>N-SPT</strong>.</p>

            <h4>2. Pengambilan Sampel UDS (Undisturbed Soil Sampling)</h4>
            <p>Selain sampel terganggu (disturbed sample) dari mata bor, tim kami mengambil contoh tanah tidak terganggu (UDS) menggunakan tabung dinding tipis <em>Shelby Tube</em>. Tabung ini disegel lilin khusus untuk menjaga kadar air dan struktur alami tanah sebelum diuji di laboratorium mekanika tanah.</p>

            <div class="modal-table-wrap">
                <table class="modal-table">
                    <thead>
                        <tr>
                            <th>Uji Laboratorium Soil</th>
                            <th>Parameter Yang Dihasilkan</th>
                            <th>Aplikasi Desain Struktur</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Triaxial UU / CU</strong></td>
                            <td>Kohesi (c) &amp; Sudut Geser Dalam (&phi;)</td>
                            <td>Stabilitas lereng &amp; daya dukung tanah dasar.</td>
                        </tr>
                        <tr>
                            <td><strong>Konsolidasi (Consolidation)</strong></td>
                            <td>Indeks Kompresi (Cc) &amp; Coefficient (Cv)</td>
                            <td>Estimasi besarnya penurunan tanah terhadap waktu.</td>
                        </tr>
                        <tr>
                            <td><strong>Sifat Indeks (Atterberg)</strong></td>
                            <td>Batas Cair (LL), Batas Plastis (PL), PI</td>
                            <td>Klasifikasi jenis tanah (USCS &amp; AASHTO).</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h4>3. Aplikasi pada Desain Bored Pile &amp; Tiang Pancang</h4>
            <p>Data N-SPT dan uji laboratorium mekanika tanah dari Ginara Bumi Geoteknik menjadi basis utama engineer geoteknik dalam menghitung <em>end bearing capacity</em> (daya dukung ujung) dan <em>skin friction</em> (gesekan selimut) tiang pancang di wilayah DIY, Semarang, Solo, Surabaya, dan kota-kota sekitarnya.</p>
        `
    },
    "artikel-geolistrik-akuifer": {
        id: "artikel-geolistrik-akuifer",
        title: "Metode Geolistrik Resistivitas 2D: Solusi Akurat Memetakan Akuifer & Mencegah Sumur Bor Kering",
        category: "Geofisika & Air",
        readTime: "8 min baca",
        author: "Tim Geofisika",
        date: "20 Agustus 2026",
        waMessage: "Halo Ginara Bumi Geoteknik, saya butuh penawaran survey Geolistrik 2D untuk pencarian lokasi akuifer air tanah.",
        content: `
            <p>Pengeboran sumur dalam (deep well) untuk kebutuhan industri, perhotelan, perumahan, dan rumah sakit tanpa survey pendahuluan memiliki risiko kegagalan tinggi akibat sumur bor kering atau mendapatkan air berbau dan asin. <strong>Survey Geolistrik Resistivitas 2D</strong> adalah metode geofisika non-destruktif ilmiah untuk memetakan kondisi bawah permukaan sebelum pengeboran dimulai.</p>

            <div class="modal-highlight-box">
                <strong>Prinsip Kerja Geolistrik:</strong><br>
                Geolistrik menginjeksikan arus listrik searah ke dalam tanah melalui elektroda arus dan mengukur beda potensial yang dihasilkan. Perbedaan tahanan jenis (resistivitas) membedakan jenis batuan, kadar air, dan zona akuifer secara presisi.
            </div>

            <h4>1. Konfigurasi Schlumberger vs Wenner</h4>
            <p>Ginara Bumi Geoteknik mengoperasikan instrumen geolistrik multi-channel mutakhir dengan dua konfigurasi utama sesuai kebutuhan proyek:</p>
            <ul>
                <li><strong>Konfigurasi Schlumberger (Vertical Electrical Sounding / VES):</strong> Sangat efektif untuk pendeteksian kedalaman lapisan tanah dan akuifer dalam secara vertikal (1D) hingga kedalaman &gt; 150 meter.</li>
                <li><strong>Konfigurasi Wenner / Dipole-Dipole (2D Imaging):</strong> Menghasilkan penampang melintang 2D pencitraan kontur resistivitas tanah secara horizontal dan vertikal untuk mendeteksi rongga batuan, sesar/patahan, dan penyebaran akuifer lateral.</li>
            </ul>

            <div class="modal-table-wrap">
                <table class="modal-table">
                    <thead>
                        <tr>
                            <th>Nilai Resistivitas (&Omega;&middot;m)</th>
                            <th>Interpretasi Litologi Bawah Tanah</th>
                            <th>Potensi Air Tanah</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>&lt; 10 &Omega;&middot;m</strong></td>
                            <td>Lempung jenuh air / air payau / salin</td>
                            <td>Rendah (Air terperangkap lempung)</td>
                        </tr>
                        <tr>
                            <td><strong>15 - 80 &Omega;&middot;m</strong></td>
                            <td>Pasir kerikilan, pasir pasiran jenuh air bersih</td>
                            <td>SANGAT TINGGI (Zona Akuifer Utama)</td>
                        </tr>
                        <tr>
                            <td><strong>&gt; 200 &Omega;&middot;m</strong></td>
                            <td>Batuan andesit padat, batu gamping keras, basal</td>
                            <td>Tidak ada (Kedap air / Aquiclude)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h4>2. Manfaat Utama Survey Geolistrik</h4>
            <ol>
                <li>Menentukan titik lokasi bor dan kedalaman target pengeboran sumur dalam (Deep Well) secara akurat.</li>
                <li>Menghindari kegagalan spekulasi bor sumur di lokasi tidak produktif (menghemat biaya operasional).</li>
                <li>Menentukan desain konstruksi pipa casing dan filter screen sumur bor yang efisien.</li>
            </ol>
        `
    },
    "artikel-uji-cbr-dcp-bearing": {
        id: "artikel-uji-cbr-dcp-bearing",
        title: "Perbedaan Uji CBR Lapangan, Plate Bearing Test & DCP Test pada Proyek Jalan & Lapangan Industri",
        category: "Jalan & NDT Beton",
        readTime: "6 min baca",
        author: "Tim Laboratorium",
        date: "20 Agustus 2026",
        waMessage: "Halo Ginara Bumi Geoteknik, saya ingin berkonsultasi mengenai Uji CBR Lapangan / Plate Bearing Test untuk perkerasan jalan/lantai pabrik.",
        content: `
            <p>Dalam rekayasa konstruksi perkerasan jalan (pavement engineering) dan pembangunan lantai slab beton pabrik/gudang, kekuatan tanah dasar (subgrade) dan lapis fondasi atas (subbase) merupakan penentu utama keawetan beban lalu lintas. Terdapat 3 metode pengujian daya dukung tanah lapangan yang paling sering digunakan:</p>

            <h4>1. DCP Test (Dynamic Cone Penetrometer)</h4>
            <p>Uji DCP mengukur kedalaman penetrasi konus baja berdiameter 20mm yang ditumbuk dengan beban 8 kg dari ketinggian 575 mm. Pengujian ini sangat cepat dan ekonomis untuk mengevaluasi kontinuitas nilai CBR subgrade sepanjang jalur jalan raya baru maupun pekerjaan timbunan tanah.</p>

            <h4>2. Uji CBR Lapangan (In-Situ CBR Test)</h4>
            <p>Pengujian California Bearing Ratio (CBR) lapangan mengukur penetrasi piston standar ke dalam tanah dengan menggunakan beban reaksi truk atau excavator. Nilai CBR (%) langsung digunakan dalam formula desain tebal perkerasan lentur jalan acuan Standar Bina Marga.</p>

            <h4>3. Plate Bearing Test (Uji Beban Pelat)</h4>
            <p>Plate Bearing Test menguji daya dukung langsung pelat baja melingkar (diameter 30cm - 76cm) yang ditekan dongkrak hidrolik. Pengujian ini menghasilkan nilai <strong>Modulus Reaksi Tanah Dasar (k-value)</strong> dalam MN/m³ atau kg/cm³.</p>

            <div class="modal-table-wrap">
                <table class="modal-table">
                    <thead>
                        <tr>
                            <th>Metode Uji</th>
                            <th>Parameter Output Utama</th>
                            <th>Aplikasi Konstruksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>DCP Test</strong></td>
                            <td>mm/penetrasi &amp; Korelasi CBR (%)</td>
                            <td>QC timbunan jalan &amp; subgrade cepat.</td>
                        </tr>
                        <tr>
                            <td><strong>CBR Lapangan</strong></td>
                            <td>Nilai CBR In-situ (%)</td>
                            <td>Desain tebal aspal &amp; lapis fondasi jalan.</td>
                        </tr>
                        <tr>
                            <td><strong>Plate Bearing</strong></td>
                            <td>Modulus Subgrade k &amp; Settlement</td>
                            <td>Lantai beton rigid pavement, pabrik, &amp; apron.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <p>Tim Ginara Bumi Geoteknik siap menerjunkan alat uji CBR lapangan, set alat Plate Bearing hidrolik, dan DCP terkalibrasi ke seluruh lokasi proyek Anda di DIY, Jawa Tengah, dan Jawa Timur.</p>
        `
    },
    "artikel-pumping-test-sipa": {
        id: "artikel-pumping-test-sipa",
        title: "Pumping Test & Analisis Debet Air Tanah: Syarat Wajib Izin Pengusahaan Air Tanah (SIPA)",
        category: "Geofisika & Air",
        readTime: "7 min baca",
        author: "Tim Hidrogeologi",
        date: "20 Agustus 2026",
        waMessage: "Halo Ginara Bumi Geoteknik, saya butuh layanan Pumping Test uji pemompaan air sumur bor untuk perizinan SIPA.",
        content: `
            <p>Berdasarkan Peraturan Pemerintah dan Permen ESDM, setiap pemanfaatan air tanah sumur dalam (Deep Well) untuk kegiatan usaha komersial (hotel, kawasan industri, rumah sakit, pencucian mobil, pabrik) wajib memiliki <strong>Izin Pengusahaan Air Tanah (SIPA)</strong>. Dokumen teknis utama yang disyaratkan adalah laporan <strong>Pumping Test (Uji Pemompaan Air)</strong>.</p>

            <div class="modal-highlight-box">
                <strong>Tujuan Utama Pumping Test:</strong><br>
                Uji pemompaan menentukan debit pemompaan aman (Safe Yield) agar tidak merusak lingkungan akuifer serta menghitung nilai Transmisivitas (T) dan Storativitas (S) akuifer pembawa air.
            </div>

            <h4>1. Tahapan Pengujian Pumping Test</h4>
            <p>Ginara Bumi Geoteknik melaksanakan prosedur Pumping Test sesuai standar teknis hidrogeologi yang diakui Dinas ESDM:</p>
            <ul>
                <li><strong>Step Drawdown Test (Uji Pemompaan Bertingkat):</strong> Memompa air sumur dengan debit bertingkat (misal: 3 - 4 step) masing-masing selama 2 jam untuk menghitung koefisien kehilangan daya sumur (Well Loss).</li>
                <li><strong>Longterm Constant Rate Test (Uji Pemompaan Konstan 24 Jam):</strong> Memompa air sumur pada debit konstan yang disepakati secara terus menerus selama 24 jam sambil mencatat penurunan muka air tanah (drawdown) pada sumur uji dan sumur pantau.</li>
                <li><strong>Recovery Test (Uji Pemulihan):</strong> Mencatat kecepatan pengembalian muka air tanah ke posisi semula pasca pompa dimatikan.</li>
            </ul>

            <h4>2. Output Analisis &amp; Berkas SIPA</h4>
            <p>Dari data kurva waktu-penurunan (time-drawdown) yang diolah menggunakan metode Theis, Cooper-Jacob, atau Chow, kami menyusun laporan hidrogeologi komprehensif berisi spesifikasi debit pemompaan izin (liter/detik) dan rekomendasi kapasitas pompa submersible yang tepat.</p>
        `
    },
    "artikel-hammer-test-beton": {
        id: "artikel-hammer-test-beton",
        title: "Evaluasi Kekuatan Struktur Gedung Eksisting Menggunakan Hammer Test NDT (Schmidt Hammer)",
        category: "Jalan & NDT Beton",
        readTime: "5 min baca",
        author: "Tim NDT Struktur",
        date: "20 Agustus 2026",
        waMessage: "Halo Ginara Bumi Geoteknik, saya tertarik dengan layanan Uji Hammer Test mutu beton gedung eksisting.",
        content: `
            <p>Saat akan melakukan renovasi gedung, penambahan lantai bertingkat, evaluasi paska bencana gempa bumi, atau pengajuan Sertifikat Laik Fungsi (SLF) dan PBG bangunan lama, mutu kuat tekan beton elemen struktur (kolom, balok, plat lantai) harus diaudit secara ilmiah. <strong>Hammer Test (Schmidt Rebound Hammer)</strong> adalah pengujian Non-Destructive Test (NDT) paling efektif untuk evaluasi cepat mutu beton tanpa merusak elemen gedung.</p>

            <h4>1. Mekanisme &amp; Prinsip Kerja Rebound Hammer</h4>
            <p>Alat Schmidt Hammer melepaskan pegas dengan beban massa tertentu ke permukaan beton yang rata. Besarnya gaya pantulan balik pegas (Rebound Value / R-Value) dibaca pada skala indikator. Semakin keras dan padat permukaan beton, semakin tinggi nilai pantul R-value yang dihasilkan.</p>

            <div class="modal-highlight-box">
                <strong>Standar Pengujian NDT Beton:</strong><br>
                Pengujian mengacu pada <strong>SNI 03-2492-2002</strong> &amp; <strong>ASTM C805</strong>. Setiap lokasi titik uji (grid size 15cm x 15cm) dilakukan minimal 9 hingga 10 kali pukulan dengan jarak antar titik pukulan min. 2,5 cm.
            </div>

            <h4>2. Interpretasi Hasil &amp; Estimasi Mutu Beton (fc' / K)</h4>
            <p>Nilai rata-rata rebound (R) diolah secara statistik dengan memperhitungakan sudut arah pukulan (horisontal, vertikal ke atas, atau vertikal ke bawah) dan dikorelasikan ke grafik kurva kalibrasi alat untuk mengestimasi nilai Kuat Tekan Beton Karakteristik (fc' dalam MPa atau Karakteristik K dalam kg/cm²).</p>

            <div class="modal-table-wrap">
                <table class="modal-table">
                    <thead>
                        <tr>
                            <th>Rata-rata Nilai Rebound (R)</th>
                            <th>Estimasi Mutu Beton (K)</th>
                            <th>Kategori Kualitas Beton</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>&gt; 40</strong></td>
                            <td>&gt; K-350 / fc' &gt; 29 MPa</td>
                            <td>Sangat Baik (Struktur Beban Berat)</td>
                        </tr>
                        <tr>
                            <td><strong>30 - 40</strong></td>
                            <td>K-225 s/d K-300 / fc' 19-25 MPa</td>
                            <td>Baik (Kolom &amp; Balok Gedung Standar)</td>
                        </tr>
                        <tr>
                            <td><strong>20 - 30</strong></td>
                            <td>K-125 s/d K-175 / fc' 10-15 MPa</td>
                            <td>Sedang (Beton Non-Struktural / Sloof)</td>
                        </tr>
                        <tr>
                            <td><strong>&lt; 20</strong></td>
                            <td>&lt; K-100</td>
                            <td>Rendah (Kerusakan / Mutu Lemah)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <p>Laporan Hammer Test dari Ginara Bumi Geoteknik dilengkapi dengan peta lokasi titik pengujian, tabel statistik deviasi, serta rekomendasi teknis perbaikan struktur jika ditemukan zona beton lemah.</p>
        `
    }
};

let currentActiveCategory = "all";
let currentSearchTerm = "";

function initArticlesInteractivity() {
    const searchInput = document.getElementById("articleSearchInput");
    const clearBtn = document.getElementById("clearSearchBtn");
    const filterBtns = document.querySelectorAll(".article-filter-btn");
    const resetSearchBtn = document.getElementById("resetSearchBtn");

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            currentSearchTerm = e.target.value.trim().toLowerCase();
            if (clearBtn) {
                clearBtn.style.display = currentSearchTerm.length > 0 ? "grid" : "none";
            }
            filterArticles();
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            currentSearchTerm = "";
            clearBtn.style.display = "none";
            filterArticles();
        });
    }

    if (resetSearchBtn) {
        resetSearchBtn.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            currentSearchTerm = "";
            currentActiveCategory = "all";
            if (clearBtn) clearBtn.style.display = "none";

            filterBtns.forEach(btn => {
                btn.classList.toggle("active", btn.getAttribute("data-category") === "all");
            });

            filterArticles();
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentActiveCategory = btn.getAttribute("data-category");
            filterArticles();
        });
    });

    // Check URL Hash on load (e.g. #artikel-sondir-pbg)
    const hash = window.location.hash.replace("#", "");
    if (hash && ARTICLES_DATA[hash]) {
        setTimeout(() => {
            openArticleModal(hash);
        }, 400);
    }
}

function filterArticles() {
    const articleCards = document.querySelectorAll(".article-card");
    const searchResultInfo = document.getElementById("searchResultInfo");
    const searchTermText = document.getElementById("searchTermText");
    const searchResultCount = document.getElementById("searchResultCount");
    const noArticlesFound = document.getElementById("noArticlesFound");
    const noResultsTerm = document.getElementById("noResultsTerm");

    let visibleCount = 0;

    articleCards.forEach(card => {
        const category = card.getAttribute("data-category");
        const keywords = (card.getAttribute("data-keywords") || "").toLowerCase();
        const title = card.querySelector("h3") ? card.querySelector("h3").textContent.toLowerCase() : "";
        const excerpt = card.querySelector(".article-excerpt") ? card.querySelector(".article-excerpt").textContent.toLowerCase() : "";

        const matchesCategory = (currentActiveCategory === "all" || category === currentActiveCategory);
        const matchesSearch = currentSearchTerm === "" ||
            title.includes(currentSearchTerm) ||
            excerpt.includes(currentSearchTerm) ||
            keywords.includes(currentSearchTerm);

        if (matchesCategory && matchesSearch) {
            card.style.display = "flex";
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });

    if (currentSearchTerm.length > 0 && searchResultInfo && searchTermText && searchResultCount) {
        searchResultInfo.style.display = "block";
        searchTermText.textContent = currentSearchTerm;
        searchResultCount.textContent = visibleCount;
    } else if (searchResultInfo) {
        searchResultInfo.style.display = "none";
    }

    if (visibleCount === 0 && noArticlesFound) {
        noArticlesFound.style.display = "block";
        if (noResultsTerm) noResultsTerm.textContent = currentSearchTerm || currentActiveCategory;
    } else if (noArticlesFound) {
        noArticlesFound.style.display = "none";
    }
}

function openArticleModal(articleId) {
    const article = ARTICLES_DATA[articleId];
    if (!article) return;

    const modalBackdrop = document.getElementById("articleModalBackdrop");
    const modalCategoryTag = document.getElementById("modalCategoryTag");
    const modalReadTime = document.getElementById("modalReadTime");
    const modalTitle = document.getElementById("modalArticleTitle");
    const modalAuthor = document.getElementById("modalArticleAuthor");
    const modalDate = document.getElementById("modalArticleDate");
    const modalContentArea = document.getElementById("modalContentArea");
    const modalWaBtn = document.getElementById("modalWaBtn");

    if (modalCategoryTag) modalCategoryTag.textContent = article.category;
    if (modalReadTime) modalReadTime.textContent = article.readTime;
    if (modalTitle) modalTitle.textContent = article.title;
    if (modalAuthor) modalAuthor.textContent = article.author;
    if (modalDate) modalDate.textContent = article.date;
    if (modalContentArea) modalContentArea.innerHTML = article.content;

    if (modalWaBtn) {
        const encodedText = encodeURIComponent(article.waMessage);
        modalWaBtn.href = `https://wa.me/6289649498436?text=${encodedText}`;
    }

    if (modalBackdrop) {
        modalBackdrop.classList.add("active");
        document.body.classList.add("modal-open");
    }

    if (history.pushState) {
        history.pushState(null, null, `#${articleId}`);
    } else {
        window.location.hash = `#${articleId}`;
    }
}

function closeArticleModal(event) {
    const modalBackdrop = document.getElementById("articleModalBackdrop");
    if (modalBackdrop) {
        modalBackdrop.classList.remove("active");
        document.body.classList.remove("modal-open");
    }

    if (window.location.hash.startsWith("#artikel-")) {
        if (history.pushState) {
            history.pushState(null, null, window.location.pathname);
        }
    }
}

function copyArticleLink() {
    const url = window.location.href;
    const copyBtnText = document.getElementById("copyLinkText");

    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            if (copyBtnText) {
                const original = copyBtnText.textContent;
                copyBtnText.textContent = "Tersalin!";
                setTimeout(() => {
                    copyBtnText.textContent = original;
                }, 2000);
            }
        }).catch(() => {
            prompt("Salin link artikel:", url);
        });
    } else {
        prompt("Salin link artikel:", url);
    }
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeArticleModal();
    }
});

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initArticlesInteractivity);
} else {
    initArticlesInteractivity();
}