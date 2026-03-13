import React, { useEffect, useState } from 'react'
import Footer from './coman/Footer'
import Head from './coman/Head'
import Navbar from './coman/Navbar'
import axios from 'axios';

function Properties_detail() {


    const [properties, setProperties] = useState([]);
    const [activeTab, setActiveTab] = useState("Apartment");

    useEffect(() => {
        axios.get("http://localhost:3000/properties_detail")
            .then(response => setProperties(response.data))
            .catch(err => console.error("Error loading properties:", err));
    }, []);

    const categories = ["Apartment", "Villa", "Penthouse"];
    const filteredProperty = properties.find(prop => prop.category === activeTab);
    return (
        <div>
            <Head />
            <Navbar />
            <div>


                <div className="page-heading header-text">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <span className="breadcrumb"><a href="/">Home</a>  /  Single Property</span>
                                <h3>Single Property</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="single-property section">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="main-image">
                                    <img src="assets/images/single-property.jpg" alt />
                                </div>
                                <div className="main-content">
                                    <span className="category">Apparment</span>
                                    <h4>24 New Street Miami, OR 24560</h4>
                                    <p>Get <strong>the best villa agency</strong> HTML CSS Bootstrap Template for your company website. TemplateMo provides you the <a href="https://www.google.com/search?q=best+free+css+templates" target="_blank">best free CSS templates</a> in the world. Please tell your friends about it. Thank you. Cloud bread kogi bitters pitchfork shoreditch tumblr yr succulents single-origin coffee schlitz enamel pin you probably haven't heard of them ugh hella.
                                        <br /><br />When you look for free CSS templates, you can simply type TemplateMo in any search engine website. In addition, you can type TemplateMo Digital Marketing, TemplateMo Corporate Layouts, etc. Master cleanse +1 intelligentsia swag post-ironic, slow-carb chambray knausgaard PBR&amp;B DSA poutine neutra cardigan hoodie pop-up.</p>
                                </div>
                                <div className="accordion" id="accordionExample">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="headingOne">
                                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                Best useful links ?
                                            </button>
                                        </h2>
                                        <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                            <div className="accordion-body">
                                                Dolor <strong>almesit amet</strong>, consectetur adipiscing elit, sed doesn't eiusmod tempor kinfolk tonx seitan crucifix 3 wolf moon bicycle rights keffiyeh snackwave wolf same vice, chillwave vexillologist incididunt ut labore consectetur <code>adipiscing</code> elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="headingTwo">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                How does this work ?
                                            </button>
                                        </h2>
                                        <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                            <div className="accordion-body">
                                                Dolor <strong>almesit amet</strong>, consectetur adipiscing elit, sed doesn't eiusmod tempor kinfolk tonx seitan crucifix 3 wolf moon bicycle rights keffiyeh snackwave wolf same vice, chillwave vexillologist incididunt ut labore consectetur <code>adipiscing</code> elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="headingThree">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                Why is Villa the best ?
                                            </button>
                                        </h2>
                                        <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                            <div className="accordion-body">
                                                Dolor <strong>almesit amet</strong>, consectetur adipiscing elit, sed doesn't eiusmod tempor kinfolk tonx seitan crucifix 3 wolf moon bicycle rights keffiyeh snackwave wolf same vice, chillwave vexillologist incididunt ut labore consectetur <code>adipiscing</code> elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="info-table">
                                    <ul>
                                        <li>
                                            <img src="assets/images/info-icon-01.png" alt style={{ maxWidth: 52 }} />
                                            <h4>450 m2<br /><span>Total Flat Space</span></h4>
                                        </li>
                                        <li>
                                            <img src="assets/images/info-icon-02.png" alt style={{ maxWidth: 52 }} />
                                            <h4>Contract<br /><span>Contract Ready</span></h4>
                                        </li>
                                        <li>
                                            <img src="assets/images/info-icon-03.png" alt style={{ maxWidth: 52 }} />
                                            <h4>Payment<br /><span>Payment Process</span></h4>
                                        </li>
                                        <li>
                                            <img src="assets/images/info-icon-04.png" alt style={{ maxWidth: 52 }} />
                                            <h4>Safety<br /><span>24/7 Under Control</span></h4>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section best-deal">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-4">
                                <div className="section-heading">
                                    <h6>| Best Deal</h6>
                                    <h2>Find Your Best Deal Right Now!</h2>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="tabs-content">
                                    <div className="row">
                                        <div className="nav-wrapper">
                                            <ul className="nav nav-tabs" role="tablist">
                                                {categories.map(cat => (
                                                    <li className="nav-item" key={cat}>
                                                        <button
                                                            className={`nav-link ${activeTab === cat ? "active" : ""}`}
                                                            onClick={() => setActiveTab(cat)}
                                                        >
                                                            {cat}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {filteredProperty && (
                                            <div className="tab-content mt-4">
                                                <div className="tab-pane fade show active">
                                                    <div className="row">
                                                        <div className="col-lg-3">
                                                            <div className="info-table">
                                                                <ul>
                                                                    <li>Total Flat Space <span>{filteredProperty.space}</span></li>
                                                                    <li>Floor number <span>{filteredProperty.floor}</span></li>
                                                                    <li>Number of rooms <span>{filteredProperty.rooms}</span></li>
                                                                    <li>Parking Available <span>{filteredProperty.parking}</span></li>
                                                                    <li>Payment Process <span>{filteredProperty.payment}</span></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <img src={filteredProperty.image} alt={filteredProperty.category} />
                                                        </div>
                                                        <div className="col-lg-3">
                                                            <h4>{filteredProperty.title}</h4>
                                                            <p>{filteredProperty.description}</p>
                                                            <div className="icon-button">
                                                                <a href="#"><i className="fa fa-calendar" /> Schedule a visit</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Properties_detail
