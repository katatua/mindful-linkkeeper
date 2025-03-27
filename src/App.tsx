
import React from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import LoginPage from "./pages/LoginPage";
import ANIPortal from "./pages/ANIPortal";
import QueryHistoryPage from "./pages/QueryHistoryPage";

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/portal" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/portal/*" element={<ANIPortal />} />
            <Route path="/portal" element={<ANIPortal />} />
            <Route path="/portal/query-history" element={<QueryHistoryPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
