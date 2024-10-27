import React, { Suspense, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from 'react-redux';
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
import ErrorBoundaryWrapper from './components/ErrorBoundaryWrapper'; // Import the wrapper
import { logout } from "./globalState/authSlice";
import { PageUnavailable } from "./components/PageUnavailable";

// Lazy load the shared components
// const Header = React.lazy(() => import('sharedMFE/Header'));
// const Footer = React.lazy(() => import('sharedMFE/Footer'));


// Function to safely load a component
const loadComponent = (importFunc) => {
  return React.lazy(() =>
    importFunc()
      .then((module) => ({ default: module.default }))
      .catch((error) => {
        console.error("Error loading component:", error);
        return { default: () => <PageUnavailable /> }; // Fallback component
      })
  );
};

const Login = loadComponent(() => import('loginMFE/Login'));
const TrackPackage = loadComponent(() => import('trackingMFE/TrackPackage'));
const GlobalReport = loadComponent(() => import('reportsMFE/GlobalReport'));
const AddBranch = loadComponent(() => import('adminMFE/AddBranch'));
const AddStaff = loadComponent(() => import('adminMFE/AddStaff'));

const AddPackage = loadComponent(() => import('packagesMFE/AddPackage'));
const UpdatePackage = loadComponent(() => import('packagesMFE/UpdatePackage'));

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
  const userProfile = useSelector((state) => state.usr)

  
// console.log(userProfile)
  useEffect(() => {
    if (isTokenExpired()) {
      dispatch(logout());
      // window.location.href = '/login';  // Redirect to login page
    }
  }, []);

  return (
    <>
      <Router>
        {/* Wrap the entire layout and routes inside ErrorBoundary and Suspense */}
        {/* <ErrorBoundaryWrapper> */}
          {/* Single Suspense fallback for the entire lazy-loaded routes */}
          <Suspense fallback={<Loader />}>
            {/* Header */}
            <Header />
            <div className="container">
              <Routes>
                {/* Main Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/shell/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Login />} />
                <Route path="/tracking" element={<TrackPackage />} />

                {/* Logged in users accessible routes */}
                <Route path="/shell/dashboard" element={<Dashboard />} />
                <Route path="/shell/welcome" element={<Welcome />} />
                <Route path="/reports/globalReport" element={<GlobalReport />} />
                <Route path="/admin/addBranch" element={<AddBranch />} />
                <Route path="/admin/addStaff" element={<AddStaff />} />
                <Route path="/packages/addPackage" element={<AddPackage />} />
                <Route path="/packages/updatePackage" element={<UpdatePackage />} />

                {/* Catch-all route for 404 */}
                {/* {!portState && */}
                  <Route path="*" element={<NotFound />} />
              </Routes>
            </div>

            {/* Footer */}
            <Footer />
          </Suspense>
        {/* </ErrorBoundaryWrapper> */}
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