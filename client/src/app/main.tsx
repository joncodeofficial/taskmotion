import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from '@/app/context/AuthContext.tsx';
import { ThemeProvider } from '@/app/context/ThemeContext.tsx';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { queryClient, persister } from '@/lib/queryClient';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      <BrowserRouter>
        <AuthContextProvider>
          <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
            <App />
          </ThemeProvider>
        </AuthContextProvider>
      </BrowserRouter>
    </PersistQueryClientProvider>
  </StrictMode>
);
