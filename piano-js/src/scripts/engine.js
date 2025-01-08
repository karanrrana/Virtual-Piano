// Select all piano keys, volume slider, and keys toggle input
const pianoKeys = document.querySelectorAll(".piano-keys .key");
const volumeSlider = document.querySelector(".volume-slider input");
const keysCheck = document.querySelector(".keys-check input");

// Select the score display element
const scoreDisplay = document.getElementById("score");

// Initialize the score variable
let score = 0;

// Array to store mapped keys
let mapedKeys = [];

// Initialize audio object
let audio = new Audio("src/tunes/a.wav");

// Function to play a tune based on the key pressed
const playTune = (key) => {
  audio.src = `src/tunes/${key}.wav`;
  audio.play();

  const clickedKey = document.querySelector(`[data-key="${key}"]`);
  clickedKey.classList.add("active");

  // Add points for playing a note
  updateScore(10); // Adds 10 points for each note played

  setTimeout(() => {
    clickedKey.classList.remove("active");
  }, 150);
};

// Function to update the score display
const updateScore = (points) => {
  score += points; // Add points to the current score
  scoreDisplay.textContent = score; // Update the score display
};

// Add event listeners to piano keys for mouse clicks
pianoKeys.forEach((key) => {
  key.addEventListener("click", () => playTune(key.dataset.key));
  mapedKeys.push(key.dataset.key);
});

// Add event listener for keyboard interaction
// Play tune and handle scoring
// Deduct points if an incorrect key is pressed
// (Optional scoring logic can be adjusted here)
document.addEventListener("keydown", (e) => {
  if (mapedKeys.includes(e.key)) {
    playTune(e.key);
  } else {
    // Optional: Deduct points for incorrect keys
    updateScore(-5); // Deduct 5 points for incorrect key presses
  }
});

// Function to handle volume slider input
const handleVolume = (e) => {
  audio.volume = e.target.value;
};

// Function to show or hide keys
const showHideKeys = () => {
  pianoKeys.forEach((key) => key.classList.toggle("hide"));
};

// Add event listener to volume slider
if (!volumeSlider.dataset.initialized) {
  volumeSlider.addEventListener("input", handleVolume);
  volumeSlider.dataset.initialized = true;
}

// Add event listener to keys toggle input
if (!keysCheck.dataset.initialized) {
  keysCheck.addEventListener("click", showHideKeys);
  keysCheck.dataset.initialized = true;
}

// Reset score button logic (optional)
const resetButton = document.getElementById("reset-score");
if (resetButton) {
  resetButton.addEventListener("click", () => {
    score = 0; // Reset score to zero
    updateScore(0); // Update the display
  });
}

// Game mode elements
const startButton = document.getElementById("start-challenge");
const gameStatus = document.getElementById("game-status");
const timeLeftDisplay = document.getElementById("time-left");

let sequence = []; // Random sequence of keys
let userInput = []; // User's input during the challenge
let timer; // Timer reference

// Function to generate a random sequence of piano keys
const generateRandomSequence = (length) => {
  const allKeys = Array.from(pianoKeys).map((key) => key.dataset.key);
  const randomSequence = [];
  for (let i = 0; i < length; i++) {
    const randomKey = allKeys[Math.floor(Math.random() * allKeys.length)];
    randomSequence.push(randomKey);
  }
  return randomSequence;
};

// Function to play the random sequence with visual indication
const playSequence = (sequence) => {
  sequence.forEach((key, index) => {
    setTimeout(() => {
      const keyElement = document.querySelector(`.key[data-key="${key}"]`);
      keyElement.classList.add("highlight"); // Add a highlight class for visibility
      audio.src = `src/tunes/${key}.wav`; // Play the sound
      audio.play();
      setTimeout(() => keyElement.classList.remove("highlight"), 400); // Remove highlight
    }, index * 1000); // Adjust timing for each key
  });
};

// CSS for highlight effect
const style = document.createElement("style");
style.innerHTML = `
  .key.highlight {
    background-color: yellow; /* Highlight color */
    border: 5px solid red; /* Optional: Add a border */
    transition: background-color 0.3s ease, border 0.3s ease; /* Smooth transition */
  }
`;
document.head.appendChild(style);

// Function to start the challenge
const startChallenge = () => {
  // Reset variables and UI
  sequence = generateRandomSequence(5); // Generate a sequence of 5 random keys
  userInput = [];
  gameStatus.textContent = "Watch and play the sequence!";
  timeLeftDisplay.textContent = "15";

  // Play the sequence
  playSequence(sequence);

  // Start the timer
  startTimer(15);
};

// Timer logic
const startTimer = (duration) => {
  let timeLeft = duration;
  timer = setInterval(() => {
    timeLeft--;
    timeLeftDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      if (userInput.length < sequence.length) {
        endGame(false); // Lose if time runs out
      }
    }
  }, 1000);
};



// Event listener for Start Challenge button
if (startButton) {
  startButton.addEventListener("click", startChallenge);
}

// Track user input during the challenge (keyboard input)
document.addEventListener("keydown", (e) => {
  const keyPressed = e.key.toLowerCase(); // Normalize to lowercase to match with dataset

  // Only proceed if there's an ongoing sequence
  if (sequence.length > 0 && userInput.length < sequence.length) {
    // Check if the key pressed matches the expected key in the sequence
    if (keyPressed === sequence[userInput.length]) {
      userInput.push(keyPressed); // Add correct key to user input

      // Check if the sequence is fully matched
      if (userInput.length === sequence.length) {
        endGame(true); // User won
      }
    } else {
      endGame(false); // User lost if they press the wrong key
    }
  }
});


// Track user input during the challenge
pianoKeys.forEach((key) => {
  key.addEventListener("click", () => {
    const keyPressed = key.dataset.key;
    if (sequence.length > 0 && userInput.length < sequence.length) {
      userInput.push(keyPressed);

      // Check user input
      if (userInput[userInput.length - 1] !== sequence[userInput.length - 1]) {
        endGame(false); // Lose if input doesn't match
      } else if (userInput.length == sequence.length) {
        // End the game immediately when user has matched the entire sequence
        endGame(true); // Win if sequence is completed
      }
    }
  });
});

// Modify endGame function to show "You Won!" immediately
const endGame = (win) => {
  clearInterval(timer);
  if (win) {
    gameStatus.textContent = "You won! 🎉";  // Display "You Won!" right away
    updateScore(50); // Add 50 points for winning
  } else {
    gameStatus.textContent = "You lost! 😞";
    updateScore(-20); // Subtract 20 points for losing
  }
  sequence = []; // Reset sequence
  userInput = []; // Reset user input
};

