import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Upload from './pages/Upload';
import Dashboard from './pages/Dashboard';
import Ledger from './pages/Ledger';
import Purify from './pages/Purify';
import { ParserProvider } from './context/ParserContext';

export default function App() {
  return (
    <ParserProvider>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ledger" element={<Ledger />} />
          <Route path="/purify" element={<Purify />} />
        </Routes>
      </Layout>
    </BrowserRouter>
    </ParserProvider>
  );
}

