import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import App from './App';
import DesignerTable from './components/dizainer'
import Zadachi from './components/zadachi'
import Krug from'./components/krug' 
import Grafik from './components/grafik' 
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/designer-table" element={<DesignerTable />} />
        <Route path="/zadachi" element={<Zadachi/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)