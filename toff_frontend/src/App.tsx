import React from 'react';
import './App.css';
import NavbarShared from './Components/Shared/NavbarShared';
import Home from './Components/Home';
import FooterShared from './Components/Shared/FooterShared';
import Musik from './Components/Musik';
import NoMatch from './Components/Shared/NoMatch';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
          <NavbarShared />
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/musik" element={<Musik />} />
              <Route path="*" element={<NoMatch />} />
          </Routes>
          <FooterShared />
      </Router>
    </div>
  );
}

export default App;
