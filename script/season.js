
<script>
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
        autumn: ["🍂","🍁","🧡"],
        winter: ["❄️","☃️","🤍"],
        void: ["✦","◈","⬢"],
        celestial: ["⭐","🌠","✨"]
    };

    const root = document.createElement("div");
    root.id = "environment-engine";
    document.body.appendChild(root);

    const style = document.createElement("style");
    style.textContent = `
        #environment-engine{
            position:fixed;
            inset:0;
            pointer-events:none;
            z-index:99999;
            overflow:hidden;
        }

        .env-particle{
            position:absolute;
            top:-80px;
            animation:envFall linear infinite;
        }

        @keyframes envFall{
            from{
                transform:translateY(-50px) rotate(0deg);
            }

            to{
                transform:translateY(110vh) translateX(80px) rotate(360deg);
            }
        }

        .env-fog{
            position:fixed;
            inset:0;
            background:
            radial-gradient(
                circle,
                rgba(255,255,255,.12),
                transparent 70%
            );
            animation:fogMove 40s linear infinite;
        }

        @keyframes fogMove{
            from{transform:translateX(-5%);}
            to{transform:translateX(5%);}
        }

        .env-rain{
            position:fixed;
            inset:0;
            background:
            repeating-linear-gradient(
                110deg,
                transparent 0px,
                transparent 15px,
                rgba(255,255,255,.18) 16px,
                rgba(255,255,255,.18) 18px
            );
            animation:rainMove .6s linear infinite;
        }

        @keyframes rainMove{
            from{transform:translateY(0);}
            to{transform:translateY(35px);}
        }

        .rare-banner{
            position:fixed;
            top:20px;
            left:50%;
            transform:translateX(-50%);
            padding:12px 20px;
            border-radius:999px;
            background:rgba(0,0,0,.7);
            color:white;
            font-size:14px;
            font-weight:bold;
            opacity:0;
            animation:rareShow 8s forwards;
        }

        @keyframes rareShow{
            10%{opacity:1;}
            90%{opacity:1;}
            100%{opacity:0;}
        }
    `;
    document.head.appendChild(style);

    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();

    let season;

    if ([12,1,2].includes(month))
        season = "winter";
    else if ([3,4,5].includes(month))
        season = "spring";
    else if ([6,7,8].includes(month))
        season = "summer";
    else
        season = "autumn";

    const particles =
        REALMS[CONFIG.realm] ||
        REALMS[season];

    createParticles(
        particles[Math.floor(Math.random() * particles.length)],
        30
    );

    if (CONFIG.allowFog) {

        const fogChance =
            hour < 8 ? 0.5 : 0.15;

        if (Math.random() < fogChance) {
            addFog();
        }
    }

    if (CONFIG.allowRain) {

        const rainChance =
            season === "autumn" ? 0.35 :
            season === "winter" ? 0.25 :
            0.15;

        if (Math.random() < rainChance) {
            addRain();
        }
    }

    calendarEvents();

    if (CONFIG.allowRareEvents) {
        rareEvents();
    }

    function createParticles(symbol,count){

        for(let i=0;i<count;i++){

            const p = document.createElement("div");

            p.className = "env-particle";
            p.textContent = symbol;

            p.style.left =
                Math.random()*100 + "%";

            p.style.fontSize =
                (14 + Math.random()*24) + "px";

            p.style.opacity =
                0.3 + Math.random()*0.7;

            p.style.animationDuration =
                (8 + Math.random()*12) + "s";

            p.style.animationDelay =
                (Math.random()*10) + "s";

            root.appendChild(p);
        }
    }

    function addFog(){

        const fog = document.createElement("div");
        fog.className = "env-fog";

        root.appendChild(fog);
    }

    function addRain(){

        const rain = document.createElement("div");
        rain.className = "env-rain";

        root.appendChild(rain);
    }

    function calendarEvents(){

        if(month === 10 && day === 31){
            createParticles("🎃",20);
        }

        if(month === 12 && day >= 20){
            createParticles("🎄",20);
        }

        if(month === 1 && day === 1){
            createParticles("🎆",25);
        }
    }

    function rareEvents(){

        const roll = Math.random();

        if(roll < 0.01){
            rareNotice("☄️ Meteor Shower");
            createParticles("☄️",40);
        }
        else if(roll < 0.015){
            rareNotice("🌑 Solar Eclipse");
            document.body.style.filter =
                "brightness(0.75)";
        }
        else if(roll < 0.02){
            rareNotice("🌳 World Tree Bloom");
            createParticles("✨",50);
        }
    }

    function rareNotice(text){

        const banner =
            document.createElement("div");

        banner.className = "rare-banner";
        banner.textContent = text;

        root.appendChild(banner);
    }

})();
</script>
