import React, { useState } from 'react';
import Home from './Home';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Properties from './properties';
import Properties_detail from './properties_detail';
import Contact from './contact';
import ScrollToTop from './ScrollToTop';

import Ahome from './admin/Ahome';
import Login from './admin/Login';
import Inquiry from './admin/inquiry';
import Product_details from './admin/Product_details';

function App() {
 

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/properties' element={<Properties />} />
        <Route path='/propertiesdetail' element={<Properties_detail />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/login' element={<Login />} />
    <Route path='/admin' element={<Ahome />} />
        <Route path='/user' element={<Inquiry />} />
          <Route path='/details' element={<Product_details />} />
        
    
      </Routes>
    </BrowserRouter>
  );
}

export default App;
