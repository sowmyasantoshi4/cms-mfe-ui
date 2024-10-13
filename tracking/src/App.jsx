import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import {  Route, Routes } from "react-router-dom";

import "./index.css";
import TrackPackage from "./components/TrackPackage";
import { Provider } from "react-redux";
import { store, persistor } from '../../shell/src/globalState/store'; // Import both store and persistor

const App = () => (
  <Router>
    <Routes>
        <Route path="/tracking" element={<TrackPackage />}/>
    </Routes>
 </Router>
);
const rootElement = document.getElementById("app")
if (!rootElement) throw new Error("Failed to find the root element")

const root = ReactDOM.createRoot(rootElement)

root.render(<Provider store={store}><App /></Provider>)