import Sidebar from '../components/Sidebar';
import { useState, useEffect } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from '../api/notes';
import { useAuth } from '../utils/useAuth';
import Navbar from '../components/Navbar';

export default function NotepadPage() {
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', content: '' });

  useEffect(() => {
    getNotes(token).then(res => setNotes(res.data || []));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await updateNote(token, editing._id, form);
    } else {
      await createNote(token, form);
    }
    setForm({ title: '', content: '' });
    setEditing(null);
    getNotes(token).then(res => setNotes(res.data || []));
  };

  const handleEdit = (note) => {
    setEditing(note);
    setForm({ title: note.title, content: note.content });
  };

  const handleDelete = async (id) => {
    await deleteNote(token, id);
    getNotes(token).then(res => setNotes(res.data || []));
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({ title: '', content: '' });
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <main className="container-fluid">
       <Navbar/>
         <div className="" style={{padding:"14px"}}>
        <h2>Notepad</h2>
        <form className="card p-3 mb-4" onSubmit={handleSubmit}>
          <input
            className="form-control mb-2"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            className="form-control mb-2"
            rows={5}
            placeholder="Write your note..."
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            required
          />
          <button className="btn me-2"  style={{backgroundColor:'var(--color-primary)',color:'white'}} type="submit">
            {editing ? 'Update Note' : 'Add Note'}
          </button>
          {editing && (
            <button className="btn btn-secondary" type="button" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </form>
        <div>
          {notes.map(note => (
            <div key={note._id} className="card mb-2">
              <div className="card-body">
                <h5 className="card-title">{note.title}</h5>
                <p className="card-text">{note.content}</p>
                <button className="btn btn-sm  me-2"  style={{backgroundColor:'var(--color-primary)',color:'white'}} onClick={() => handleEdit(note)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(note._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
        </div>
      </main>
    </div>
  );
}
