// reader.js

// This code was developed with assistance from ChatGPT for explanations and guidance on structure.
// Used for Lab/Assignment purposes, as per guidelines.

// The NoteReader class handles loading and displaying notes from localStorage.
class NoteReader {
  constructor() {
    this.notesList = []; // Array to hold note data
    this.loadNotesFromStorage(); // Load notes on initialization
    this.startAutoRetrieve(); // Start auto-retrieval every 2 seconds
  }

  // Method to load notes from localStorage
  loadNotesFromStorage() {
    const storedNotes = localStorage.getItem("notesList"); // Retrieve stored notes
    if (storedNotes) {
      this.notesList = JSON.parse(storedNotes); // Parse JSON string to object
      this.renderNotes(); // Display the notes
      this.updateRetrievedDate(); // Update the "Retrieved at" timestamp
    } else {
      this.notesList = []; // No notes found, clear the list
      this.renderNotes(); // Display message indicating no notes are available
    }
  }

  // Method to render notes on the page
  renderNotes() {
    const notesContainer = document.getElementById("notesContainer");
    notesContainer.innerHTML = ""; // Clear existing notes

    if (this.notesList.length === 0) {
      notesContainer.innerText = "No notes available."; // Display message if no notes
      return;
    }

    // Loop through each note and display it
    this.notesList.forEach((noteData) => {
      // Create a container div for the note
      const noteDiv = document.createElement("div");
      noteDiv.classList.add("note-container");

      // Create a read-only textarea to display the note content
      const textarea = document.createElement("textarea");
      textarea.classList.add("note-textarea");
      textarea.value = noteData.content;
      textarea.readOnly = true; // Make textarea read-only

      // Append textarea to the note container
      noteDiv.appendChild(textarea);

      // Append the note container to the notes container in the DOM
      notesContainer.appendChild(noteDiv);
    });
  }

  // Method to update the "Retrieved at" timestamp
  updateRetrievedDate() {
    const retrievedDateElement = document.getElementById("retrievedDate");
    const now = new Date();
    retrievedDateElement.innerText = `Retrieved at: ${now.toLocaleTimeString()}`; // Display current time
  }

  // Method to start auto-retrieving notes every 2 seconds
  startAutoRetrieve() {
    setInterval(() => {
      this.loadNotesFromStorage(); // Load notes from localStorage
    }, 2000); // 2000 milliseconds = 2 seconds
  }
}

// Wait for the DOM content to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
  const noteReader = new NoteReader(); // Initialize the NoteReader
});
