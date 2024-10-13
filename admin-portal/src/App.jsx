import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import {  Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from '../../shell/src/globalState/store'; // Import both store and persistor

import "./index.css";
import AddBranch from "./components/branch/AddBranch";
import AddStaff from "./components/staff/AddStaff";

const App = () => (
  <Router>
    <Routes>
        <Route path="/addBranch" element={<AddBranch />}/>
        <Route path="/addStaff" element={<AddStaff />}/>

    </Routes>
 </Router>
);
const rootElement = document.getElementById("app")
if (!rootElement) throw new Error("Failed to find the root element")

const root = ReactDOM.createRoot(rootElement)

root.render(<Provider store={store}><App /></Provider>)