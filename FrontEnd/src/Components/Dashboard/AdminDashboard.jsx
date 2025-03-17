import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // const [deadline, setDeadline] = useState('');
  const [assignedUser, setAssignedUser] = useState('');
  // const [file, setFile] = useState(null);

  const navigate = useNavigate()

  useEffect(() => {
    // Fetch all users
    const fetchUsers = async () => {
      const response = await axios.get('http://localhost:5000/users');
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem('token');
    await axios.post(
      'http://localhost:5000/prompts', 
      { 
        title, 
        description, 
        assignedUser // Send the assigned user ID as part of the request body
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Use 'application/json' instead of 'multipart/form-data' unless uploading files
        },
      }
    );
  } catch (error) {
    console.error('Error creating prompt', error);
  }
};


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Create Prompt
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
  <div>
    <label className="block text-lg font-medium text-gray-700" htmlFor="title">
      Title
    </label>
    <input
      type="text"
      id="title"
      placeholder="Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      required
      className="mt-2 px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>

  <div>
    <label className="block text-lg font-medium text-gray-700" htmlFor="description">
      Description
    </label>
    <textarea
      id="description"
      placeholder="Description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      required
      rows="4"
      className="mt-2 px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>

  <div>
    <label className="block text-lg font-medium text-gray-700" htmlFor="assignedUser">
      Assign User
    </label>
    <select
      id="assignedUser"
      value={assignedUser}
      onChange={(e) => setAssignedUser(e.target.value)}
      required
      className="mt-2 px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <option value="">Select User</option>
      {users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.email}
        </option>
      ))}
    </select>
  </div>

  {/* <div>
    <label className="block text-lg font-medium text-gray-700" htmlFor="file">
      Attach File
    </label>
    <input
      type="file"
      id="file"
      onChange={(e) => setFile(e.target.files[0])}
      className="mt-2 w-full text-sm text-gray-600 file:py-2 file:px-4 file:mr-4 file:rounded-lg file:border-0 file:text-white file:bg-indigo-600 hover:file:bg-indigo-700"
    />
  </div> */}

  <div className="flex items-center justify-between">
    <button
      type="submit"
      className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200"
      onClick={() => {
    navigate('/admin-review-submissions')
        
      }}
    >
      Create Prompt
    </button>
  </div>
</form>


        <div className="mt-6 text-center">
          <Link to="/admin-review-submissions" className="text-indigo-600 hover:underline">
            Review Submissions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
