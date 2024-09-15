chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    console.log("Extension installed for the first time.");
    // Perform actions needed on first install
    // Load the default confetti options
    chrome.storage.sync.set({
      confettiOptions: {
        spread: 360,
        angle: 90,
        particleCount: 100,
        colors: ["#FF0000", "#00FF00", "#0000FF"],
        emojis: ["🦄", "🎉", "✨"],
        confettiMouseClick: false,
        confettiStyle: "confettiBasic",
        confettiSound: false,
        duration: 5,
      },
      confettiStats: {
        triggered: 0,
      },
    });
  } else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
    console.log("Extension updated to a new version.");
  } else if (
    details.reason === chrome.runtime.OnInstalledReason.CHROME_UPDATE
  ) {
    console.log("Chrome updated to a new version.");
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "trigger-confetti") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "triggerConfetti" });
    });
  }
});
