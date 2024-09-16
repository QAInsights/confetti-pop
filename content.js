chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "triggerConfetti") {
    chrome.storage.sync.get("confettiOptions", () => {
      console.log("triggerConfetti");

      // get confetti options from local storage
      chrome.storage.sync.get("confettiOptions", (data) => {
        const noSoundApprovedStyle = ["confettiSnow"];
        const audio = new Audio(
          chrome.runtime.getURL("assets/confetti_pop.mp3")
        );
        const options = data.confettiOptions || {
          particleCount: data.confettiOptions.particleCount,
          duration: data.confettiOptions.duration,
          emojis: data.confettiOptions.emojis.join(","),
          colors: data.confettiOptions.colors,
          confettiStyle: data.confettiOptions.confettiStyle,
          confettiSound: data.confettiOptions.confettiSound,
          spread: data.confettiOptions.spread,
          angle: data.confettiOptions.angle,
          confettiMouseClick: data.confettiOptions.confettiMouseClick,
        };

        // confetti({
        //   particleCount: parseInt(options.particleCount),
        //   spread: 180,
        //   resize: false,
        //   angle: 90,
        //   origin: { y: 0.6 },
        //   // shapes: options.emojis.map(emoji => confetti.shapeFromText({ text: emoji })),
        //   // colors: options.colors,
        //   duration: parseInt(options.duration) * 1000,
        // });

        triggerConfetti(options);
        updateConfettiStats(options.particleCount);

        if (
          options.confettiSound &&
          !noSoundApprovedStyle.includes(options.confettiStyle)
        )
          playConfettiSound();

        // Use this function when you want to play the sound
        // playConfettiSound();

        // if (options.confettiStyle === "confettiBasic") {
        //   confetti({
        //     particleCount: parseInt(options.particleCount),
        //     spread: 70,
        //     origin: { y: 0.6 },
        //   });
        // }
      });
    });
  }
});

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function fire(particleRatio, opts, count) {
  var defaults = {
    origin: { y: 0.7 },
  };
  confetti({
    ...defaults,
    ...opts,
    particleCount: Math.floor(count * particleRatio),
  });
}

