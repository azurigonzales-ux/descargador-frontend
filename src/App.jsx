import { useState } from 'react';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [videoData, setVideoData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const manejarDescarga = async () => {
    if (!url.trim()) return;
    setStatus('loading');
    setErrorMessage('');
    setVideoData(null);

    try {
      // Conexión a tu servidor en Render
      const response = await fetch('https://descargador-backend-3awh.onrender.com/api/descargar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Error en el servidor al buscar el video');
      }

      // Procesamos la respuesta como JSON
      const datos = await response.json();
      setVideoData(datos);
      setStatus('success');
      setUrl('');
      
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
      setStatus('error');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <h2>Descargador Universal de Videos</h2>
      <p>Soporta YouTube, X, TikTok y más.</p>
      
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Pega el enlace del video aquí..." 
          value={url} 
          onChange={(e) => setUrl(e.target.value)}
          style={{ padding: '10px', width: '70%', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <button 
          onClick={manejarDescarga} 
          disabled={status === 'loading'}
          style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '6px' }}
        >
          {status === 'loading' ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {status === 'error' && (
        <p style={{ color: '#d32f2f', backgroundColor: '#ffebee', padding: '10px', borderRadius: '6px' }}>
          {errorMessage}
        </p>
      )}

      {status === 'success' && videoData && (
        <div style={{ border: '1px solid #eaeaea', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginTop: '20px' }}>
          <h3 style={{ marginTop: 0 }}>{videoData.titulo}</h3>
          
          {videoData.miniatura && (
            <img 
              src={videoData.miniatura} 
              alt="Miniatura del video" 
              style={{ maxWidth: '100%', borderRadius: '8px', margin: '15px 0' }} 
            />
          )}
          
          <br />
          <a 
            href={videoData.url_directa} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#10B981',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              marginTop: '10px'
            }}
          >
            Descargar Archivo MP4
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
