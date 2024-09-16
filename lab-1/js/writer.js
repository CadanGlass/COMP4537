class NoteController {
  constructor() {
    this.notesList = []; // Array to hold note objects
    this.loadNotesFromStorage(); // Load notes on initialization
    this.startAutoSave(); // Start the auto-save interval
  }

  addNote(id = Date.now(), content = "") {
    const note = new Note(id, content, this);
    this.notesList.push(note);
    return note;
  }

  removeNote(note) {
    // Remove from notesList
    this.notesList = this.notesList.filter((n) => n !== note);
    // Update local storage
    this.storeNotesInStorage();
  }

  storeNotesInStorage() {
    // Serialize notesList and store in localStorage
    const notesData = this.notesList.map((note) => ({
      id: note.id,
      content: note.textarea.value,
    }));
    localStorage.setItem("notesList", JSON.stringify(notesData));
    this.updateStoredDate();
  }

  loadNotesFromStorage() {
    const storedNotes = localStorage.getItem("notesList");
    if (storedNotes) {
      const notesData = JSON.parse(storedNotes);
      notesData.forEach((noteData) => {
        this.addNote(noteData.id, noteData.content);
      });
    }
  }

  updateStoredDate() {
    const storedDateElement = document.getElementById("storedDate");
    const now = new Date();
    storedDateElement.innerText = `Stored at: ${now.toLocaleTimeString()}`;
  }

  startAutoSave() {
    setInterval(() => {
      this.storeNotesInStorage();
    }, 2000); // Save every 2 seconds
  }
}

class Note {
  constructor(id, content, controller) {
    this.id = id;
    this.content = content;
    this.controller = controller;
    this.createElements();
  }

  createElements() {
    const notesContainer = document.getElementById("notesContainer");

    // Create container div
    this.noteDiv = document.createElement("div");
    this.noteDiv.classList.add("note-container");

    // Create textarea
    this.textarea = document.createElement("textarea");
    this.textarea.classList.add("note-textarea");
    this.textarea.value = this.content;

    // Create remove button
    this.removeButton = document.createElement("button");
    this.removeButton.classList.add("remove-button");
    this.removeButton.innerText = "Remove";

    // Append textarea and remove button to noteDiv
    this.noteDiv.appendChild(this.textarea);
    this.noteDiv.appendChild(this.removeButton);

    // Append noteDiv to notesContainer
    notesContainer.appendChild(this.noteDiv);

    // Event listener for remove button
    this.removeButton.addEventListener("click", () => {
      this.noteDiv.remove(); // Remove from DOM
      this.controller.removeNote(this); // Remove from controller and storage
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const noteController = new NoteController();

  // Add note button
  const addButton = document.getElementById("addButton");
  addButton.addEventListener("click", () => {
    noteController.addNote();
  });
});
