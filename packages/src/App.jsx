import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import {  Route, Routes } from "react-router-dom";

import "./index.css";
import { Provider } from "react-redux";
import { store } from 'shell/store'; // Import both store and persistor
import AddPackage from "./components/AddPackage";
import UpdatePackage from "./components/UpdatePackage";

const App = () => (
  <Router>
    <Routes>
        <Route path="/addPackage" element={<AddPackage />}/>
        <Route path="/updatePackage" element={<UpdatePackage />}/>

    </Routes>
 </Router>
);
const rootElement = document.getElementById("app")
if (!rootElement) throw new Error("Failed to find the root element")

const root = ReactDOM.createRoot(rootElement)

root.render(<Provider store={store}><App /></Provider>)