// AdminReviewSubmissions.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminReview = () => {
  const [submissions, setSubmissions] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/review-submissions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubmissions(response.data);
    };
    fetchSubmissions();
  }, []);

  const handleReview = async (submissionId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/submissions/${submissionId}/review`,
        {
          feedback,
          rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Feedback submitted');
    } catch (error) {
      console.error('Error submitting feedback', error);
    }
  };

  return (
    <div className="admin-review-submissions">
      <h2>Review Submissions</h2>
      {submissions.map((submission) => (
        <div key={submission.id} className="submission">
          <h3>{submission.promptTitle}</h3>
          <p>{submission.status}</p>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="5"
          />
          <textarea
            placeholder="Leave feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <button onClick={() => handleReview(submission.id)}>Submit Feedback</button>
        </div>
      ))}
    </div>
  );
};

export default AdminReview;
