import { useEffect } from 'react';

const useAvoidZoom = () => {
  useEffect(() => {
    // Función para desactivar zoom con Ctrl + Scroll
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        // Agregamos metaKey para macOS
        e.preventDefault(); // Previene el zoom al usar Ctrl/Cmd + Scroll
      }
    };

    // Función para desactivar zoom con Ctrl + teclas +/-/0
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) && // Agregamos metaKey para macOS
        (e.key === '+' ||
          e.key === '=' || // '=' porque en algunos teclados Ctrl++ es Ctrl+=
          e.key === '-' ||
          e.key === '0')
      ) {
        e.preventDefault();
      }
    };

    // Para dispositivos táctiles (gesto de pellizco)
    const handleTouchMove = (e: TouchEvent) => {
      // Solo prevenimos si hay más de un toque (gesto de pellizco)
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Desactivar el comportamiento de "doble-tap para zoom" en móviles
    const disableTouchZoom = () => {
      // Agregar una meta tag viewport para desactivar el zoom del usuario
      const viewportMeta = document.querySelector('meta[name="viewport"]');

      viewportMeta?.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      );
    };

    // Aplicar la meta tag
    disableTouchZoom();

    // Detectamos si es macOS
    const isMacOS = /Mac|iPod|iPhone|iPad/.test(navigator.platform);

    // Añadir los event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    // En macOS podemos intentar usar otros eventos específicos
    if (isMacOS) {
      // Safari y otros navegadores en macOS también usan estos eventos
      document.addEventListener('gesturestart', (e) => e.preventDefault(), {
        passive: false,
      });
      document.addEventListener('gesturechange', (e) => e.preventDefault(), {
        passive: false,
      });
      document.addEventListener('gestureend', (e) => e.preventDefault(), {
        passive: false,
      });
    }

    // Limpiar los event listeners al desmontar el componente
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchmove', handleTouchMove);

      if (isMacOS) {
        document.removeEventListener('gesturestart', (e) => e.preventDefault());
        document.removeEventListener('gesturechange', (e) => e.preventDefault());
        document.removeEventListener('gestureend', (e) => e.preventDefault());
      }
    };
  }, []); // Solo se ejecuta al montar y desmontar el componente
};

export default useAvoidZoom;
