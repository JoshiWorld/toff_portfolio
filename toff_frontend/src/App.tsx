import React from 'react';
import './App.css';
import NavbarShared from './Components/Shared/NavbarShared';
import Home from './Components/Home';
import FooterShared from './Components/Shared/FooterShared';
import Musik from './Components/Musik';
import NoMatch from './Components/Shared/NoMatch';
import Kontakt from './Components/Kontakt';
import Live from './Components/Live';
import Impressum from './Components/Impressum';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
          <NavbarShared />
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/musik" element={<Musik />} />
              <Route path="/kontakt" element={<Kontakt />} />
              <Route path="/live" element={<Live />} />
              <Route path="/impressum" element={<Impressum />} />
              <Route path="*" element={<NoMatch />} />
          </Routes>
          <FooterShared />
      </Router>
    </div>
  );
}

export default App;
