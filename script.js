/* ==========================================================================
   CINEMATIC BIRTHDAY SURPRISE - JAVASCRIPT
   Implements particle engine, animations, interactive sections, audio
   controllers, and responsive fallback assets.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // --- GLOBAL VARIABLES & STATE ---
    let currentActiveSection = 'sec-loading';
    let isMusicPlaying = false;
    let typedYet = false;
    let candlesBlown = false;
    const bgMusic = document.getElementById('bg-music');
    const galleryMusic = document.getElementById('gallery-music');
    // Make sure elements exist
    const mouseGlow = document.getElementById('mouse-glow');
    const ambientCanvas = document.getElementById('ambient-canvas');
    const ctxAmbient = ambientCanvas.getContext('2d');
    // Adjust volume of ambient audios
    bgMusic.volume = 0.5;
    galleryMusic.volume = 0.6;
    // --- CANVAS PARTICLES SYSTEM (Rose petals & golden sparkles) ---
    let ambientParticles = [];
    const maxParticles = 80;
    function resizeAmbientCanvas() {
        ambientCanvas.width = window.innerWidth;
        ambientCanvas.height = window.innerHeight;
    }
    resizeAmbientCanvas();
    window.addEventListener('resize', resizeAmbientCanvas);
    class AmbientParticle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * ambientCanvas.width;
            this.y = Math.random() * ambientCanvas.height - ambientCanvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedY = Math.random() * 0.8 + 0.4;
            this.speedX = Math.random() * 0.6 - 0.3;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.type = Math.random() > 0.45 ? 'spark' : 'petal'; // Golden sparkles or red petals
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = Math.random() * 0.02 - 0.01;
            this.petalWidth = Math.random() * 6 + 4;
            this.petalHeight = Math.random() * 9 + 6;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;
            if (this.y > ambientCanvas.height || this.x < 0 || this.x > ambientCanvas.width) {
                this.reset();
                this.y = -20;
            }
        }
        draw() {
            ctxAmbient.save();
            ctxAmbient.globalAlpha = this.opacity;
            ctxAmbient.translate(this.x, this.y);
            ctxAmbient.rotate(this.rotation);
            if (this.type === 'spark') {
                let grad = ctxAmbient.createRadialGradient(0, 0, 0, 0, 0, this.size * 2);
                grad.addColorStop(0, '#FFFDF9');
                grad.addColorStop(0.3, '#FCF6BA');
                grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
                ctxAmbient.fillStyle = grad;
                ctxAmbient.beginPath();
                ctxAmbient.arc(0, 0, this.size * 2, 0, Math.PI * 2);
                ctxAmbient.fill();
            } else {
                ctxAmbient.fillStyle = '#8B001A';
                ctxAmbient.beginPath();
                ctxAmbient.moveTo(0, -this.petalHeight / 2);
                ctxAmbient.quadraticCurveTo(this.petalWidth, -this.petalHeight / 2, this.petalWidth / 2, this.petalHeight / 2);
                ctxAmbient.quadraticCurveTo(0, this.petalHeight, -this.petalWidth / 2, this.petalHeight / 2);
                ctxAmbient.quadraticCurveTo(-this.petalWidth, -this.petalHeight / 2, 0, -this.petalHeight / 2);
                ctxAmbient.closePath();
                ctxAmbient.fill();
                
                ctxAmbient.strokeStyle = 'rgba(212, 175, 55, 0.3)';
                ctxAmbient.lineWidth = 0.5;
                ctxAmbient.stroke();
            }
            ctxAmbient.restore();
        }
    }
    function initAmbientParticles() {
        ambientParticles = [];
        for (let i = 0; i < maxParticles; i++) {
            ambientParticles.push(new AmbientParticle());
        }
    }
    initAmbientParticles();
    function animateAmbient() {
        ctxAmbient.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
        
        let radialAura = ctxAmbient.createRadialGradient(
            ambientCanvas.width / 2, ambientCanvas.height / 2, 0,
            ambientCanvas.width / 2, ambientCanvas.height / 2, ambientCanvas.width
        );
        radialAura.addColorStop(0, 'rgba(74, 14, 23, 0.3)');
        radialAura.addColorStop(0.5, 'rgba(42, 5, 11, 0.2)');
        radialAura.addColorStop(1, 'rgba(10, 0, 2, 0.8)');
        ctxAmbient.fillStyle = radialAura;
        ctxAmbient.fillRect(0, 0, ambientCanvas.width, ambientCanvas.height);
        ambientParticles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateAmbient);
    }
    animateAmbient();
    // --- MOUSE TRACKING GLOW ---
    window.addEventListener('mousemove', (e) => {
        if (mouseGlow) {
            mouseGlow.style.left = `${e.clientX}px`;
            mouseGlow.style.top = `${e.clientY}px`;
        }
    });
    // --- SECTION ROUTING COORDINATOR ---
    function navigateToSection(targetId) {
        const currentSec = document.getElementById(currentActiveSection);
        const targetSec = document.getElementById(targetId);
        if (currentSec) {
            currentSec.classList.remove('active');
        }
        if (targetSec) {
            targetSec.classList.add('active');
            currentActiveSection = targetId;
            if (targetId === 'sec-countdown') {
                runCountdown();
            }
            if (targetId === 'sec-celebration') {
                startFireworksShow();
            }
            if (targetId === 'sec-final') {
                buildNightSkyConstellation();
            }
        }
    }
    // --- AUTOMATIC LOADING PROCESS (SECTION 1 -> 2) ---
    const progressFill = document.getElementById('loader-progress');
    let loadProgress = 0;
    
    const progressInterval = setInterval(() => {
        loadProgress += 2;
        if (progressFill) {
            progressFill.style.width = `${loadProgress}%`;
        }
        if (loadProgress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
                navigateToSection('sec-password');
            }, 500);
        }
    }, 100);
    // --- PASSWORD SYSTEM & UNLOCK (SECTION 2 -> 3) ---
    const correctPassword = '12072005';
    const btnUnlock = document.getElementById('btn-unlock');
    const passInput = document.getElementById('pass-input');
    const passwordError = document.getElementById('password-error');
    const passwordCard = document.querySelector('.password-card');
    btnUnlock.addEventListener('click', handleUnlock);
    passInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUnlock();
    });
    function handleUnlock() {
        const inputVal = passInput.value.trim();
        if (inputVal === correctPassword) {
            passwordError.textContent = '';
            createSparkleExplosion(btnUnlock.getBoundingClientRect());
            
            setTimeout(() => {
                navigateToSection('sec-countdown');
            }, 1000);
        } else {
            passwordCard.classList.add('shake');
            passwordError.textContent = 'Incorrect Key. Please check the date.';
            passInput.value = '';
            
            setTimeout(() => {
                passwordCard.classList.remove('shake');
            }, 500);
        }
    }
    function createSparkleExplosion(rect) {
        const pxX = rect.left + rect.width / 2;
        const pxY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 40; i++) {
            const p = document.createElement('div');
            p.classList.add('explosion-particle');
            
            const colors = ['#BF953F', '#FCF6BA', '#B38728', '#FBF5B7', '#AA771C'];
            p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            const size = Math.random() * 6 + 4;
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            
            p.style.left = `${pxX}px`;
            p.style.top = `${pxY}px`;
            
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 150 + 50;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;
            
            p.style.setProperty('--dx', `${dx}px`);
            p.style.setProperty('--dy', `${dy}px`);
            
            document.body.appendChild(p);
            
            setTimeout(() => p.remove(), 1000);
        }
    }
    // --- COUNTDOWN SYSTEM (SECTION 3 -> 4) ---
    function runCountdown() {
        const ring = document.getElementById('countdown-progress-ring');
        const text = document.getElementById('countdown-text');
        let count = 3;
        
        const totalLength = 283;
        ring.style.strokeDashoffset = 0;
        const countdownInterval = setInterval(() => {
            count--;
            const offset = totalLength - ((3 - count) / 3) * totalLength;
            ring.style.strokeDashoffset = offset;
            if (count > 0) {
                text.textContent = count;
            } else if (count === 0) {
                text.textContent = 'GO';
            } else {
                clearInterval(countdownInterval);
                navigateToSection('sec-hero');
            }
        }, 1200);
    }
    // --- MUSIC OVERLAY PLAYER CONTROLS ---
    const musicToggle = document.getElementById('music-toggle');
    const musicOnIcon = musicToggle.querySelector('.icon-music-on');
    const musicOffIcon = musicToggle.querySelector('.icon-music-off');
    musicToggle.addEventListener('click', () => {
        if (isMusicPlaying) {
            pauseAllAudio();
        } else {
            playMainTheme();
        }
    });
    function playMainTheme() {
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            musicOnIcon.style.display = 'block';
            musicOffIcon.style.display = 'none';
        }).catch(err => {
            console.log('Autoplay deferred: ' + err);
        });
    }
    function pauseAllAudio() {
        bgMusic.pause();
        galleryMusic.pause();
        isMusicPlaying = false;
        musicOnIcon.style.display = 'none';
        musicOffIcon.style.display = 'block';
    }
    // --- HERO SECTION ACTIONS (SECTION 4 -> 5) ---
    const btnBegin = document.getElementById('btn-begin');
    btnBegin.addEventListener('click', () => {
        playMainTheme();
        navigateToSection('sec-timeline');
    });
    // Subtitle Text Rotator Loop
    const rotatorItems = document.querySelectorAll('.rotator-item');
    let rotatorIndex = 0;
    setInterval(() => {
        rotatorItems[rotatorIndex].classList.remove('active');
        rotatorIndex = (rotatorIndex + 1) % rotatorItems.length;
        rotatorItems[rotatorIndex].classList.add('active');
    }, 3000);
    // --- TIMELINE CONTROLS (SECTION 5 -> 6) ---
    const btnToGallery = document.getElementById('btn-to-gallery');
    btnToGallery.addEventListener('click', () => {
        navigateToSection('sec-gallery');
    });
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.15 });
    revealElements.forEach(el => observer.observe(el));
    // --- GALLERY CONTROLS & LIGHTBOX (SECTION 6 -> 7) ---
    const btnToLetter = document.getElementById('btn-to-letter');
    const polaroidCards = document.querySelectorAll('.polaroid-card');
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    btnToLetter.addEventListener('click', () => {
        navigateToSection('sec-letter');
    });
    polaroidCards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('.gallery-img');
            const caption = card.querySelector('.caption-text').textContent;
            
            lightboxImg.src = img.src;
            lightboxCaption.textContent = caption;
            lightbox.style.display = 'flex';
        });
        card.addEventListener('mouseenter', () => {
            if (card.classList.contains('sister-memory') && isMusicPlaying) {
                fadeOutAudio(bgMusic);
                fadeInAudio(galleryMusic);
            }
        });
        card.addEventListener('mouseleave', () => {
            if (card.classList.contains('sister-memory') && isMusicPlaying) {
                fadeOutAudio(galleryMusic);
                fadeInAudio(bgMusic);
            }
        });
    });
    lightboxClose.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });
    function fadeOutAudio(audio) {
        let vol = audio.volume;
        const interval = setInterval(() => {
            if (vol > 0.05) {
                vol -= 0.05;
                audio.volume = vol;
            } else {
                audio.volume = 0;
                audio.pause();
                clearInterval(interval);
            }
        }, 30);
    }
    function fadeInAudio(audio) {
        audio.volume = 0;
        audio.play().then(() => {
            let vol = 0;
            const interval = setInterval(() => {
                if (vol < 0.5) {
                    vol += 0.05;
                    audio.volume = vol;
                } else {
                    audio.volume = 0.5;
                    clearInterval(interval);
                }
            }, 30);
        }).catch(e => console.log('Fade in deferred: ' + e));
    }
    // --- ENVELOPE / LETTER SYSTEM (SECTION 7 -> 8) ---
    const envelope = document.getElementById('envelope-element');
    const waxSeal = document.getElementById('wax-seal-button');
    const letterFooterNav = document.getElementById('letter-footer-nav');
    waxSeal.addEventListener('click', () => {
        envelope.classList.add('open');
        setTimeout(() => {
            envelope.classList.add('flipped');
            setTimeout(() => {
                triggerTypewriterEffect();
            }, 1000);
        }, 1200);
    });
    const letterContent = `Happy Birthday, Sree...Allaa..Cheenja Mutta❤️
You're my little sister, but you've always been much more than that.yeahhh..Nakkintem ahangarathintem kaaryathil.
You're my best friend.
You're my biggest comfort.
You're the only person I can tell absolutely everything.Because budhi illaa...tube light aanuu..pinne paranjath 5 min kazhinja marakkayum cheyyum...so enthum vishwasich parayam..
Thank you for standing beside me through every happy and difficult moment.
No matter how old we become, you'll always be the little CHEENJA MUTTA I'll protect, laugh with, fight with, and love forever.
I hope your life becomes everything you've ever dreamed of.
May your smile never fade.
May happiness always choose you.And u are so lucky..Because u got a Very good,beautifull,kind hearted chechiii
Thank you for existing.jenich poyilleee...
Thank you for making my life beautiful nta kanjiyile paattayeee.
I love you endlessly.
Forever,
Your Chechi...NOOO Mandan Maluu angane alle vilikkuuu😌❤️`;
    function triggerTypewriterEffect() {
        typedYet = true;
        const paperBody = document.getElementById('typewriter-text');
        let index = 0;
        paperBody.textContent = '';
        function type() {
            if (index < letterContent.length) {
                const char = letterContent.charAt(index);
                if (char === '\n') {
                    paperBody.appendChild(document.createElement('br'));
                } else {
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.style.opacity = 0;
                    span.style.transition = 'opacity 0.1s ease';
                    paperBody.appendChild(span);
                    setTimeout(() => span.style.opacity = 1, 10);
                }
                index++;
                const speed = char === ',' || char === '.' ? 250 : 35;
                setTimeout(type, speed);
            } else {
                letterFooterNav.style.display = 'block';
                letterFooterNav.scrollIntoView({ behavior: 'smooth' });
            }
        }
        type();
    }
    document.getElementById('btn-to-cake').addEventListener('click', () => {
        navigateToSection('sec-cake');
    });
    // --- LUXURY CAKE CUTTING MECHANICS (SECTION 8 -> 9/10) ---
    const btnWish = document.getElementById('btn-wish');
    const flames = document.querySelectorAll('.candle-flame');
    const smokes = document.querySelectorAll('.candle-smoke');
    const cakeGlow = document.querySelector('.cake-glow-back');
    btnWish.addEventListener('click', blowCandles);
    // Audio blow detector
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;
        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);
        javascriptNode.onaudioprocess = () => {
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            let values = 0;
            const length = array.length;
            for (let i = 0; i < length; i++) {
                values += averageIntensity(array);
            }
            const average = values / length;
            if (average > 65 && !candlesBlown && currentActiveSection === 'sec-cake') {
                blowCandles();
            }
        };
    }).catch(err => {
        console.log('Microphone blow detector disabled: ' + err);
    });
    function averageIntensity(arr) {
        let total = 0;
        for (let i = 0; i < arr.length; i++) {
            total += arr[i];
        }
        return total / arr.length;
    }
    /* UPDATE: New candle blow procedure mapping user sound effect and transitions */
    function blowCandles() {
        if (candlesBlown) return;
        candlesBlown = true;
        
        // 1. Play candle blowing sound (if available)
        const blowSound = document.getElementById('blow-sound');
        if (blowSound) {
            blowSound.play().catch(e => console.log('Sound playback blocked: ' + e));
        }
        // 2. Extinguish all candle flames with smooth animation
        flames.forEach(flame => {
            flame.classList.remove('active-flame');
            flame.classList.add('extinguished');
        });
        // 3. Show small white smoke rising
        smokes.forEach(smoke => {
            smoke.classList.add('puff');
        });
        if (cakeGlow) {
            cakeGlow.style.opacity = 0;
        }
        // 4. Add golden sparkles around the cake wrapper
        const sparklesBox = document.getElementById('cake-sparkles-box');
        if (sparklesBox) {
            sparklesBox.innerHTML = '';
            for (let i = 0; i < 60; i++) {
                const sp = document.createElement('div');
                sp.classList.add('cake-sparkle');
                
                // Random position centered around the image overlay space
                sp.style.left = `${Math.random() * 80 + 10}%`;
                sp.style.top = `${Math.random() * 40 + 20}%`;
                
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 120 + 50;
                const dx = Math.cos(angle) * distance;
                const dy = Math.sin(angle) * distance;
                
                sp.style.setProperty('--dx', `${dx}px`);
                sp.style.setProperty('--dy', `${dy}px`);
                
                sparklesBox.appendChild(sp);
            }
        }
        btnWish.textContent = 'Wish Made! ❤️';
        btnWish.classList.remove('btn-gold-pulse');
        // 5. Start elegant background fireworks immediately
        startFireworksShow();
        // 6. After 3 seconds automatically continue to the final birthday celebration section
        setTimeout(() => {
            navigateToSection('sec-celebration');
        }, 3000);
    }
    // --- CANVAS FIREWORKS SHOW SYSTEM (SECTION 9 -> 10) ---
    const fireworksCanvas = document.getElementById('fireworks-canvas');
    const ctxFire = fireworksCanvas.getContext('2d');
    let fireworksArray = [];
    let fireworkParticles = [];
    let fireworksShowActive = false;
    function resizeFireworksCanvas() {
        fireworksCanvas.width = window.innerWidth;
        fireworksCanvas.height = window.innerHeight;
    }
    resizeFireworksCanvas();
    window.addEventListener('resize', resizeFireworksCanvas);
    class Firework {
        constructor() {
            this.x = Math.random() * fireworksCanvas.width;
            this.y = fireworksCanvas.height;
            this.targetY = Math.random() * (fireworksCanvas.height * 0.4) + 100;
            this.speed = Math.random() * 3 + 4;
            this.color = ['#8B001A', '#BF953F', '#FFFDF9', '#B76E79'][Math.floor(Math.random() * 4)];
            this.size = 3;
        }
        update() {
            this.y -= this.speed;
        }
        draw() {
            ctxFire.beginPath();
            ctxFire.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctxFire.fillStyle = this.color;
            ctxFire.fill();
        }
    }
    class FireworkParticle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.angle = Math.random() * Math.PI * 2;
            this.speed = Math.random() * 5 + 1;
            this.opacity = 1;
            this.decay = Math.random() * 0.015 + 0.008;
            this.gravity = 0.08;
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
        }
        update() {
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.opacity -= this.decay;
        }
        draw() {
            ctxFire.save();
            ctxFire.globalAlpha = this.opacity;
            ctxFire.beginPath();
            ctxFire.arc(this.x, this.y, Math.random() * 2 + 1, 0, Math.PI * 2);
            ctxFire.fillStyle = this.color;
            ctxFire.fill();
            ctxFire.restore();
        }
    }
    function startFireworksShow() {
        fireworksShowActive = true;
        fireworksArray = [];
        fireworkParticles = [];
        animateFireworks();
    }
    function animateFireworks() {
        if (!fireworksShowActive) return;
        
        ctxFire.fillStyle = 'rgba(5, 0, 2, 0.15)';
        ctxFire.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
        if (Math.random() < 0.05) {
            fireworksArray.push(new Firework());
        }
        for (let i = fireworksArray.length - 1; i >= 0; i--) {
            const f = fireworksArray[i];
            f.update();
            f.draw();
            if (f.y <= f.targetY) {
                for (let p = 0; p < 80; p++) {
                    fireworkParticles.push(new FireworkParticle(f.x, f.y, f.color));
                }
                fireworksArray.splice(i, 1);
            }
        }
        for (let i = fireworkParticles.length - 1; i >= 0; i--) {
            const p = fireworkParticles[i];
            p.update();
            p.draw();
            if (p.opacity <= 0) {
                fireworkParticles.splice(i, 1);
            }
        }
        requestAnimationFrame(animateFireworks);
    }
    document.getElementById('btn-to-final').addEventListener('click', () => {
        fireworksShowActive = false;
        navigateToSection('sec-final');
    });
    // --- FINAL STARSKY CONSTELLATION (SECTION 10) ---
    function buildNightSkyConstellation() {
        const container = document.getElementById('constellation-box');
        container.innerHTML = '';
        const width = window.innerWidth;
        const height = window.innerHeight;
        for (let i = 0; i < 70; i++) {
            const star = document.createElement('div');
            star.classList.add('constellation-star');
            star.style.left = `${Math.random() * width}px`;
            star.style.top = `${Math.random() * height}px`;
            star.style.animationDelay = `${Math.random() * 4}s`;
            container.appendChild(star);
        }
        const heartPoints = [];
        const scale = 14;
        const centerX = width / 2;
        const centerY = height / 2.3;
        for (let t = 0; t < Math.PI * 2; t += 0.3) {
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
            heartPoints.push({
                x: centerX + x * scale,
                y: centerY - y * scale
            });
        }
        heartPoints.forEach((pt, index) => {
            const star = document.createElement('div');
            star.classList.add('constellation-star');
            star.style.left = `${pt.x}px`;
            star.style.top = `${pt.y}px`;
            star.style.backgroundColor = '#FCF6BA';
            star.style.boxShadow = '0 0 10px #B38728';
            star.style.animationDelay = `${index * 0.1}s`;
            container.appendChild(star);
        });
    }
    // --- REPLAY JOURNEY MECHANISM ---
    document.getElementById('btn-replay').addEventListener('click', () => {
        candlesBlown = false;
        typedYet = false;
        
        envelope.classList.remove('open', 'flipped');
        document.getElementById('typewriter-text').innerHTML = '';
        letterFooterNav.style.display = 'none';
        
        flames.forEach(flame => {
            flame.classList.remove('extinguished');
            flame.classList.add('active-flame');
        });
        smokes.forEach(smoke => {
            smoke.classList.remove('puff');
        });
        if (cakeGlow) {
            cakeGlow.style.opacity = 1;
        }
        navigateToSection('sec-hero');
    });
    // --- HIGH-FIDELITY LUXURY IMAGE FALLBACK ASSURANCE ---
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        img.addEventListener('error', () => {
            // Check if it is the cake image and load a custom cake canvas fallback if so
            const fallbackCanvas = document.createElement('canvas');
            fallbackCanvas.width = 400;
            fallbackCanvas.height = 300;
            const ctxImg = fallbackCanvas.getContext('2d');
            const grad = ctxImg.createLinearGradient(0, 0, 400, 300);
            grad.addColorStop(0, '#4A0E17');
            grad.addColorStop(1, '#2A050B');
            ctxImg.fillStyle = grad;
            ctxImg.fillRect(0, 0, 400, 300);
            ctxImg.strokeStyle = '#D4AF37';
            ctxImg.lineWidth = 4;
            ctxImg.strokeRect(10, 10, 380, 280);
            ctxImg.strokeStyle = 'rgba(212, 175, 55, 0.4)';
            ctxImg.lineWidth = 1;
            ctxImg.setLineDash([4, 4]);
            ctxImg.strokeRect(15, 15, 370, 270);
            ctxImg.setLineDash([]);
            ctxImg.fillStyle = 'rgba(212, 175, 55, 0.15)';
            ctxImg.beginPath();
            ctxImg.arc(200, 140, 50, 0, Math.PI * 2);
            ctxImg.fill();
            ctxImg.fillStyle = '#FFFDF9';
            ctxImg.font = 'normal 500 16px sans-serif';
            ctxImg.textAlign = 'center';
            if (img.classList.contains('cake-image')) {
                ctxImg.fillText('Dearest Sree Kutty\'s Birthday Cake', 200, 135);
                ctxImg.fillStyle = '#D4AF37';
                ctxImg.font = 'italic 12px serif';
                ctxImg.fillText('✦ Place assets/images/cake.jpg here ✦', 200, 160);
            } else {
                ctxImg.fillText('Memory of Sree Kutty & Chechi', 200, 135);
                ctxImg.fillStyle = '#D4AF37';
                ctxImg.font = 'italic 12px serif';
                ctxImg.fillText('✦ Double-click to insert your photo ✦', 200, 160);
            }
            img.src = fallbackCanvas.toDataURL();
        });
    });
});
