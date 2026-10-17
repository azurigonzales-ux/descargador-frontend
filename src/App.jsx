import { useState } from 'react';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [videoData, setVideoData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Cambia esto por tu URL real de Render
  const BACKEND_URL = 'https://descargador-backend-3awh.onrender.com';

  const manejarBusqueda = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    setStatus('loading');
    setErrorMessage('');
    setVideoData(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/descargar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      });

      const datos = await response.json();

      if (!response.ok) {
        throw new Error(datos.detail || 'Error al conectar con la plataforma.');
      }

      setVideoData(datos);
      setStatus('success');
      
    } catch (err) {
      setErrorMessage(err.message);
      setStatus('error');
    }
  };

  const manejarDescarga = () => {
    if (!videoData) return;
    // Esto fuerza la descarga en teléfonos en lugar de abrir el reproductor
    const urlDescarga = `${BACKEND_URL}/api/forzar-descarga?url=${encodeURIComponent(videoData.url_directa)}&titulo=${encodeURIComponent(videoData.titulo)}`;
    window.location.href = urlDescarga;
  };

  return (
    <div className="app-container">
      <div className="glass-card">
        <h1 className="title">Descargador Universal</h1>
        <p className="subtitle">Descarga videos en MP4 directamente a tu dispositivo.</p>
        
        <form onSubmit={manejarBusqueda} className="input-group">
          <input 
            type="url" 
            placeholder="Pega el enlace aquí..." 
            value={url} 
            onChange={(e) => setUrl(e.target.value)}
            required
            className="url-input"
          />
          <button 
            type="submit" 
            disabled={status === 'loading'}
            className={`btn-primary ${status === 'loading' ? 'loading' : ''}`}
          >
            {status === 'loading' ? <span className="spinner"></span> : 'Buscar'}
          </button>
        </form>

        {status === 'error' && (
          <div className="error-box">
            <p>{errorMessage}</p>
          </div>
        )}

        {status === 'success' && videoData && (
          <div className="result-card fade-in">
            <h3 className="video-title">{videoData.titulo}</h3>
            
            {videoData.miniatura && (
              <div className="thumbnail-container">
                <img src={videoData.miniatura} alt="Miniatura" className="thumbnail" />
              </div>
            )}
            
            <button onClick={manejarDescarga} className="btn-download pulse">
              Descargar Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
