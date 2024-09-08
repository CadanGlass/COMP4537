class GameController {
  constructor() {
    // Select the Go button and add an event listener
    const goButton = document.getElementById("goButton");
    goButton.addEventListener("click", () => {
      // Get the number of buttons from the input field
      this.n = parseInt(document.getElementById("buttonInput").value); // Store n in the class instance
      if (this.validateInput(this.n)) {
        this.resetGame()
        this.startGame(this.n);
      } else {
        alert("Please enter a valid number between 3 and 7");
      }
    });

    this.clicksCount = 0;
  }
  validateInput(n) {
    return n >= 3 && n <= 7;
  }

  startGame(n) {
    console.log(`Starting game with ${n} buttons`);

    // Create buttons and set up the game
    this.buttons = [];
    for (let i = 0; i < n; i++) {
      const button = new Button(i, this.getRandomColor(), { x: 0, y: 0 }, this);
      button.renderButton();
      this.buttons.push(button);
    }

    // Scramble buttons after n seconds
    setTimeout(() => this.scrambleButtons(), n * 1000);
  }

  scrambleButtons() {
    console.log("Scrambling buttons...");
    this.buttons.forEach((button) => {
      button.moveRandomly();
    });
  }

  checkUserClickOrder(clickOrder) {}

  endGame(isSuccess) {
    // Display success or failure message
    const successMessage = isSuccess ? "Excellent memory!" : "Wrong order!";
    const messageHandler = new MessageHandler();

    // Render the success message
    messageHandler.renderMessage(successMessage);

    // Create an element to display the countdown
    const messageContainer = document.getElementById("messageContainer");
    const countdownElement = document.createElement("p");
    messageContainer.appendChild(countdownElement);

    const resetMessage = "Resetting game in ";
    let timeLeft = 5;

    // Start the countdown
    const countdown = setInterval(() => {
      if (timeLeft > 0) {
        countdownElement.innerText = `${resetMessage} ${timeLeft} seconds`;
        timeLeft--;
      } else {
        countdownElement.innerText = "Resetting now...";
        clearInterval(countdown); // Stop the countdown

        this.resetGame();
      }
    }, 1000); // Update every second (1000 ms)
  }

  resetGame() {
    console.log("Resetting the game...");

    // Clear the buttons container
    const buttonContainer = document.getElementById("buttonContainer");
    buttonContainer.innerHTML = ""; // Remove all buttons

    // Clear the message container
    const messageContainer = document.getElementById("messageContainer");
    messageContainer.innerHTML = ""; // Remove all messages

    // Reset game state variables
    this.clicksCount = 0; // Reset the click counter
    this.buttons = []; // Clear the buttons array

    
  }

  getRandomColor() {
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
    this.gameController = gameController;
  }

  renderButton() {
    const buttonContainer = document.getElementById("buttonContainer");
    const btn = document.createElement("button");
    btn.style.backgroundColor = this.color;
    btn.style.height = "5em";
    btn.style.width = "10em";
    btn.style.margin = "1em 1em"; // 1em space between buttons vertically and horizontally
    btn.textContent = this.id + 1;
    btn.addEventListener("click", () => this.onClick());
    buttonContainer.appendChild(btn);
    this.element = btn;
  }

  moveRandomly() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Get the boundaries of the container that holds the input fields
    const container = document.querySelector(".container");
    if (!container) {
      console.error("Container not found!");
      return;
    }

    const containerRect = container.getBoundingClientRect();

    // Calculate the maximum allowed position (75% of window dimensions)
    const maxX = windowWidth * 0.75 - 100; // Subtract 100 to ensure the button doesn't leave the screen
    const maxY = windowHeight * 0.75 - 100;

    let randomX, randomY;

    // Keep generating random positions until it's outside the container area
    do {
      randomX = Math.random() * maxX;
      randomY = Math.random() * maxY;
    } while (
      randomX > containerRect.left &&
      randomX < containerRect.right &&
      randomY > containerRect.top &&
      randomY < containerRect.bottom
    );

    // Set the button's position
    this.element.style.position = "absolute";
    this.element.style.left = `${randomX}px`;
    this.element.style.top = `${randomY}px`;
    this.element.textContent = "";
  }

  onClick() {
    console.log(`Button ${this.id + 1} clicked`);
    if (this.id === this.gameController.clicksCount) {
      console.log("correct");
      this.gameController.clicksCount += 1;
      this.revealButton();

      console.log(this.gameController.n, "n");

      if (this.id + 1 == this.gameController.n) {
        this.gameController.endGame(true);
      }
    } else {
      console.log("incorrect");
      this.gameController.endGame(false);
    }

    // Logic for handling button click
  }

  revealButton() {
    this.element.textContent = this.id + 1;
  }
}

class MessageHandler {
  renderMessage(message) {
    const messageContainer = document.getElementById("messageContainer");
    const paragraph = document.createElement("p");
    paragraph.innerText = message; // Use the message passed into the method
    messageContainer.appendChild(paragraph);

    console.log(message, "message");
  }
}

// Initialize the game controller when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const gameController = new GameController();
});
