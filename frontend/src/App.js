import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RecruiterDashboard from './components/RecruiterDashboard';
import AddCandidate from './components/AddCandidateForm'; 
import Positions from './components/Positions'; 
import AplicacionesLTI from './components/AplicacionesLTI';
import AplicacionLTIForm from './components/AplicacionLTIForm';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RecruiterDashboard />} />
        <Route path="/add-candidate" element={<AddCandidate />} />
        <Route path="/positions" element={<Positions />} />
        <Route path="/aplicaciones" element={<AplicacionesLTI />} />
        <Route path="/aplicaciones/crear" element={<AplicacionLTIForm />} />
        <Route path="/aplicaciones/editar/:id" element={<AplicacionLTIForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;