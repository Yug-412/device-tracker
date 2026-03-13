import React, { useEffect, useState } from 'react';
import Head from './coman/Head';
import Navbar from './coman/Navbar';
import Footer from './coman/Footer';
import axios from 'axios';

function Properties() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/properties')
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <Head />
      <Navbar />
      <div className="page-heading header-text">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <span className="breadcrumb"><a href="/">Home</a> / Properties</span>
              <h3>Properties</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="section properties">
        <div className="container">
          <div className="row properties-box">
            {data.map((item) => (
              <div key={item.id} className="col-lg-4 col-md-6 align-self-center mb-30">
                <div className="item">
                  <a href="property-details.html">
                    <img src={item.image} alt="" />
                  </a>
                  <span className="category">{item.category}</span>
                  <h6>{item.price}</h6>
                  <h4><a href="property-details.html">{item.title}</a></h4>
                  <ul>
                    <li>Bedrooms: <span>{item.bedrooms}</span></li>
                    <li>Bathrooms: <span>{item.bathrooms}</span></li>
                    <li>Area: <span>{item.area}</span></li>
                    <li>Floor: <span>{item.floor}</span></li>
                    <li>Parking: <span>{item.parking}</span></li>
                  </ul>
                  <div className="main-button">
                    <a href="property-details.html">Schedule a visit</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Properties;
