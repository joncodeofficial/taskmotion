import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from '@/app/context/AuthContext.tsx';
import { ThemeProvider } from '@/app/context/ThemeContext.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <BrowserRouter>
        <AuthContextProvider>
          <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
            <App />
          </ThemeProvider>
        </AuthContextProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
