import { useState } from "react";

function NoteForm({ onAddNote }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("low");

  const handleAdd = () => {
    if (!title.trim()) return;
    onAddNote({ title, content, priority });
    setTitle("");
    setContent("");
    setPriority("low");
  };

  return (
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
        <button className="primary" onClick={handleAdd} disabled={!title.trim()}>
          Add note
        </button>
      </div>
    </div>
  );
}

export default NoteForm;