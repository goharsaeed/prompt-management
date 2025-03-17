import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [prompts, setPrompts] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPrompts(response.data);
      } catch (err) {
        setError('Failed to fetch prompts. Please try again later.');
        console.error('Error fetching prompts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrompts();
  }, []);

  const handleStatusChange = (promptId, value) => {
    setStatuses((prev) => ({
      ...prev,
      [promptId]: value,
    }));
  };

  const handleFileChange = (promptId, file) => {
    setFiles((prev) => ({
      ...prev,
      [promptId]: file,
    }));
  };

  const handleSubmit = async (promptId) => {
    const formData = new FormData();
    formData.append('status', statuses[promptId] || '');
    formData.append('file', files[promptId] || null);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/prompts/${promptId}/submit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      alert('Submission successful!');
    } catch (error) {
      console.error('Error submitting prompt', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          My Assigned Prompts
        </h2>

        {loading ? (
          <div className="text-center text-lg text-gray-500">Loading prompts...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : prompts.length === 0 ? (
          <div className="text-center text-lg text-gray-500">No prompts available. Please check back later!</div>
        ) : (
          <div className="space-y-8">
            {prompts.map((prompt) => (
              <div
                key={prompt.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-700">{prompt.title}</h3>
                <p className="text-gray-600 mb-2">{prompt.description}</p>
                <p className="text-sm text-gray-500">Deadline: {new Date().toLocaleDateString()}</p>
                <div className="space-y-4 mt-4">
                  <textarea
                    placeholder="Provide status update or blockers"
                    value={statuses[prompt.id] || ''}
                    onChange={(e) => handleStatusChange(prompt.id, e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  <input
                    type="file"
                    onChange={(e) => handleFileChange(prompt.id, e.target.files[0])}
                    className="block w-full text-sm text-gray-700 file:py-2 file:px-4 file:border-0 file:text-white file:bg-indigo-600 hover:file:bg-indigo-700 file:rounded-md"
                  />

                  <button
                    onClick={() => handleSubmit(prompt.id)}
                    className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200"
                  >
                    Submit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
