(function () {

    const CONFIG = {
        // Path to your character's transparent WebM walk cycle animation
        characterSrc: "/assets/video/ar.webm",
        
        // --- CONTROLS ---
        scale: 0.2,              // Size multiplier for the character
        minSpeed: 40,            // Minimum pixels per second (speed)
        maxSpeed: 90,            // Maximum pixels per second (speed)
        bottomOffset: 0          // Distance from the bottom of the screen in pixels
    };

    // Create container for the character
    const root = document.createElement("div");
    root.id = "environment-engine-character";
    document.body.appendChild(root);

    const style = document.createElement("style");
    style.textContent = `
        #environment-engine-character {
            position: fixed;
            bottom: ${CONFIG.bottomOffset}px;
            left: 0;
            pointer-events: none;
            z-index: 99999;
            will-change: transform;
            transform: scale(${CONFIG.scale});
            transform-origin: bottom left;
        }

        #environment-engine-character video {
            display: block;
            width: 150px; /* Base width before scaling */
            height: auto;
            user-select: none;
        }
    `;
    document.head.appendChild(style);

    const video = document.createElement("video");
    video.src = CONFIG.characterSrc;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    root.appendChild(video);

    // State variables for random walk
    let posX = Math.random() * (window.innerWidth - 150);
    let direction = Math.random() < 0.5 ? 1 : -1; // 1 = moving right, -1 = moving left
    let speed = CONFIG.minSpeed + Math.random() * (CONFIG.maxSpeed - CONFIG.minSpeed);
    let isPaused = false;
    let lastTime = performance.now();

    root.style.transform = `translate3d(${posX}px, 0, 0) scaleX(${direction}) scale(${CONFIG.scale})`;

    function updateCharacter(currentTime) {
        const deltaTime = (currentTime - lastTime) / 1000;
        lastTime = currentTime;

        if (!isPaused) {
            // Move character
            posX += direction * speed * deltaTime;

            // Screen boundary checking & turning around with random pauses
            const screenWidth = window.innerWidth;
            const charWidth = 150 * CONFIG.scale;

            if (posX >= screenWidth - charWidth) {
                posX = screenWidth - charWidth;
                triggerTurnAndPause(-1);
            } else if (posX <= 0) {
                posX = 0;
                triggerTurnAndPause(1);
            } else {
                // Occasional random change of pace or pause
                if (Math.random() < 0.002) {
                    speed = CONFIG.minSpeed + Math.random() * (CONFIG.maxSpeed - CONFIG.minSpeed);
                }
            }

            // Apply position and direction flip
            root.style.transform = `translate3d(${posX}px, 0, 0) scaleX(${direction}) scale(${CONFIG.scale})`;
        }

        requestAnimationFrame(updateCharacter);
    }

    function triggerTurnAndPause(newDirection) {
        isPaused = true;
        // Optional: pause video or switch to idle frame if desired
        video.playbackRate = 0.5; // slow down walk animation while turning/pausing

        setTimeout(() => {
            direction = newDirection;
            speed = CONFIG.minSpeed + Math.random() * (CONFIG.maxSpeed - CONFIG.minSpeed);
            video.playbackRate = 1.0;
            isPaused = false;
        }, 1000 + Math.random() * 1500); // Pause for 1 to 2.5 seconds at the edge
    }

    requestAnimationFrame(updateCharacter);

})();