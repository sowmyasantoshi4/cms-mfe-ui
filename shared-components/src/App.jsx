import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import {  Route, Routes } from "react-router-dom";

import "./index.css";
import Footer from "./components/Footer";
import Header from "./components/Header";

const App = () => (
  <Router>
    <Routes>
        <Route path="/header" element={<Header />}/>
        <Route path="/footer" element={<Footer />}/>

    </Routes>
 </Router>
);
const rootElement = document.getElementById("app")
if (!rootElement) throw new Error("Failed to find the root element")

const root = ReactDOM.createRoot(rootElement)

root.render(<App />)