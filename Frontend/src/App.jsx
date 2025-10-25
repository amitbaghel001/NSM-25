import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CaseDetails from './pages/CaseDetails';
import CreateCase from './pages/CreateCase';
import UploadDocument from './pages/UploadDocument';
import Analytics from './pages/Analytics';
import Scheduling from './pages/Scheduling';
import AIAnalyzer from './pages/AIAnalyzer';



function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/case/:id" element={<PrivateRoute><CaseDetails /></PrivateRoute>} />
            <Route path="/create-case" element={<PrivateRoute><CreateCase /></PrivateRoute>} />
            <Route path="/upload/:caseId" element={<PrivateRoute><UploadDocument /></PrivateRoute>} />
            <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
            <Route path="/scheduling" element={<PrivateRoute><Scheduling /></PrivateRoute>} />

            <Route 
              path="/ai-analyzer" 
              element={<PrivateRoute><AIAnalyzer /></PrivateRoute>} 
                />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
