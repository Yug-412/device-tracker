import React, { useState } from 'react';
import Footer from './coman/Footer';
import Head from './coman/Head';
import Navbar from './coman/Navbar';
import axios from 'axios'; // Make sure axios is installed
import { toast } from 'react-toastify';

function Contact() {
    const [data, setData] = useState({
        name: "",
        email: "",
        sub: "",
        desc: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

 const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // Only include the required fields, NOT the id
        const { name, email, sub, desc } = data;

        await axios.post("http://localhost:3000/contacts", {
            name,
            email,
            sub,
            desc
        });

        toast.success("Message sent successfully!");
        setData({ name: "", email: "", sub: "", desc: "" });
    } catch (err) {
        console.error("Error sending data:", err);
        toast.error("Failed to send message.");
    }
};



    return (
        <div>
            <Head />
            <Navbar />
            <div>

                <div className="page-heading header-text">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <span className="breadcrumb"><a href="/">Home</a>  /  Contact Us</span>
                                <h3>Contact Us</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="contact-page section">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="section-heading">
                                    <h6>| Contact Us</h6>
                                    <h2>Get In Touch With Our Agents</h2>
                                </div>
                                <p>When you really need to download free CSS templates, please remember our website TemplateMo. Also, tell your friends about our website. Thank you for visiting. There is a variety of Bootstrap HTML CSS templates on our website. If you need more information, please contact us.</p>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="item phone">
                                            <img src="assets/images/phone-icon.png" alt style={{ maxWidth: 52 }} />
                                            <h6>010-020-0340<br /><span>Phone Number</span></h6>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="item email">
                                            <img src="assets/images/email-icon.png" alt style={{ maxWidth: 52 }} />
                                            <h6>info@villa.co<br /><span>Business Email</span></h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <form id="contact-form" onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <fieldset>
                                                <label htmlFor="name">Full Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    value={data.name}
                                                    onChange={handleChange}
                                                    placeholder="Your Name..."
                                                    autoComplete="on"
                                                    required
                                                />
                                            </fieldset>
                                        </div>

                                        <div className="col-lg-12">
                                            <fieldset>
                                                <label htmlFor="email">Email Address</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    value={data.email}
                                                    onChange={handleChange}
                                                    placeholder="Your E-mail..."
                                                    required
                                                />
                                            </fieldset>
                                        </div>

                                        <div className="col-lg-12">
                                            <fieldset>
                                                <label htmlFor="sub">Subject</label>
                                                <input
                                                    type="text"
                                                    name="sub"
                                                    id="sub"
                                                    value={data.sub}
                                                    onChange={handleChange}
                                                    placeholder="Subject..."
                                                    autoComplete="on"
                                                />
                                            </fieldset>
                                        </div>

                                        <div className="col-lg-12">
                                            <fieldset>
                                                <label htmlFor="desc">Message</label>
                                                <textarea
                                                    name="desc"
                                                    id="desc"
                                                    value={data.desc}
                                                    onChange={handleChange}
                                                    placeholder="Your Message"
                                                    required
                                                />
                                            </fieldset>
                                        </div>

                                        <div className="col-lg-12">
                                            <fieldset>
                                                <button type="submit" id="form-submit" className="orange-button">
                                                    Send Message
                                                </button>
                                            </fieldset>
                                        </div>
                                    </div>
                                </form>

                            </div>
                            <div className="col-lg-12">
                                <div id="map">
                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3673.2888430685216!2d72.60861864539947!3d22.97640367879345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e85ff32555f75%3A0x7959044b5a5783a7!2sSiddhnath%20Park%20Cooperative%20Housing%20Society%2C%20B8%2C%20Siddhanath%20Park%20Society%2C%20Paras%20Nagar%2C%20Isanpur%2C%20Ahmedabad%2C%20Gujarat%20380050!5e0!3m2!1sen!2sin!4v1749632338137!5m2!1sen!2sin" width="100%" height="500px" frameBorder={0} style={{ border: 0, borderRadius: 10, boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.15)' }} allowFullScreen />
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

export default Contact
