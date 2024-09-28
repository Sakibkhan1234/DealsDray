import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    gender: '',
    course: '',
    image: null
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetching employee data
    const fetchEmployees = async () => {
      const response = await axios.get('http://localhost:5000/employees');
      setEmployees(response.data);
      console.log(response.data)
    };

    fetchEmployees();

      const storedName = localStorage.getItem('users');

      setUserName(storedName || '');
      console.log(storedName);
    
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`http://localhost:5000/api/employees/${id}`);
        setEmployees(employees.filter(emp => emp._id !== id));
        alert('Employee deleted successfully!');
      } catch (error) {
        console.error(error);
        alert('Error deleting employee');
      }
    }
  };

  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setFormData({
      name: emp.name,
      email: emp.email,
      mobile: emp.mobile,
      designation: emp.designation,
      gender: emp.gender,
      course: emp.course,
      image: null 
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    for (const key in formData) {
      formDataToSubmit.append(key, formData[key]);
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/employees/${editingEmployee._id}`, formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setEmployees(employees.map(emp => emp._id === editingEmployee._id ? response.data : emp));
      alert('Employee updated successfully!');
      setEditingEmployee(null);
    } catch (error) {
      console.error(error);
      alert('Error updating employee');
    }
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <div>
      <h1>Employee Dashboard</h1>
      <h3>Welcome,{userName} !</h3>

      {/* Logout Button */}
      <button className='btn-edit' onClick={handleLogout}>Logout</button>

      {/* Create Employee Button */}
      <Link to="/create">
        <button className='btn-create'>Create Employee</button>
      </Link>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Total Employees Count */}
      <h2>Total Employees: {filteredEmployees.length}</h2>

      {/* Edit Form */}
      {editingEmployee && (
        <form onSubmit={handleUpdate}>
          <h2>Edit Employee</h2>
          <input
            type="text"
            placeholder="Name"
            className='input-edit'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className='input-edit'
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Mobile"
            className='input-edit'
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            required
          />
          <select
            value={formData.designation}
            className='input-edit'
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            required
          >
            <option value="">Select Designation</option>
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
          <select
            value={formData.gender}
            className='input-edit'
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <select
            value={formData.course}
            className='input-edit'
            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
            required
          >
            <option value="">Select Course</option>
            <option value="MCA">MCA</option>
            <option value="BCA">BCA</option>
            <option value="BSC">BSC</option>
          </select>
          <input
            type="file"
            className='input-edit'
            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
          />
          <button type="submit" className='btn-edit'>Update Employee</button>
          <button type="button" className='btn-edit' onClick={() => setEditingEmployee(null)}>Cancel</button>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Designation</th>
            <th>Gender</th>
            <th>Course</th>
            <th>Create Date</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((emp, index) => (
            <tr key={emp._id}>
              <td>{index + 1}</td>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.mobile}</td>
              <td>{emp.designation}</td>
              <td>{emp.gender}</td>
              <td>{emp.course}</td>
              <td>{new Date(emp.createDate).toLocaleDateString()}</td>
              <td>
                {emp.image && (
                  <img src={`http://localhost:5000/uploads/${emp.image}`} alt={emp.name} width="50" />
                )}
              </td>
              <td>
                <button className='btn-col' onClick={() => handleEdit(emp)}>Edit</button>
                <button className='btn-col' onClick={() => handleDelete(emp._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;

