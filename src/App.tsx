
import React, { Suspense, lazy, memo } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import LoginPage from "./pages/LoginPage";

// Define the correct component module type
type ComponentModule = { default: React.ComponentType<any> };

// Lazy load components with a more efficient approach
const ANIPortal = lazy(() => 
  import("./pages/ANIPortal")
    .then(module => ({ default: module.default }))
);

const QueryHistoryPage = lazy(() => 
  import("./pages/QueryHistoryPage")
    .then(module => ({ default: module.default }))
);

// Memoize loading fallback to prevent rerenders
const LoadingFallback = memo(() => (
  <div className="h-screen w-screen flex items-center justify-center">
    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
  </div>
));

// Memoize the entire app component
const App = memo(function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Navigate to="/portal" />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/portal/*" element={<ANIPortal />} />
              <Route path="/portal" element={<ANIPortal />} />
              <Route path="/portal/query-history" element={<QueryHistoryPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
});

export default App;
