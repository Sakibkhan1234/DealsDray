import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EmployeeForm.css'; 

const EmployeeForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [designation, setDesignation] = useState('');
  const [gender, setGender] = useState('');
  const [course, setCourse] = useState('');
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !mobile || !designation || !gender || !course || !image) {
      alert('Please fill in all fields and upload an image.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('mobile', mobile);
    formData.append('designation', designation);
    formData.append('gender', gender);
    formData.append('course', course);
    formData.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/employees', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Employee added successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Error adding employee');
    }
  };

  return (<div>
      <h1>Create Employee</h1>
    <form onSubmit={handleSubmit} className="employee-form">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="employee-input"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="employee-input"
      />
      <input
        type="text"
        placeholder="Mobile"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        className="employee-input"
      />

      <select value={designation} onChange={(e) => setDesignation(e.target.value)} className="employee-select">
        <option value="">Select Designation</option>
        <option value="HR">HR</option>
        <option value="Manager">Manager</option>
        <option value="Sales">Sales</option>
      </select>

      <select value={gender} onChange={(e) => setGender(e.target.value)} className="employee-select">
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <select value={course} onChange={(e) => setCourse(e.target.value)} className="employee-select">
        <option value="">Select Course</option>
        <option value="MCA">MCA</option>
        <option value="BCA">BCA</option>
        <option value="BSC">BSC</option>
      </select>

      <input type="file" onChange={handleImageChange} className="employee-file-input" />
      <button type="submit" className="employee-submit-button">Add Employee</button>
    </form>
    </div>
  );
};

export default EmployeeForm;
