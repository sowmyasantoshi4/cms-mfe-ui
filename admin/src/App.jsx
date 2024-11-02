import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import {  Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from 'shell/store'; // Import authSlice from shell MFE remotely

import "./index.css";
import AddBranch from "./components/branch/AddBranch";
import AddStaff from "./components/staff/AddStaff";

const App = () => (
  <Router>
    <Routes>
        <Route path="/admin/addBranch" element={<AddBranch />}/>
        <Route path="/admin/addStaff" element={<AddStaff />}/>

    </Routes>
 </Router>
);
const rootElement = document.getElementById("app")
if (!rootElement) throw new Error("Failed to find the root element")

const root = ReactDOM.createRoot(rootElement)

root.render(<Provider store={store}><App /></Provider>)