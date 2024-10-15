import React, { Suspense, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../src/globalState/store'; // Import both store and persistor
import axios from "axios";

import Dashboard from "./components/Dashboard";
import Welcome from "./components/Welcome";
import NotFound from "./components/NotFound";
import Home from "./components/Home";

import "./index.css";
import Loader from "./components/Loader";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Lazy load the shared components
// const Header = React.lazy(() => import('sharedMFE/Header'));
// const Footer = React.lazy(() => import('sharedMFE/Footer'));

const Login = React.lazy(() => import('loginMFE/Login'));
const TrackPackage = React.lazy(() => import('trackingMFE/TrackPackage'));
const GlobalReport = React.lazy(() => import('reportsMFE/GlobalReport'));
const AddBranch = React.lazy(() => import('adminMFE/AddBranch'));
const AddStaff = React.lazy(() => import('adminMFE/AddStaff'));

const AddPackage = React.lazy(() => import('packagesMFE/AddPackage'));
const UpdatePackage = React.lazy(() => import('packagesMFE/UpdatePackage'));

// src/utils/auth.js
const isTokenExpired = () => {
  const expiryTime = localStorage.getItem('expiryTime');
  if (expiryTime && Date.now() > expiryTime) {
    return true;
  }
  return false;
};

const App = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isTokenExpired()) {
      dispatch(logout());
      window.location.href = '/login';  // Redirect to login page
    }
  }, []);
  
  return (
      <>
        <Router>
          <Suspense fallback={<div>Loading Header...</div>}>
            <Header />
          </Suspense>
            <div className="container">
              <Suspense fallback={<Loader />}>
                  <Routes>
                    <Route path="/" element={<Home loading={loading} setLoading={setLoading}/>}/>
                    <Route  path="/dashboard" element={<Dashboard />}/>
                    <Route  path="/welcome/*" element={<Welcome />}/>
                    <Route  path="/home" element={<Home />}/>
                    <Route  path="/login" element={<Login />}/>
                    <Route  path="/logout" element={<Login />}/>
                    <Route  path="/tracking" element={<TrackPackage />}/>
                    <Route  path="/globalReport" element={<GlobalReport />}/>
                    <Route  path="/addBranch" element={<AddBranch />}/>
                    <Route  path="/addStaff" element={<AddStaff />}/>
                    <Route path="/addPackage" element={<AddPackage />}/>
                    <Route path="/updatePackage" element={<UpdatePackage />}/>
                    
                    <Route path="*" element={<NotFound />}/>
                  </Routes>
              </Suspense>
            </div>
          <Suspense fallback={<div>Loading Footer...</div>}>
            <Footer />
          </Suspense>
          </Router>
        </>
    
  )
};

export default App

const rootElement = document.getElementById("root")
if (!rootElement) throw new Error("Failed to find the root element")

const root = ReactDOM.createRoot(rootElement)
root.render(
<Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
      <App />
  </PersistGate>
</Provider>)

// Add a request interceptor to attach the token to every request
axios.interceptors.request.use(
  (config) => {
      // Attach the token to the Authorization header
    let userProfileData = JSON.parse(localStorage.getItem("userProfile"));
    if( userProfileData && userProfileData.valid===true && userProfileData.token ){
          config.headers.Authorization =  `Bearer ${userProfileData.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);