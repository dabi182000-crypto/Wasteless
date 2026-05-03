import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { I18nProvider } from './context/I18nContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { FavouritesProvider } from './context/FavouritesContext.jsx';
import { ReviewsProvider } from './context/ReviewsContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <FavouritesProvider>
            <ReviewsProvider>
              <App />
            </ReviewsProvider>
          </FavouritesProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  </React.StrictMode>
);
