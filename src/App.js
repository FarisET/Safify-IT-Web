import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import Incidents from './pages/Incidents';

const App = () => {
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <Router>
        <Sidebar />
        <TopNav />
        {/* Adjust the main content area margin to make space for Sidebar and TopNav */}
        <div className="ml-64 mt-12 p-4"> {/* Sidebar is 16rem (64) and TopNav is 3rem (12) */}
          <Routes>
            <Route path="/" element={<Incidents />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
