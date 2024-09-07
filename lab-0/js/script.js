class GameController {
  constructor() {
    // Select the Go button and add an event listener
    const goButton = document.getElementById("goButton");
    goButton.addEventListener("click", () => {
      // Get the number of buttons from the input field
      const n = parseInt(document.getElementById("buttonInput").value);
      if (this.validateInput(n)) {
        this.startGame(n);
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
      button.render();
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

  checkUserClickOrder(clickOrder) {
    
  }

  endGame(isSuccess) {
    // Display success or failure message
    const message = isSuccess ? "Excellent memory!" : "Wrong order!";
    const messageHandler = new MessageHandler();
    messageHandler.showMessage(message);
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

  render() {
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
    const randomX = Math.random() * (windowWidth - 100); // Make sure it doesn't leave the window
    const randomY = Math.random() * (windowHeight - 100);
    this.element.style.position = "absolute";
    this.element.style.left = `${randomX}px`;
    this.element.style.top = `${randomY}px`;
    this.element.textContent = ""
  }

  onClick() {
    console.log(`Button ${this.id + 1} clicked`);
    if (this.id === this.gameController.clicksCount) {
        console.log("correct")
        this.gameController.clicksCount += 1
        this.revealButton()

    } else {
        console.log("incorrect")
        this.gameController.endGame(false)
    }


    // Logic for handling button click
  }

  revealButton() {
    this.element.textContent = this.id+1
  }
}

class MessageHandler {
  showMessage(message) {
    alert(message);
  }
}

// Initialize the game controller when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const gameController = new GameController();
});
