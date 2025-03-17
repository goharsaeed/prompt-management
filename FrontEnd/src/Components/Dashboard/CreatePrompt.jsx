import { useState } from 'react';
import axios from 'axios';

const CreatePrompt = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/prompts', { title, description }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
      <button type="submit">Create Prompt</button>
    </form>
  );
};

export default CreatePrompt;
