
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const goToDashboard = () => {
    navigate("/portal");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div onClick={goToDashboard} className="inline-flex justify-center items-center gap-2 mb-8 hover:opacity-80 transition-opacity cursor-pointer">
          <img 
            src="https://via.placeholder.com/50?text=ANI" 
            alt="ANI Logo" 
            className="h-12 w-12 rounded" 
          />
          <h1 className="text-2xl font-bold">{t('app.title')}</h1>
        </div>
        <h2 className="text-4xl font-bold mb-4">{t('notfound.title')}</h2>
        <p className="text-xl text-gray-600 mb-4">{t('notfound.message')}</p>
        <button onClick={goToDashboard} className="text-blue-500 hover:text-blue-700 underline">
          {t('notfound.button')}
        </button>
      </div>
    </div>
  );
};

export default NotFound;
