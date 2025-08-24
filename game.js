// =====================
// GLOBAL VARIABLES
// =====================
let score = parseInt(localStorage.getItem("score")) || 0;
let clickPower = parseInt(localStorage.getItem("clickPower")) || 1;
let autoClick = parseInt(localStorage.getItem("autoClick")) || 0;
let rebirths = parseInt(localStorage.getItem("rebirths")) || 0;
let prestigePoints = parseInt(localStorage.getItem("prestigePoints")) || 0;
let extraClick = parseInt(localStorage.getItem("extraClick")) || 0;

let gems = parseInt(localStorage.getItem("gems")) || 0;
let gemsPerSecond = parseInt(localStorage.getItem("gemsPerSecond")) || 1;
let gemIntervalTime = parseInt(localStorage.getItem("gemIntervalTime")) || 1000;

// =====================
// HELPER FUNCTIONS
// =====================
function saveAll() {
  localStorage.setItem("score", score);
  localStorage.setItem("clickPower", clickPower);
  localStorage.setItem("autoClick", autoClick);
  localStorage.setItem("rebirths", rebirths);
  localStorage.setItem("prestigePoints", prestigePoints);
  localStorage.setItem("extraClick", extraClick);
  localStorage.setItem("gems", gems);
  localStorage.setItem("gemsPerSecond", gemsPerSecond);
  localStorage.setItem("gemIntervalTime", gemIntervalTime);
}

function clampNumber(n, min=0) {
  return isNaN(n) ? min : n;
}

// =====================
// MAIN PAGE FUNCTIONS
// =====================
function mainPageInit() {
  score = clampNumber(score);
  clickPower = clampNumber(clickPower);
  autoClick = clampNumber(autoClick);
  rebirths = clampNumber(rebirths);
  prestigePoints = clampNumber(prestigePoints);
  extraClick = clampNumber(extraClick);

  const scoreEl = document.getElementById("score");
  const rebirthInfo = document.getElementById("rebirthInfo");
  const clickBtn = document.getElementById("clickBtn");

  clickBtn.addEventListener("click", () => {
    score += (clickPower + extraClick) * (1 + rebirths*0.1);
    updateMainUI();
  });

  setInterval(() => {
    score += autoClick * (1 + rebirths*0.1);
    updateMainUI();
  }, 1000);

  setInterval(saveAll, 5000);

  updateMainUI();

  function updateMainUI() {
    scoreEl.textContent = "Cakes: " + Math.floor(score);
    rebirthInfo.textContent = `Rebirths: ${rebirths} | Multiplier: x${(1+rebirths*0.1).toFixed(1)} | Points: ${prestigePoints}`;
  }
}

// =====================
// GEM PAGE FUNCTIONS
// =====================
function gemPageInit() {
  gems = clampNumber(gems);
  gemsPerSecond = clampNumber(gemsPerSecond);
  gemIntervalTime = clampNumber(gemIntervalTime);

  const gemsEl = document.getElementById("gems");
  const upgradePerSecondBtn = document.getElementById("upgradePerSecond");
  const upgradeSpeedBtn = document.getElementById("upgradeSpeed");
  const upgradeClickBtn = document.getElementById("upgradeClick");
  const backBtn = document.getElementById("backBtn");

  let perSecondCost = 10;
  let speedCost = 20;
  let clickCost = 50;

  function updateUI() {
    gemsEl.textContent = "Gems: " + Math.floor(gems);
    upgradePerSecondBtn.textContent = `Upgrade Gems/Second (Cost: ${perSecondCost})`;
    upgradeSpeedBtn.textContent = `Upgrade Generation Speed (Cost: ${speedCost})`;
    upgradeClickBtn.textContent = `Upgrade Cake Click (+1 per click) (Cost: ${clickCost})`;

    upgradePerSecondBtn.className = "upgrade" + (gems < perSecondCost ? " disabled" : "");
    upgradeSpeedBtn.className = "upgrade" + (gems < speedCost ? " disabled" : "");
    upgradeClickBtn.className = "upgrade" + (gems < clickCost ? " disabled" : "");
  }

  upgradePerSecondBtn.addEventListener("click", () => {
    if (gems >= perSecondCost) {
      gems -= perSecondCost;
      gemsPerSecond += 1;
      perSecondCost = Math.floor(perSecondCost * 1.5);
      saveAll();
      updateUI();
    }
  });

  upgradeSpeedBtn.addEventListener("click", () => {
    if (gems >= speedCost) {
      gems -= speedCost;
      gemIntervalTime = Math.max(100, gemIntervalTime*0.9);
      speedCost = Math.floor(speedCost*1.7);
      startGemGeneration();
      saveAll();
      updateUI();
    }
  });

  upgradeClickBtn.addEventListener("click", () => {
    if (gems >= clickCost) {
      gems -= clickCost;
      extraClick += 1;
      localStorage.setItem("extraClick", extraClick);
      clickCost = Math.floor(clickCost*2);
      saveAll();
      updateUI();
    }
  });

  backBtn.addEventListener("click", () => {
    window.location.href = "index.html"; // main page filename
  });

  function startGemGeneration() {
    if (window.gemInterval) clearInterval(window.gemInterval);
    window.gemInterval = setInterval(() => {
      gems += gemsPerSecond;
      saveAll();
      updateUI();
    }, gemIntervalTime);
  }

  updateUI();
  startGemGeneration();
}
