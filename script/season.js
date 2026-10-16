(function () {

    const CONFIG = {
        realm: "autumn",      // spring, summer, autumn, winter, void, celestial
        allowRain: true,
        allowFog: true,
        allowRareEvents: true
    };

    const REALMS = {
        spring: ["🌸","🍃","🌷"],
        summer: ["✨","☀️","🌻"],
        autumn: ["🍂","🍁","🌰"],
        winter: ["❄️","☃️","🤍"],
        void: ["✦","◈","⬢"],
        celestial: ["⭐","🌠","✨"]
    };

    const root = document.createElement("div");
    root.id = "environment-engine";
    document.body.appendChild(root);

    const style = document.createElement("style");
    style.textContent = `
        #environment-engine {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 99999;
            overflow: hidden;
        }

        .env-particle {
            position: absolute;
            top: -60px;
            user-select: none;
            will-change: transform;
            animation: envFall linear infinite, envSway ease-in-out infinite alternate;
        }

        @keyframes envFall {
            0% {
                transform: translateY(-60px) rotate(0deg);
            }
            100% {
                transform: translateY(110vh) rotate(360deg);
            }
        }

        @keyframes envSway {
            0% {
                margin-left: -30px;
            }
            100% {
                margin-left: 30px;
            }
        }

        .env-fog {
            position: fixed;
            inset: -20px;
            background: 
                radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08), transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(255,255,255,0.06), transparent 60%);
            opacity: 0.8;
            animation: fogMove 25s ease-in-out infinite alternate;
        }

        @keyframes fogMove {
            0% { transform: scale(1) translate(-2%, -1%); }
            100% { transform: scale(1.05) translate(2%, 1%); }
        }

        .env-rain {
            position: fixed;
            inset: 0;
            background: repeating-linear-gradient(
                105deg,
                transparent 0px,
                transparent 25px,
                rgba(255,255,255,0.12) 26px,
                rgba(255,255,255,0.12) 27px
            );
            animation: rainMove 0.45s linear infinite;
        }

        @keyframes rainMove {
            0% { transform: translateY(0); }
            100% { transform: translateY(50px); }
        }

        .rare-banner {
            position: fixed;
            top: 24px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            padding: 10px 22px;
            border-radius: 999px;
            background: rgba(15, 15, 15, 0.75);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #fff;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 13px;
            font-weight: 500;
            letter-spacing: 0.3px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            opacity: 0;
            animation: rareShow 7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes rareShow {
            0% { opacity: 0; transform: translateX(-50%) translateY(-20px) scale(0.95); }
            15% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
            85% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
            100% { opacity: 0; transform: translateX(-50%) translateY(-10px) scale(0.98); }
        }
    `;
    document.head.appendChild(style);

    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();

    let season;
    if ([12,1,2].includes(month)) season = "winter";
    else if ([3,4,5].includes(month)) season = "spring";
    else if ([6,7,8].includes(month)) season = "summer";
    else season = "autumn";

    const particles = REALMS[CONFIG.realm] || REALMS[season];

    createParticles(particles, 35);

    if (CONFIG.allowFog) {
        const fogChance = hour < 8 ? 0.6 : 0.2;
        if (Math.random() < fogChance) addFog();
    }

    if (CONFIG.allowRain) {
        const rainChance = season === "autumn" ? 0.35 : season === "winter" ? 0.25 : 0.15;
        if (Math.random() < rainChance) addRain();
    }

    calendarEvents();

    if (CONFIG.allowRareEvents) {
        rareEvents();
    }

    function createParticles(symbolList, count) {
        for (let i = 0; i < count; i++) {
            const p = document.createElement("div");
            p.className = "env-particle";
            p.textContent = symbolList[Math.floor(Math.random() * symbolList.length)];

            const depth = Math.random(); // 0 = far/small/blurry, 1 = close/large/crisp
            const size = 12 + depth * 22;
            
            p.style.left = Math.random() * 100 + "%";
            p.style.fontSize = size + "px";
            p.style.opacity = 0.2 + depth * 0.8;
            
            if (depth < 0.4) {
                p.style.filter = `blur(${Math.round((1 - depth) * 3)}px)`;
            }

            const fallDuration = 7 + (1 - depth) * 10;
            const swayDuration = 3 + Math.random() * 4;

            p.style.animationDuration = `${fallDuration}s, ${swayDuration}s`;
            p.style.animationDelay = `${Math.random() * 10}s, ${Math.random() * 5}s`;

            root.appendChild(p);
        }
    }

    function addFog() {
        const fog = document.createElement("div");
        fog.className = "env-fog";
        root.appendChild(fog);
    }

    function addRain() {
        const rain = document.createElement("div");
        rain.className = "env-rain";
        root.appendChild(rain);
    }

    function calendarEvents() {
        if (month === 10 && day === 31) createParticles(["🎃"], 25);
        if (month === 12 && day >= 20) createParticles(["🎄"], 25);
        if (month === 1 && day === 1) createParticles(["🎆"], 30);
    }

    function rareEvents() {
        const roll = Math.random();
        if (roll < 0.01) {
            rareNotice("☄️ Meteor Shower");
            createParticles(["☄️"], 40);
        } else if (roll < 0.015) {
            rareNotice("🌑 Solar Eclipse");
            document.body.style.filter = "brightness(0.75)";
            document.body.style.transition = "filter 2s ease";
        } else if (roll < 0.02) {
            rareNotice("🌳 World Tree Bloom");
            createParticles(["✨", "🍃"], 50);
        }
    }

    function rareNotice(text) {
        const banner = document.createElement("div");
        banner.className = "rare-banner";
        banner.textContent = text;
        root.appendChild(banner);
    }

})();
