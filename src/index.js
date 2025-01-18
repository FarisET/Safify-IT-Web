import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ScanProvider } from './state/context/scanContext';
import { TimerProvider } from './state/context/useTimer';
import DraggableTimer from './components/DraggableTimer'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ScanProvider>
      <TimerProvider >
        <App />
        <DraggableTimer/>
      </TimerProvider>
    </ScanProvider>
  </React.StrictMode>
);

reportWebVitals();
