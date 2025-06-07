// Global variables
let isLightning = false

// DOM elements
const lightningOverlay = document.getElementById("lightningOverlay")
const rainContainer = document.getElementById("rainContainer")
const bypasserCard = document.getElementById("bypasserCard")

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initializeRain()
  initializeLightning()
})

// Initialize rain effect
function initializeRain() {
  for (let i = 0; i < 50; i++) {
    const rainDrop = document.createElement("div")
    rainDrop.className = "rain-drop"
    rainDrop.style.left = Math.random() * 100 + "%"
    rainDrop.style.height = Math.random() * 100 + 50 + "px"
    rainDrop.style.animationDelay = Math.random() * 2 + "s"
    rainDrop.style.animationDuration = Math.random() * 3 + 2 + "s"
    rainContainer.appendChild(rainDrop)
  }
}

// Initialize lightning effect
function initializeLightning() {
  setInterval(() => {
    if (Math.random() < 0.3) {
      triggerLightning()
      if (Math.random() < 0.4) {
        setTimeout(triggerLightning, 300)
      }
    }
  }, 3000)
}

// Trigger lightning
function triggerLightning() {
  isLightning = true
  lightningOverlay.classList.add("active")
  bypasserCard.classList.add("lightning")

  const rainDrops = document.querySelectorAll(".rain-drop")
  rainDrops.forEach((drop) => drop.classList.add("lightning"))

  setTimeout(() => {
    isLightning = false
    lightningOverlay.classList.remove("active")
    bypasserCard.classList.remove("lightning")
    rainDrops.forEach((drop) => drop.classList.remove("lightning"))
  }, 150)
}
