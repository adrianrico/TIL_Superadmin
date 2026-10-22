// Texto de fondo cuando no hay datos que mostrar.
export default function EmptyState({ text = 'sin registros todavía' }) {
  return (
    <div
      style={{
        padding: '64px 16px',
        textAlign: 'center',
        color: '#7aafc8',
        fontSize: 18,
        letterSpacing: 0.5,
        userSelect: 'none',
      }}
    >
      {text}
    </div>
  );
}
