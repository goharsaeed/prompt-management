import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminReviewSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState('');

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/admin/prompts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmissions(response.data);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to load submissions');
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Admin Review Submissions</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="space-y-4">
          {submissions.length > 0 ? (
            submissions.map((submission) => (
              <div key={submission.id} className="p-4 border border-gray-300 rounded-lg">
                <h3 className="text-xl font-semibold">{submission.title}</h3>
                <p className="text-gray-700 mt-2">{submission.description}</p>
                <p className="text-gray-500 text-sm mt-2">Created By: {submission.createdBy}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No submissions found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReviewSubmissions;
