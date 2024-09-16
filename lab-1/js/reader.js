class NoteReader {
  constructor() {
    this.notesList = []; // Array to hold note data
    this.loadNotesFromStorage(); // Load notes on initialization
    this.startAutoRetrieve(); // Start auto-retrieval every 2 seconds
  }

  loadNotesFromStorage() {
    const storedNotes = localStorage.getItem("notesList");
    if (storedNotes) {
      this.notesList = JSON.parse(storedNotes);
      this.renderNotes();
      this.updateRetrievedDate();
    } else {
      this.notesList = [];
      this.renderNotes(); // Clear notes if none are found
    }
  }

  renderNotes() {
    const notesContainer = document.getElementById("notesContainer");
    notesContainer.innerHTML = ""; // Clear existing notes

    if (this.notesList.length === 0) {
      notesContainer.innerText = "No notes available.";
      return;
    }

    this.notesList.forEach((noteData) => {
      // Create a div for each note
      const noteDiv = document.createElement("div");
      noteDiv.classList.add("note-container");

      // Create a textarea (read-only)
      const textarea = document.createElement("textarea");
      textarea.classList.add("note-textarea");
      textarea.value = noteData.content;
      textarea.readOnly = true; // Make the textarea read-only

      // Append textarea to noteDiv
      noteDiv.appendChild(textarea);

      // Append noteDiv to notesContainer
      notesContainer.appendChild(noteDiv);
    });
  }

  updateRetrievedDate() {
    const retrievedDateElement = document.getElementById("retrievedDate");
    const now = new Date();
    retrievedDateElement.innerText = `Retrieved at: ${now.toLocaleTimeString()}`;
  }

  startAutoRetrieve() {
    setInterval(() => {
      this.loadNotesFromStorage();
    }, 2000); // Retrieve every 2 seconds
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const noteReader = new NoteReader();
});
