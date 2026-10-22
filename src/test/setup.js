// Configuración de pruebas: matchers de DOM y APIs del navegador que jsdom no trae.
import '@testing-library/jest-dom/vitest';

window.matchMedia =
  window.matchMedia ||
  ((query) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }));

window.getComputedStyle = window.getComputedStyle.bind(window);
globalThis.ResizeObserver =
  globalThis.ResizeObserver ||
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