function fireThee(particleCount, duration, options) {
  var duration = duration * 1000;
  var animationEnd = Date.now() + duration;
  var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  var interval = setInterval(function () {
    var timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    var finalParticleCount = particleCount * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    confetti({
      ...defaults,
      finalParticleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });

    confetti({
      ...defaults,
      finalParticleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });

    if (options.confettiSound) {
      confetti({
        ...defaults,
        finalParticleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      playConfettiSound();

      confetti({
        ...defaults,
        finalParticleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
      playConfettiSound();
    }
  }, 250);
}

function shootNakshatra(particleCount) {
  var defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
  };

  function shoot() {
    confetti({
      ...defaults,
      particleCount: particleCount,
      scalar: 1.2,
      shapes: ["star"],
    });

    confetti({
      ...defaults,
      particleCount: particleCount,
      scalar: 0.75,
      shapes: ["circle"],
    });
  }

  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);
}

function sprinkleSnow(duration, particleCount) {
  var duration = parseInt(duration) * 1000;
  var animationEnd = Date.now() + duration;
  var skew = 1;

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  (function frame() {
    var timeLeft = animationEnd - Date.now();
    var ticks = Math.max(200, 500 * (timeLeft / duration));
    skew = Math.max(0.8, skew - 0.001);

    confetti({
      particleCount: particleCount,
      startVelocity: 0,
      ticks: ticks,
      origin: {
        x: Math.random(),
        // since particles fall down, skew start toward the top
        y: Math.random() * skew - 0.2,
      },
      colors: ["#ffffff"],
      shapes: ["circle"],
      gravity: randomInRange(0.4, 0.6),
      scalar: randomInRange(0.4, 1),
      drift: randomInRange(-0.4, 0.4),
    });

    if (timeLeft > 0) {
      requestAnimationFrame(frame);
    }
  })();
}

function fireCelebration(particleCount, colors, duration) {
  var end = Date.now() + parseInt(duration) * 1000;

  if (colors.length === 0) {
    colors = ["#bb0000", "#6B39FF"];
  }

  (function frame() {
    confetti({
      particleCount: particleCount,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });
    confetti({
      particleCount: particleCount,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

function playConfettiSound(volume) {
  const audio = new Audio(chrome.runtime.getURL("./assets/confetti_pop.mp3"));
  audio.currentTime = 0; // Reset the audio to the beginning
  // play at reduced volume, else at full volume
  audio.volume = volume || 1;

  audio.play().catch((error) => {
    console.error("Audio playback failed:", error);
  });
}

// add a mouse click event listener
document.addEventListener("click", (event) => {
  console.log("Click detected");

  // Get local storage confetti options
  chrome.storage.sync.get("confettiOptions", (data) => {
    const confettiOptions = data.confettiOptions;
    if (confettiOptions.confettiMouseClick) {
      triggerConfetti(confettiOptions);
      updateConfettiStats(confettiOptions.particleCount);
    }
  });
});

function triggerConfetti(options) {
  const noSoundApprovedStyle = ["confettiSnow"];
  const audio = new Audio(chrome.runtime.getURL("assets/confetti_pop.mp3"));

  log("Triggering confetti", { options });
  switch (options.confettiStyle) {
    case "confettiBasic":
      confetti({
        particleCount: parseInt(options.particleCount),
        spread: parseInt(options.spread),
        angle: parseInt(options.angle),
        origin: { y: 0.6 },
      });
      break;
    case "confettiEmoji":
      confetti({
        particleCount: parseInt(options.particleCount),
        spread: parseInt(options.spread),
        angle: parseInt(options.angle),
        origin: { y: 0.6 },
        shapes: options.emojis.map((emoji) =>
          confetti.shapeFromText({ text: emoji })
        ),
      });
      break;
    case "confettiRandom":
      confetti({
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        particleCount: randomInRange(50, 100),
        origin: { y: 0.6 },
      });
      break;
    case "confettiActual":
      var count = parseInt(options.particleCount);
      fire(0.25, { spread: 26, startVelocity: 55 }, count);
      fire(0.2, { spread: 60 }, count);
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 }, count);
      fire(
        0.1,
        { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 },
        count
      );
      fire(0.1, { spread: 120, startVelocity: 45 }, count);
      break;
    case "confettiThee":
      fireThee(
        parseInt(options.particleCount),
        parseInt(options.duration),
        options
      );
      break;
    case "confettiNakshatra":
      shootNakshatra(parseInt(options.particleCount));
      break;
    case "confettiSnow":
      sprinkleSnow(parseInt(options.duration), parseInt(options.particleCount));
      break;
    case "confettiCelebration":
      fireCelebration(options.particleCount, options.colors, options.duration);
      break;
    case "confettiCinematic":
      fireCinematic(
        parseInt(options.duration),
        parseInt(options.particleCount)
      );
      break;
    case "confettiAllOver":
      topLeftConfetti(
        parseInt(options.particleCount),
        parseInt(options.angle),
        parseInt(options.spread),
        parseInt(options.duration)
      );
      topMiddleConfetti(
        parseInt(options.particleCount),
        parseInt(options.angle),
        parseInt(options.spread),
        parseInt(options.duration)
      );
      topRightConfetti(
        parseInt(options.particleCount),
        parseInt(options.angle),
        parseInt(options.spread),
        parseInt(options.duration)
      );
      middleLeftConfetti(
        parseInt(options.particleCount),
        parseInt(options.angle),
        parseInt(options.spread),
        parseInt(options.duration)
      );
      middleMiddleConfetti(
        parseInt(options.particleCount),
        parseInt(options.angle),
        parseInt(options.spread),
        parseInt(options.duration)
      );
      middleRightConfetti(
        parseInt(options.particleCount),
        parseInt(options.angle),
        parseInt(options.spread),
        parseInt(options.duration)
      );
      bottomLeftConfetti(
        parseInt(options.particleCount),
        parseInt(options.angle),
        parseInt(options.spread),
        parseInt(options.duration)
      );
      bottomMiddleConfetti(
        parseInt(options.particleCount),
        parseInt(options.angle),
        parseInt(options.spread),
        parseInt(options.duration)
      );
      bottomRightConfetti(
        parseInt(options.particleCount),
        parseInt(options.angle),
        parseInt(options.spread),
        parseInt(options.duration)
      );
      break;

    case "confettiFlowerPots":
      fireFlowerPots(options.colors, options.particleCount, options.duration);
      break;
    default:
      confetti({
        particleCount: parseInt(options.particleCount),
        spread: parseInt(options.spread),
        angle: parseInt(options.angle),
        origin: { y: 0.6 },
      });
      break;
  }

  if (
    options.confettiSound &&
    !noSoundApprovedStyle.includes(options.confettiStyle)
  ) {
    playConfettiSound();
  }
}

// Logger function
function log(message, data = {}) {
  console.log(`Confetti Logger: ${message}`, data);
}

function fireCinematic(duration, particleCount) {
  var duration = duration * 1000;
  var animationEnd = Date.now() + duration;
  var skew = 1;

  (function frame() {
    var timeLeft = animationEnd - Date.now();
    var ticks = Math.max(2001, 500 * (timeLeft / duration));
    skew = Math.max(0.8, skew - 0.001);

    confetti({
      particleCount: particleCount,
      startVelocity: 10,
      ticks: ticks,
      origin: {
        x: Math.random(),
        // since particles fall down, skew start toward the top
        y: Math.random() * skew - 0.2,
      },
      gravity: randomInRange(0.4, 0.6),
      scalar: randomInRange(0.4, 1),
      drift: randomInRange(-0.4, 0.4),
    });

    if (timeLeft > 0) {
      requestAnimationFrame(frame);
    }
  })();
}

function fireFlowerPots(colors, particleCount, duration) {
  var end = Date.now() + duration * 1000;

  (function frame() {
    // Left flower pot
    confetti({
      particleCount: particleCount,
      angle: 90,
      spread: 25,
      origin: { x: 0, y: 1 },
      startVelocity: 50,
      colors: colors,
      length: 10,
      drift: 2,
    });

    // Middle flower pot
    confetti({
      particleCount: particleCount,
      angle: 90,
      spread: 45,
      origin: { x: 0.5, y: 1 },
      startVelocity: 50,
      colors: colors,
      length: 10,
      drift: 0,
    });

    // Right flower pot
    confetti({
      particleCount: particleCount,
      angle: 90,
      spread: 25,
      origin: { x: 1, y: 1 },
      startVelocity: 50,
      colors: colors,
      length: 10,
      drift: -2,
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

function updateConfettiStats(particleCount) {
  chrome.storage.sync.get("confettiStats", (data) => {
    log("Updating stats", { data });
    let prevCount = data.confettiStats?.triggered || 0;
    let totalTriggered = parseInt(prevCount) + parseInt(particleCount);
    chrome.storage.sync.set(
      {
        confettiStats: { triggered: totalTriggered },
      },
      () => {
        log("Stats updated", { totalTriggered });
      }
    );
  });
}

// Load stats
// chrome.storage.sync.get("confettiStats", (data) => {
//   document.getElementById("stats").innerText = data.confettiStats.triggered;
// });

function topLeftConfetti(particleCount, angle, spread, duration) {
  confetti({
    particleCount: particleCount,
    spread: spread,
    origin: { y: 0.0, x: 0.0 },
    angle: angle,
  });
}

function topMiddleConfetti(particleCount, angle, spread, duration) {
  confetti({
    particleCount: particleCount,
    spread: spread,
    origin: { y: 0.0, x: 0.5 },
    angle: angle,
  });
}

function topRightConfetti(particleCount, angle, spread, duration) {
  confetti({
    particleCount: particleCount,
    spread: spread,
    origin: { y: 0.0, x: 1.0 },
    angle: angle,
  });
}

function middleLeftConfetti(particleCount, angle, spread, duration) {
  confetti({
    particleCount: particleCount,
    spread: spread,
    origin: { y: 0.5, x: 0.0 },
    angle: angle,
  });
}

function middleMiddleConfetti(particleCount, angle, spread, duration) {
  confetti({
    particleCount: particleCount,
    spread: spread,
    origin: { y: 0.5, x: 0.5 },
    angle: angle,
  });
}

function middleRightConfetti(particleCount, angle, spread, duration) {
  confetti({
    particleCount: particleCount,
    spread: spread,
    origin: { y: 0.5, x: 1.0 },
    angle: angle,
  });
}

function bottomLeftConfetti(particleCount, angle, spread, duration) {
  confetti({
    particleCount: particleCount,
    spread: spread,
    origin: { y: 1.0, x: 0.0 },
    angle: angle,
  });
}

function bottomMiddleConfetti(particleCount, angle, spread, duration) {
  confetti({
    particleCount: particleCount,
    spread: spread,
    origin: { y: 1.0, x: 0.5 },
    angle: angle,
  });
}

function bottomRightConfetti(particleCount, angle, spread, duration) {
  confetti({
    particleCount: particleCount,
    spread: spread,
    origin: { y: 1.0, x: 1.0 },
    angle: angle,
  });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "playConfettiSound") {
    playConfettiSound(0.1);
  }
});
