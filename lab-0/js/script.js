// This code was developed with assistance from ChatGPT for explanations and guidance on structure.
// Used for Lab/Assignment purposes, as per guidelines.

class GameController {
  constructor() {
    this.clicksCount = 0; // Initialize the count of correct clicks
    this.initializeGoButton(); // Set up the Go button click listener
  }

  initializeGoButton() {
    // Select the Go button and add an event listener for starting the game
    const goButton = document.getElementById("goButton");
    goButton.addEventListener("click", () => {
      // Get the number of buttons from the input field
      this.n = parseInt(document.getElementById("buttonInput").value);
      if (this.validateInput(this.n)) {
        // Validate the input
        this.resetGame(); // Reset the game state if valid
        this.startGame(this.n); // Start the game with n buttons
      } else {
        alert("Please enter a valid number between 3 and 7");
      }
    });
  }

  validateInput(n) {
    // Ensure the number is between 3 and 7
    return n >= 3 && n <= 7;
  }

  startGame(n) {
    console.log(`Starting game with ${n} buttons`);

    // Create n buttons and store them in the buttons array
    this.buttons = [];
    for (let i = 0; i < n; i++) {
      const button = new Button(i, this.getRandomColor(), { x: 0, y: 0 }, this);
      button.renderButton(); // Render the button to the DOM
      this.buttons.push(button); // Add the button to the array
    }

    this.disableButtons(true); // Disable buttons before scrambling

    // Scramble buttons after n seconds and re-enable them
    setTimeout(() => {
      this.scrambleButtons();
      this.disableButtons(false); // Enable buttons for user interaction
    }, n * 1000);
  }

  scrambleButtons() {
    console.log("Scrambling buttons...");
    // Move each button to a random position
    this.buttons.forEach((button) => {
      button.moveRandomly();
    });
  }

  disableButtons(disable) {
    // Enable or disable all buttons based on the disable flag
    this.buttons.forEach((button) => {
      button.element.disabled = disable;
    });
  }

  endGame(isSuccess) {
    // Display a success or failure message and reset the game after a countdown
    const successMessage = isSuccess ? "Excellent memory!" : "Wrong order!";
    const messageHandler = new MessageHandler();
    messageHandler.renderMessage(successMessage); // Show the message

    const messageContainer = document.getElementById("messageContainer");
    const countdownElement = document.createElement("p");
    messageContainer.appendChild(countdownElement);

    const resetMessage = "Resetting game in ";
    let timeLeft = 3; // Countdown duration

    // Start countdown and reset the game when finished
    const countdown = setInterval(() => {
      if (timeLeft > 0) {
        countdownElement.innerText = `${resetMessage} ${timeLeft} seconds`;
        timeLeft--;
      } else {
        countdownElement.innerText = "Resetting now...";
        clearInterval(countdown); // Stop countdown
        this.resetGame(); // Reset the game
      }
    }, 1000); // Countdown interval in milliseconds

    this.disableButtons(true); // Disable buttons during the countdown
  }

  resetGame() {
    console.log("Resetting the game...");

    // Clear buttons and messages from the DOM
    const buttonContainer = document.getElementById("buttonContainer");
    buttonContainer.innerHTML = ""; // Remove all buttons

    const messageContainer = document.getElementById("messageContainer");
    messageContainer.innerHTML = ""; // Remove all messages

    // Reset game state variables
    this.clicksCount = 0;
    this.buttons = [];
  }

  getRandomColor() {
    // Generate a random hex color code
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}

class Button {
  constructor(id, color, position, gameController) {
    this.id = id;
    this.color = color;
    this.position = position;
    this.gameController = gameController; // Reference to the game controller
  }

  renderButton() {
    // Create a button element and add it to the DOM
    const buttonContainer = document.getElementById("buttonContainer");
    const btn = document.createElement("button");
    btn.style.backgroundColor = this.color;
    btn.style.height = "5em";
    btn.style.width = "10em";
    btn.style.margin = "1em 1em"; // Button margin
    btn.textContent = this.id + 1; // Display button number
    btn.addEventListener("click", () => this.onClick()); // Handle button click
    buttonContainer.appendChild(btn);
    this.element = btn;
  }

  moveRandomly() {
    // Randomly position the button within the viewport, avoiding overlap with the container
    const container = document.querySelector(".container");

    if (!container) {
      console.error("Container not found!");
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const buttonWidth = this.element.offsetWidth;
    const buttonHeight = this.element.offsetHeight;

    // Use viewport dimensions instead of window dimensions for better accuracy
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;

    let randomX, randomY;
    let attempts = 0;
    const maxAttempts = 100; // Limit attempts to prevent infinite loops

    do {
      // Generate random positions within the viewport, leaving some margin
      randomX = Math.random() * (viewportWidth - buttonWidth - 20) + 10;
      randomY = Math.random() * (viewportHeight - buttonHeight - 20) + 10;

      attempts++;
      if (attempts > maxAttempts) {
        console.warn(
          "Max attempts reached. Button may overlap with container."
        );
        break;
      }
    } while (
      // Ensure the button doesn't overlap with the container
      randomX < containerRect.right &&
      randomX + buttonWidth > containerRect.left &&
      randomY < containerRect.bottom &&
      randomY + buttonHeight > containerRect.top
    );

    // Set the button's final position
    this.element.style.position = "fixed"; // Set fixed positioning to avoid layout issues
    this.element.style.left = `${randomX}px`;
    this.element.style.top = `${randomY}px`;
    this.element.textContent = ""; // Clear button label
  }

  onClick() {
    // Handle button click logic and validate the order
    console.log(`Button ${this.id + 1} clicked`);
    if (this.id === this.gameController.clicksCount) {
      console.log("correct");
      this.gameController.clicksCount += 1;
      this.revealButton(); // Reveal the button number

      if (this.id + 1 == this.gameController.n) {
        this.gameController.endGame(true); // End game on success
      }
    } else {
      console.log("incorrect");
      this.gameController.endGame(false); // End game on failure
    }
  }

  revealButton() {
    // Show the button number when clicked
    this.element.textContent = this.id + 1;
  }
}

class MessageHandler {
  renderMessage(message) {
    // Render success or failure messages to the DOM
    const messageContainer = document.getElementById("messageContainer");
    const paragraph = document.createElement("p");
    paragraph.innerText = message; // Set the message content
    messageContainer.appendChild(paragraph);
  }
}

// Initialize the game controller when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const gameController = new GameController();
});
