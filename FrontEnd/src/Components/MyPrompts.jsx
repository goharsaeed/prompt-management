import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyPrompt = () => {
  const [prompts, setPrompts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPrompts(response.data);
      } catch (err) {
        console.log(err)
        setError('Failed to fetch prompts');
      }
    };
    fetchPrompts();
  }, []);

  const handleSubmission = async (promptId) => {
    navigate(`/submit/${promptId}`);
  };

  return (
    <div className="myprompts">
      <h2>My Assigned Prompts</h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {prompts.map((prompt) => (
          <li key={prompt.id}>
            <h3>{prompt.title}</h3>
            <p>{prompt.description}</p>
            <button onClick={() => handleSubmission(prompt.id)}>Submit Work</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyPrompt;
