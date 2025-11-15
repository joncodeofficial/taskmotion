import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

// Crear el QueryClient con configuración optimizada
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 horas - tiempo que los datos permanecen en caché
      staleTime: 1000 * 60 * 5, // 5 minutos - tiempo antes de que los datos se consideren obsoletos
    },
  },
});

// Crear el persister usando localStorage (con wrapper asíncrono)
export const persister = createAsyncStoragePersister({
  storage: window.localStorage,
  key: 'taskmotion-cache', // Clave única para tu aplicación
});
