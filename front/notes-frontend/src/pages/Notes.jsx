import { useEffect, useState } from "react";
import axios from "axios";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("low");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editPriority, setEditPriority] = useState("low");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === "all" || note.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
  }

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    window.clearTimeout(showMessage.timeout);
    showMessage.timeout = window.setTimeout(() => setMessage(""), 4500);
  };

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
      if (err.response) {
        if (err.response.status === 401) {
          showMessage("Session expirée. Veuillez vous reconnecter.", "error");
          logout();
          return;
        }
        if (err.response.status === 404) {
          showMessage("API notes introuvable.", "error");
          return;
        }
      }
      console.error(err);
      showMessage("Impossible de charger les notes.", "error");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // ➕ ADD NOTE
  const addNote = async () => {
    if (!title.trim()) {
      showMessage("Le titre est requis.", "error");
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
      showMessage("Note added successfully.", "success");
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          showMessage("Non autorisé. Veuillez vous reconnecter.", "error");
          logout();
          return;
        }
        if (err.response.status === 422) {
          const errors = err.response.data?.errors;
          const errorMessage = errors ? Object.values(errors).flat()[0] : "Données invalides.";
          showMessage(errorMessage, "error");
          return;
        }
        if (err.response.status === 404) {
          showMessage("Point de terminaison introuvable.", "error");
          return;
        }
      }
      console.error(err);
      showMessage("Erreur lors de l'ajout de la note.", "error");
    }
  };

  // ✏️ UPDATE NOTE
  const updateNote = async (id, newTitle, newContent, newPriority) => {
    if (!newTitle.trim()) {
      showMessage("Le titre est requis pour la mise à jour.", "error");
      return;
    }
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/notes/${id}`,
        { title: newTitle, content: newContent, priority: newPriority },
        authHeaders
      );
      fetchNotes();
      setEditingId(null);
      showMessage("Note mise à jour avec succès.", "success");
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          showMessage("Non autorisé. Veuillez vous reconnecter.", "error");
          logout();
          return;
        }
        if (err.response.status === 422) {
          const errors = err.response.data?.errors;
          const errorMessage = errors ? Object.values(errors).flat()[0] : "Données invalides.";
          showMessage(errorMessage, "error");
          return;
        }
        if (err.response.status === 404) {
          showMessage("Note introuvable.", "error");
          return;
        }
      }
      console.error(err);
      showMessage("Erreur lors de la mise à jour de la note.", "error");
    }
  };

  // ❌ DELETE NOTE
  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/notes/${id}`, authHeaders); // ✅ already had it
      fetchNotes();
      showMessage("Note supprimée.", "success");
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          showMessage("Non autorisé. Veuillez vous reconnecter.", "error");
          logout();
          return;
        }
        if (err.response.status === 404) {
          showMessage("Note introuvable.", "error");
          fetchNotes();
          return;
        }
      }
      console.error(err);
      showMessage("Erreur lors de la suppression.", "error");
    }
  };

  // � EXPORT NOTES
  const exportNotes = () => {
    if (!notes.length) {
      showMessage("Aucune note à exporter.", "error");
      return;
    }

    const dataStr = JSON.stringify(notes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const exportFileDefaultName = 'notes.json';

    const linkElement = document.createElement('a');
    linkElement.href = url;
    linkElement.download = exportFileDefaultName;
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    URL.revokeObjectURL(url);

    showMessage("Export réussi.", "success");
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
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
          <span className="welcome-text">Welcome {userName}!</span>
          <span className="note-count">{filteredNotes.length} note{filteredNotes.length === 1 ? "" : "s"}</span>
          <button className="logout-button" onClick={logout}>Logout</button>
        </div>
      </div>

      {message && (
        <div className={`toast ${messageType}`}>
          {message}
        </div>
      )}

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
          <button className="primary" onClick={addNote} disabled={!title.trim()}>Add note</button>
        </div>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="filter-select"
        >
          <option value="all">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button className="secondary" onClick={exportNotes}>Export Notes</button>
      </div>

      {filteredNotes.length > 0 ? (
        <div className="notes-grid">
          {filteredNotes.map((note) => (
            editingId === note.id ? (
              <div className="note-card" key={note.id}>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Title"
                  className="edit-input"
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Content"
                  className="edit-textarea"
                />
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  className="edit-select"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <div className="note-card-footer">
                  <button className="secondary" onClick={() => updateNote(editingId, editTitle, editContent, editPriority)} disabled={!editTitle.trim()}>Save</button>
                  <button className="secondary" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
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
                  <button className="secondary" onClick={() => {
                    setEditingId(note.id);
                    setEditTitle(note.title);
                    setEditContent(note.content);
                    setEditPriority(note.priority);
                  }}>Edit</button>
                  <button className="secondary delete" onClick={() => deleteNote(note.id)}>Delete</button>
                </div>
              </div>
            )
          ))}
        </div>
      ) : (
        <div className="empty-state">No notes yet — add one to get started.</div>
      )}
    </div>
  );
}

export default Notes;