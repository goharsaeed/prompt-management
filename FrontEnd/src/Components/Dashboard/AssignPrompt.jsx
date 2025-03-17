import { useState, useEffect } from 'react';
import axios from 'axios';

const AssignPrompt = () => {
  const [prompts, setPrompts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const promptsRes = await axios.get('http://localhost:5000/admin/prompts', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPrompts(promptsRes.data);
      
      const usersRes = await axios.get('http://localhost:5000/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(usersRes.data);
    };
    fetchData();
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    await axios.post(
      'http://localhost:5000/assign-prompt',
      { promptId: selectedPrompt, userId: selectedUser, deadline },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
  };

  return (
    <form onSubmit={handleAssign}>
      <select value={selectedPrompt} onChange={(e) => setSelectedPrompt(e.target.value)} required>
        <option value="">Select Prompt</option>
        {prompts.map((prompt) => (
          <option key={prompt.id} value={prompt.id}>{prompt.title}</option>
        ))}
      </select>
      <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
        <option value="">Select User</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>{user.email}</option>
        ))}
      </select>
      <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
      <button type="submit">Assign Prompt</button>
    </form>
  );
};

export default AssignPrompt;
