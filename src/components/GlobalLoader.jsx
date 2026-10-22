// Overlay a pantalla completa con desenfoque y spinner giratorio.
export default function GlobalLoader({ visible }) {
  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Cargando"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(1, 13, 26, 0.6)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div
        style={{
          padding: 28,
          borderRadius: 16,
          background: 'rgba(0, 18, 48, 0.7)',
          border: '1px solid rgba(6, 149, 228, 0.25)',
          boxShadow: '6px 6px 14px rgba(0,0,0,.55), -4px -4px 12px rgba(6,149,228,.10)',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            border: '4px solid rgba(6, 149, 228, 0.2)',
            borderTopColor: '#0695E4',
            animation: 'til-spin 1s linear infinite',
          }}
        />
      </div>
    </div>
  );
}
