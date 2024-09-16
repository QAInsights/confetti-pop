// Save click event listener
document.getElementById("save").addEventListener("click", () => {
  // Get all the color picker values
  const colorPickers = document.getElementsByClassName("color-picker");
  const colors = [];
  for (let i = 0; i < colorPickers.length; i++) {
    colors.push(colorPickers[i].value);
  }

  const options = {
    particleCount: document.getElementById("particleCount").value,
    duration: document.getElementById("duration").value,
    emojis: document.getElementById("emojis").value.split(","),
    colors: colors,
    confettiStyle: document.getElementById("confettiStyle").value,
    confettiSound: document.getElementById("confettiSound").checked,
    spread: document.getElementById("spread").value,
    angle: document.getElementById("angle").value,
    confettiMouseClick: document.getElementById("confettiMouseClick").checked,
  };

  chrome.storage.sync.set({ confettiOptions: options }, () => {
    console.log("Options saved!", options);
    // const saveStatus = document.getElementById("saveStatus");
    // saveStatus.hidden = false;
    // setTimeout(() => {
    //   saveStatus.hidden = true;
    // }, 1000);

    // change button text to "🎉 Saved!"
    document.getElementById("save").innerText = "🥳 Saved!";
    setTimeout(() => {
      document.getElementById("save").innerText = "🎉 Save";
    }, 1000);
  });
});

// Load saved options
chrome.storage.sync.get("confettiOptions", (data) => {
  console.log(data);
  if (data.confettiOptions) {
    document.getElementById("particleCount").value =
      data.confettiOptions.particleCount;
    document.getElementById("duration").value = data.confettiOptions.duration;
    document.getElementById("emojis").value =
      data.confettiOptions.emojis.join(",");
    document.getElementById("confettiStyle").value =
      data.confettiOptions.confettiStyle;
    document.getElementById("confettiSound").checked =
      data.confettiOptions.confettiSound;

    document.getElementById("spread").value = data.confettiOptions.spread;
    document.getElementById("angle").value = data.confettiOptions.angle;
    loadColors(data.confettiOptions.colors);
    document.getElementById("confettiMouseClick").checked =
      data.confettiOptions.confettiMouseClick;
  }
});

// Load stats
chrome.storage.sync.get("confettiStats", (data) => {
  document.getElementById("stats").innerText = data.confettiStats.triggered;
});

function loadColors(colors) {
  const colorPickers = document.getElementsByClassName("color-picker");
  for (let i = 0; i < colorPickers.length; i++) {
    colorPickers[i].value = colors[i];
  }
}

// Reset stats
document.getElementById("resetStats").addEventListener("click", () => {
  chrome.storage.sync.set({ confettiStats: { triggered: 0 } }, () => {
    document.getElementById("stats").innerText = "0";
  });
});

// Add help button functionality
document.getElementById("helpButton").addEventListener("click", () => {
  document.getElementById("helpPopup").style.display = "flex";
});

// Add close help button functionality
document.getElementById("closeHelp").addEventListener("click", () => {
  document.getElementById("helpPopup").style.display = "none";
});

// Function to validate and correct input
function validateInput(input) {
  const min = parseInt(input.min);
  const max = parseInt(input.max);
  let value = parseInt(input.value);

  if (isNaN(value) || value < min) {
    value = Math.abs(value);
  } else if (value > max) {
    value = max;
  }

  input.value = value;
}

// Add event listeners to spread and angle inputs
document.getElementById("spread").addEventListener("change", function () {
  validateInput(this);
});

document.getElementById("angle").addEventListener("change", function () {
  validateInput(this);
});

// Sound checkbox functionality
document.getElementById("confettiSound").addEventListener("change", () => {
  const audio = document.getElementById("confettiSound");
  if (audio.checked) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "playConfettiSound" });
    });
  }
});

// Style change event listener
document.getElementById("confettiStyle").addEventListener("change", () => {
  const style = document.getElementById("confettiStyle").value;
  switch (style) {
    case "confettiAllOver":
      document.getElementById("spread").value = "240";
      document.getElementById("angle").value = "90";
      break;
    case "confettiFlowerPots":
      document.getElementById("particleCount").value = "25";
      break;
    case "confettiCinematic":
      document.getElementById("particleCount").value = "12";
      document.getElementById("duration").value = "10";
      break;
  }
});
