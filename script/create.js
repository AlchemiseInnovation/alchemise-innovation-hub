// 🔮 Fade in welcome section on page load
document.addEventListener("DOMContentLoaded", () => {
  const welcomeSection = document.getElementById("create-welcome");
  if (welcomeSection) {
    welcomeSection.style.opacity = 0;
    welcomeSection.style.transition = "opacity 1s ease-in-out";
    setTimeout(() => {
      welcomeSection.style.opacity = 1;
    }, 300);
  }
});

// ⚡️ Add glow pulse on Create button hover
const glowButton = document.querySelector(".create-glow");

if (glowButton) {
  glowButton.addEventListener("mouseenter", () => {
    glowButton.classList.add("glow-pulse");
  });
  glowButton.addEventListener("mouseleave", () => {
    glowButton.classList.remove("glow-pulse");
  });
}

// 🧵 Optional: Upload image preview (if future input added)
const fileInput = document.getElementById("upload");
if (fileInput) {
  fileInput.addEventListener("change", (event) => {
    const previewContainer = document.getElementById("preview");
    const file = event.target.files[0];
    if (file && previewContainer) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewContainer.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width:100%; border-radius:12px;" />`;
      };
      reader.readAsDataURL(file);
    }
  });
}

// 🛠 Placeholder for AI prompt handling
const promptInput = document.getElementById("prompt");
if (promptInput) {
  promptInput.addEventListener("input", () => {
    // Eventually validate or preview prompts here
  });
}
