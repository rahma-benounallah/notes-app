import { useEffect, useState } from "react";
import axios from "axios";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("low");

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
  }

  // ✅ Shared headers
  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // 📥 GET NOTES
  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/notes", authHeaders); // ✅ added
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // ➕ ADD NOTE
  const addNote = async () => {
    if (!title.trim()) {
      alert("Title is required!");
      return;
    }
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/notes",
        { title, content, priority },
        authHeaders // ✅ added
      );

      setTitle("");
      setContent("");
      fetchNotes();
    } catch (err) {
      console.error(err);
      alert("Erreur ajout !");
    }
  };

  // ✏️ UPDATE NOTE
  const updateNote = async (id) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/notes/${id}`,
        { title: "Updated title", content: "Updated content", priority: "medium" },
        authHeaders // ✅ already had it
      );
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  // ❌ DELETE NOTE
  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/notes/${id}`, authHeaders); // ✅ already had it
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>📝 Notes App</h1>
          <p className="subtitle">Store your ideas, tasks, and reminders in one place.</p>
        </div>
        <div className="header-actions">
          <span className="note-count">{notes.length} note{notes.length === 1 ? "" : "s"}</span>
          <button className="logout-button" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="form">
        <input
          value={title}
          placeholder="Note title"
          maxLength="100"
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          value={content}
          placeholder="Write your note here... (optional)"
          rows={4}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="form-side">
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </select>
          <button className="primary" onClick={addNote}>Add note</button>
        </div>
      </div>

      {notes.length > 0 ? (
        <div className="notes-grid">
          {notes.map((note) => (
            <div className="note-card" key={note.id}>
              <div className="note-card-header">
                <h3>{note.title}</h3>
                <span className={`priority-badge priority-${note.priority}`}>{note.priority}</span>
              </div>
              <p>{note.content}</p>
              <div className="note-date">
                {new Date(note.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="note-card-footer">
                <button className="secondary" onClick={() => updateNote(note.id)}>Update</button>
                <button className="secondary delete" onClick={() => deleteNote(note.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">No notes yet — add one to get started.</div>
      )}
    </div>
  );
}

export default Notes;