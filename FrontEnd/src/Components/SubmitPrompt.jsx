import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory

const SubmitPrompt = () => {
  const { promptId } = useParams();
  const navigate = useNavigate(); // Replacing useHistory with useNavigate
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to submit a prompt.');
      return;
    }

    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('link', link);
    formData.append('promptId', promptId);

    try {
      const response = await axios.post('http://localhost:5000/submit-prompt', formData, {
        
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Submission successful!');
      setTimeout(() => navigate('/my-prompts'), 2000); // Use navigate instead of history.push
      console.log(response)
    } catch (err) {
      console.log(err)
      setError('Failed to submit prompt. Please try again.');
    }
  };

  return (
    <div className="submit-prompt">
      <h2>Submit Your Work</h2>
      <form onSubmit={handleSubmit}>
        <label>Upload File:</label>
        <input type="file" onChange={handleFileChange} />
        <label>Or provide a link:</label>
        <input type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Enter link to your work" />
        <button type="submit">Submit</button>
      </form>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default SubmitPrompt;
