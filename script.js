// Global variables
let isLightning = false
let volume = 0.2
let isMuted = false
let showVolumeControl = false
let isMobile = false
let hideTimeout = null

// DOM elements
const lightningOverlay = document.getElementById("lightningOverlay")
const rainContainer = document.getElementById("rainContainer")
const mainCard = document.getElementById("mainCard")
const backgroundAudio = document.getElementById("backgroundAudio")
const volumeControl = document.getElementById("volumeControl")
const volumeButton = document.getElementById("volumeButton")
const volumePanel = document.getElementById("volumePanel")
const volumeSlider = document.getElementById("volumeSlider")
const currentVolumeSpan = document.getElementById("currentVolume")
const muteButton = document.getElementById("muteButton")
const volumeIcon = document.getElementById("volumeIcon")

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  checkMobile()
  initializeRain()
  initializeLightning()
  initializeAudio()
  initializeVolumeControl()
  initializeButtons()

  window.addEventListener("resize", checkMobile)
})

// Check if mobile
function checkMobile() {
  isMobile = window.innerWidth < 768
}

// Initialize rain effect
function initializeRain() {
  const rainCount = isMobile ? 25 : 50

  for (let i = 0; i < rainCount; i++) {
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
      // Sometimes double flash
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
  mainCard.classList.add("lightning")

  // Update rain drops
  const rainDrops = document.querySelectorAll(".rain-drop")
  rainDrops.forEach((drop) => drop.classList.add("lightning"))

  setTimeout(() => {
    isLightning = false
    lightningOverlay.classList.remove("active")
    mainCard.classList.remove("lightning")
    rainDrops.forEach((drop) => drop.classList.remove("lightning"))
  }, 150)
}

// Initialize audio
function initializeAudio() {
  if (backgroundAudio) {
    backgroundAudio.volume = volume
    backgroundAudio.loop = true

    // Try to auto-play
    backgroundAudio.play().catch((error) => {
      console.log("Auto-play prevented, waiting for user interaction")
    })
  }
}

// Initialize volume control
function initializeVolumeControl() {
  // Volume button click
  volumeButton.addEventListener("click", () => {
    if (isMobile) {
      toggleVolumeControl()
    } else {
      toggleMute()
    }
  })

  // Volume slider
  volumeSlider.addEventListener("input", (e) => {
    handleVolumeChange(Number.parseFloat(e.target.value))
  })

  // Mute button
  muteButton.addEventListener("click", toggleMute)

  // Mouse events for desktop
  if (!isMobile) {
    volumeControl.addEventListener("mouseenter", handleMouseEnter)
    volumeControl.addEventListener("mouseleave", handleMouseLeave)
  }

  // Click outside to close
  document.addEventListener("click", (e) => {
    if (!volumeControl.contains(e.target)) {
      setShowVolumeControl(false)
    }
  })

  // Update initial display
  updateVolumeDisplay()
}

// Handle volume change
function handleVolumeChange(newVolume) {
  volume = Math.max(0, Math.min(1, newVolume))
  isMuted = false
  updateAudioVolume()
  updateVolumeDisplay()
}

// Toggle mute
function toggleMute() {
  isMuted = !isMuted
  updateAudioVolume()
  updateVolumeDisplay()
}

// Toggle volume control
function toggleVolumeControl() {
  setShowVolumeControl(!showVolumeControl)
}

// Set show volume control
function setShowVolumeControl(show) {
  showVolumeControl = show
  if (show) {
    volumePanel.classList.add("show")
  } else {
    volumePanel.classList.remove("show")
  }
}

// Handle mouse enter
function handleMouseEnter() {
  if (!isMobile) {
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      hideTimeout = null
    }
    setShowVolumeControl(true)
  }
}

// Handle mouse leave
function handleMouseLeave() {
  if (!isMobile) {
    hideTimeout = setTimeout(() => {
      setShowVolumeControl(false)
      hideTimeout = null
    }, 400)
  }
}

// Update audio volume
function updateAudioVolume() {
  if (backgroundAudio) {
    backgroundAudio.volume = isMuted ? 0 : volume
  }
}

// Update volume display
function updateVolumeDisplay() {
  // Update slider
  volumeSlider.value = volume

  // Update percentage
  currentVolumeSpan.textContent = Math.round(volume * 100) + "%"

  // Update mute button
  muteButton.textContent = isMuted ? "Unmute" : "Mute"
  muteButton.className = isMuted ? "mute-button muted" : "mute-button"

  // Update volume icon
  if (isMuted) {
    volumeIcon.innerHTML = `
            <path d="M11 5L6 9H2v6h4l5 4V5zM22 9l-6 6M16 9l6 6"/>
        `
  } else {
    volumeIcon.innerHTML = `
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.08"></path>
        `
  }
}

// Initialize buttons
function initializeButtons() {
  const redirectButtons = document.querySelectorAll(".redirect-button")

  redirectButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const url = button.getAttribute("data-url")
      const isExternal = button.getAttribute("data-external") === "true"

      if (isExternal) {
        window.open(url, "_blank", "noopener,noreferrer")
      } else {
        window.location.href = url
      }
    })
  })
}
