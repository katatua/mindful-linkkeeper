
import React, { useContext } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { AuthContext, AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import LoginPage from "./pages/LoginPage";
import ANIPortal from "./pages/ANIPortal";
import QueryHistoryPage from "./pages/QueryHistoryPage";

function App() {
  const { isLoggedIn } = useContext(AuthContext);
  
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Redirect to login if not authenticated */}
            <Route
              path="/portal/*"
              element={
                isLoggedIn ? <ANIPortal /> : <Navigate to="/login" />
              }
            />
            
            <Route path="/portal" element={<ANIPortal />} />
            <Route path="/portal/query-history" element={<QueryHistoryPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
