import React, { useState } from 'react'
import Anav from './Anav'
import axios from 'axios'
import { useEffect } from 'react'
import './Anav.css'; // Custom styles here

function Inquiry() {


    useEffect(() => {
        inquirydata();
    }, [])
    const [data, setdata] = useState([])

    const inquirydata = async () => {
        const res = await axios.get("http://localhost:3000/contacts")
        setdata(res.data)
   
    }
     const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/contacts/${id}`);
      setdata(data.filter(item => item.id !== id)); // Remove deleted item from state
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

    return (
       
            <div>
                <Anav />
                <div className="inquiry-container">
                    <h2>Inquiry Data</h2>
                    {
                        <table className="inquiry-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Message</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.email}</td>
                                        <td>{item.message}</td>
                                        <td>
                                            <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                </div>
            </div>
    )
}

export default Inquiry
