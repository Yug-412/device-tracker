import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Ahome.css'; // Optional: for custom styling
import Anav from './Anav';

function Ahome() {
  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState({
    image: '',
    category: '',
    price: '',
    title: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    floor: '',
    parking: ''
  });
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const apiUrl = 'http://localhost:3000/properties';

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    const res = await axios.get(apiUrl);
    setProperties(res.data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (property = null) => {
    if (property) {
      setFormData(property);
      setEditId(property.id);
    } else {
      setFormData({
        image: '',
        category: '',
        price: '',
        title: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        floor: '',
        parking: ''
      });
      setEditId(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`${apiUrl}/${editId}`, formData);
    } else {
      await axios.post(apiUrl, formData);
    }
    closeModal();
    fetchProperties();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${apiUrl}/${id}`);
    fetchProperties();
  };

  return (
    <>
    <Anav/>
    <div className="container my-4">
      <h2 className="mb-4">Admin Property Dashboard</h2>
      <button className="btn btn-primary mb-3" onClick={() => openModal()}>Add Property</button>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Image</th>
            <th>Category</th>
            <th>Price</th>
            <th>Title</th>
            <th>Bedrooms</th>
            <th>Bathrooms</th>
            <th>Area</th>
            <th>Floor</th>
            <th>Parking</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property.id}>
              <td><img src={property.image} alt="property" width="50" /></td>
              <td>{property.category}</td>
              <td>{property.price}</td>
              <td>{property.title}</td>
              <td>{property.bedrooms}</td>
              <td>{property.bathrooms}</td>
              <td>{property.area}</td>
              <td>{property.floor}</td>
              <td>{property.parking}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => openModal(property)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(property.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">{editId ? 'Edit Property' : 'Add Property'}</h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                  <div className="container-fluid">
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label>Image URL</label>
                        <input name="image" className="form-control" value={formData.image} onChange={handleInputChange} required />
                      </div>
                      <div className="col-md-6">
                        <label>Category</label>
                        <input name="category" className="form-control" value={formData.category} onChange={handleInputChange} required />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label>Price</label>
                        <input name="price" className="form-control" value={formData.price} onChange={handleInputChange} required />
                      </div>
                      <div className="col-md-6">
                        <label>Title</label>
                        <input name="title" className="form-control" value={formData.title} onChange={handleInputChange} required />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label>Bedrooms</label>
                        <input name="bedrooms" className="form-control" value={formData.bedrooms} onChange={handleInputChange} required />
                      </div>
                      <div className="col-md-4">
                        <label>Bathrooms</label>
                        <input name="bathrooms" className="form-control" value={formData.bathrooms} onChange={handleInputChange} required />
                      </div>
                      <div className="col-md-4">
                        <label>Area</label>
                        <input name="area" className="form-control" value={formData.area} onChange={handleInputChange} required />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label>Floor</label>
                        <input name="floor" className="form-control" value={formData.floor} onChange={handleInputChange} required />
                      </div>
                      <div className="col-md-6">
                        <label>Parking</label>
                        <input name="parking" className="form-control" value={formData.parking} onChange={handleInputChange} required />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editId ? 'Update' : 'Add'} Property</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );

}

export default Ahome;
