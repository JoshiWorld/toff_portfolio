import React from 'react';
import './App.css';
import NavbarShared from './Components/Shared/NavbarShared';
import Home from './Components/Home';
import FooterShared from './Components/Shared/FooterShared';

function App() {
  return (
    <div className="App">
      <NavbarShared />
        <Home />
        <FooterShared />
    </div>
  );
}

export default App;
