import { useState } from "react";

function NoteItem({ note, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);
  const [editPriority, setEditPriority] = useState(note.priority);

  const handleSave = () => {
    if (!editTitle.trim()) return;
    onUpdate(note.id, { title: editTitle, content: editContent, priority: editPriority });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditPriority(note.priority);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="note-card">
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
          <button className="secondary" onClick={handleSave} disabled={!editTitle.trim()}>
            Save
          </button>
          <button className="secondary" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="note-card">
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
        <button className="secondary" onClick={() => setIsEditing(true)}>
          Edit
        </button>
        <button className="secondary delete" onClick={() => onDelete(note.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default NoteItem;