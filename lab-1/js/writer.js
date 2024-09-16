// writer.js

// This code was developed with assistance from ChatGPT for explanations and guidance on structure.
// Used for Lab/Assignment purposes, as per guidelines.

// The NoteController class manages the collection of notes and handles saving/loading from localStorage.
class NoteController {
  constructor() {
    this.notesList = []; // Array to hold Note objects
    this.loadNotesFromStorage(); // Load existing notes from localStorage on initialization
    this.startAutoSave(); // Start the auto-save interval to save notes every 2 seconds
  }

  // Method to add a new note
  addNote(id = Date.now(), content = "") {
    const note = new Note(id, content, this); // Create a new Note instance
    this.notesList.push(note); // Add the new note to the notesList array
    return note;
  }

  // Method to remove a note
  removeNote(note) {
    // Remove the note from the notesList array
    this.notesList = this.notesList.filter((n) => n !== note);
    // Update localStorage after removal
    this.storeNotesInStorage();
  }

  // Method to store notes in localStorage
  storeNotesInStorage() {
    // Map notesList to an array of note data objects
    const notesData = this.notesList.map((note) => ({
      id: note.id,
      content: note.textarea.value, // Get the current content from the textarea
    }));
    // Serialize notesData to a JSON string and store it in localStorage
    localStorage.setItem("notesList", JSON.stringify(notesData));
    this.updateStoredDate(); // Update the "Stored at" timestamp
  }

  // Method to load notes from localStorage
  loadNotesFromStorage() {
    const storedNotes = localStorage.getItem("notesList"); // Retrieve stored notes
    if (storedNotes) {
      const notesData = JSON.parse(storedNotes); // Parse JSON string to object
      notesData.forEach((noteData) => {
        this.addNote(noteData.id, noteData.content); // Recreate each note
      });
    }
  }

  // Method to update the "Stored at" timestamp
  updateStoredDate() {
    const storedDateElement = document.getElementById("storedDate");
    const now = new Date();
    storedDateElement.innerText = `Stored at: ${now.toLocaleTimeString()}`; // Display current time
  }

  // Method to start auto-saving notes every 2 seconds
  startAutoSave() {
    setInterval(() => {
      this.storeNotesInStorage(); // Save notes to localStorage
    }, 2000); // 2000 milliseconds = 2 seconds
  }
}

// The Note class represents a single note and handles its creation and deletion.
class Note {
  constructor(id, content, controller) {
    this.id = id; // Unique identifier for the note
    this.content = content; // Initial content of the note
    this.controller = controller; // Reference to the NoteController instance
    this.createElements(); // Create DOM elements for the note
  }

  // Method to create DOM elements for the note
  createElements() {
    const notesContainer = document.getElementById("notesContainer");

    // Create a container div for the note
    this.noteDiv = document.createElement("div");
    this.noteDiv.classList.add("note-container");

    // Create a textarea for the note content
    this.textarea = document.createElement("textarea");
    this.textarea.classList.add("note-textarea");
    this.textarea.value = this.content; // Set initial content

    // Create a remove button for the note
    this.removeButton = document.createElement("button");
    this.removeButton.classList.add("remove-button");
    this.removeButton.innerText = "Remove";

    // Append textarea and remove button to the note container
    this.noteDiv.appendChild(this.textarea);
    this.noteDiv.appendChild(this.removeButton);

    // Append the note container to the notes container in the DOM
    notesContainer.appendChild(this.noteDiv);

    // Event listener for the remove button
    this.removeButton.addEventListener("click", () => {
      this.noteDiv.remove(); // Remove note from DOM
      this.controller.removeNote(this); // Remove note from notesList and update storage
    });
  }
}

// Wait for the DOM content to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
  const noteController = new NoteController(); // Initialize the NoteController

  // Get the "Add Note" button from the DOM
  const addButton = document.getElementById("addButton");

  // Event listener for the "Add Note" button
  addButton.addEventListener("click", () => {
    noteController.addNote(); // Add a new note
  });
});
