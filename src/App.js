import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CharacterCard from './CharacterCard'; // Импортируем компонент карточки персонажа
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<CharacterCard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
