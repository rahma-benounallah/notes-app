import NoteItem from "./NoteItem";

function NoteList({ notes, onUpdate, onDelete }) {
  if (notes.length === 0) {
    return <div className="empty-state">No notes yet — add one to get started.</div>;
  }

  return (
    <div className="notes-grid">
      {notes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default NoteList;