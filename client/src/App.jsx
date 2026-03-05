import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Topbar from './components/Topbar';
import Navbar from './components/Navbar'; // Il tuo menu centrale a 4 quadrati
import Item from './pages/Item';
import Musei from './pages/Musei';
import Utenti from './pages/Utenti';
import Visite from './pages/Visite';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      {/* La Topbar resta sempre visibile in alto */}
      <Topbar /> 
      
      <div className="main-content">
        <Routes>
          {/* HOME PAGE: Mostra solo il menu centrale */}
          <Route path="/" element={<Navbar />} />
          
          {/* PAGINE SPECIFICHE: Il menu centrale sparisce e appaiono queste */}
          <Route path="/item" element={<Item />} />
          <Route path="/musei" element={<Musei />} />
          <Route path="/utenti" element={<Utenti />} />
          <Route path="/visite" element={<Visite />} />
          
          {/* Ritorna alla home se l'URL è sbagliato */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;