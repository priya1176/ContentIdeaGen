import './App.css';
import React from 'react'; 
import { Routes, Route } from "react-router-dom";
import Form from "./components/Form";
import AnalyticsDashboard from './components/AnalyticsDashboard';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
