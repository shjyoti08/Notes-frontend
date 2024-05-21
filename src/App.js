import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [editNote, setEditNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notes');
      // Reverse the order of notes so that the most recent one appears first
      setNotes(res.data.reverse());
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editNote) {
        const res = await axios.put(`http://localhost:5000/api/notes/${editNote._id}`, {
          title,
          text
        });
        const updatedNoteIndex = notes.findIndex(note => note._id === editNote._id);
        const updatedNotes = [...notes];
        updatedNotes[updatedNoteIndex] = res.data;
        setNotes(updatedNotes);
        setEditNote(null);
      } else {
        const res = await axios.post('http://localhost:5000/api/notes', {
          title,
          text
        });
        setNotes([res.data, ...notes]); // Add the new note to the beginning of the array
      }
      setTitle('');
      setText('');
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (note) => {
    console.log(note);
    setEditNote(note);
    setTitle(note.title);
    setText(note.text);
  };

  const handleDelete = async (id) => {
    console.log(id);
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`);
      setNotes(notes.filter(note => note._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Notes App</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Text"></textarea>
        <button type="submit">{editNote ? 'Update Note' : 'Add Note'}</button>
      </form>
      {notes.map(note => (
        <div key={note._id}>
          <h3>{note.title}</h3>
          <p>{note.text}</p>
          <button onClick={() => handleEdit(note)}>Edit</button>
          <button onClick={() => handleDelete(note._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;