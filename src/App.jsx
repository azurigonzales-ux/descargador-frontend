import { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle');

  const manejarDescarga = async (e) => {
    e.preventDefault();
    if (!url) return;

    setStatus('loading');

    try {
      // Conexión directa a tu servidor en Render
      const response = await fetch('https://descargador-backend-3awh.onrender.com/descargar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      });

      if (!response.ok) throw new Error('Error en el servidor al descargar.');

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `Video_HQ_${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
      setStatus('success');
      setUrl('');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div style={styles.contenedor}>
      <div style={styles.tarjeta}>
        <h1 style={styles.titulo}>Descargador Multimedios HQ</h1>
        <p style={styles.subtitulo}>
          Descarga videos en máxima calidad de YouTube, TikTok, Facebook, Instagram y X
        </p>
        
        <form onSubmit={manejarDescarga} style={styles.formulario}>
          <input 
            type="url" 
            placeholder="Pega el enlace del video aquí..." 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={status === 'loading'}
            style={styles.input}
            required
          />
          <button 
            type="submit" 
            disabled={status === 'loading'}
            style={{
              ...styles.boton,
              backgroundColor: status === 'loading' ? '#4b5563' : '#2563eb',
              cursor: status === 'loading' ? 'not-allowed' : 'pointer'
            }}
          >
            {status === 'loading' ? 'Procesando HQ...' : 'Descargar'}
          </button>
        </form>

        {status === 'loading' && (
          <p style={{ color: '#60a5fa', marginTop: '20px', fontSize: '14px' }}>
            ⏳ Descargando y procesando en la nube con FFmpeg...
          </p>
        )}
        {status === 'success' && (
          <p style={{ color: '#34d399', marginTop: '20px', fontSize: '14px' }}>
            ✅ ¡Descarga completada con éxito!
          </p>
        )}
        {status === 'error' && (
          <p style={{ color: '#f87171', marginTop: '20px', fontSize: '14px' }}>
            ❌ Error: Revisa el enlace o intenta de nuevo.
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  contenedor: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#f8fafc',
    padding: '20px',
    boxSizing: 'border-box'
  },
  tarjeta: {
    backgroundColor: '#1e293b',
    padding: 'clamp(20px, 5vw, 40px)',
    borderRadius: '16px',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
    width: '100%',
    maxWidth: '500px',
    textAlign: 'center',
    boxSizing: 'border-box'
  },
  titulo: {
    fontSize: 'clamp(20px, 6vw, 28px)',
    fontWeight: '700',
    marginBottom: '10px',
    color: '#f1f5f9'
  },
  subtitulo: {
    fontSize: '14px',
    color: '#94a3b8',
    marginBottom: '30px',
    lineHeight: '1.5'
  },
  formulario: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%'
  },
  input: {
    padding: '14px',
    borderRadius: '8px',
    border: '1px solid #334155',
    backgroundColor: '#0f172a',
    color: '#fff',
    fontSize: '16px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
  },
  boton: {
    padding: '14px',
    borderRadius: '8px',
    border: 'none',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'background-color 0.2s'
  }
};

export default App;