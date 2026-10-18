import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle'); // idle | searching | ready | downloading | completed | error
  const [videoData, setVideoData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [stepText, setStepText] = useState('');

  const BACKEND_URL = 'https://descargador-backend-3awh.onrender.com';

  // Animación fluida de la barra de progreso durante el procesamiento
  useEffect(() => {
    let interval;
    if (status === 'searching') {
      setProgress(15);
      setStepText('Conectando con el servidor y analizando enlace...');
      interval = setInterval(() => {
        setProgress((prev) => (prev < 85 ? prev + 8 : prev));
      }, 600);
    } else if (status === 'downloading') {
      setProgress(20);
      setStepText('Extrayendo video y audio en máxima calidad...');
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 50) {
            setStepText('Extrayendo pistas de video y audio...');
            return prev + 6;
          } else if (prev < 80) {
            setStepText('Empaquetando archivo MP4 compatible con tu dispositivo...');
            return prev + 4;
          } else if (prev < 94) {
            setStepText('Preparando descarga directa a tu carpeta de Descargas...');
            return prev + 1;
          }
          return prev;
        });
      }, 700);
    }
    return () => clearInterval(interval);
  }, [status]);

  const formatearDuracion = (segundos) => {
    if (!segundos) return null;
    const min = Math.floor(segundos / 60);
    const sec = Math.floor(segundos % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const manejarBusqueda = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setStatus('searching');
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
        throw new Error(datos.detail || 'No se pudo obtener la información del video.');
      }

      setProgress(100);
      setVideoData(datos);
      setStatus('ready');
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err.message === 'Failed to fetch'
          ? 'El servidor en Render está despertando. Espera 15 segundos y vuelve a presionar Buscar.'
          : err.message
      );
      setStatus('error');
    }
  };

  const iniciarDescargaDispositivo = async () => {
    if (!videoData) return;
    setStatus('downloading');
    setErrorMessage('');

    try {
      const response = await fetch(`${BACKEND_URL}/api/preparar-archivo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: videoData.url_original })
      });

      const datosArchivo = await response.json();

      if (!response.ok) {
        throw new Error(datosArchivo.detail || 'Error al generar el archivo MP4.');
      }

      setProgress(100);
      setStepText('¡Video listo! Guardando en tu carpeta de Descargas...');
      setStatus('completed');

      // Dispara la descarga nativa en Android, iOS y PC
      const downloadUrl = `${BACKEND_URL}/api/bajar/${encodeURIComponent(datosArchivo.file_id)}?nombre=${encodeURIComponent(datosArchivo.filename)}`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', datosArchivo.filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
      setStatus('error');
    }
  };

  const limpiarFormulario = () => {
    setUrl('');
    setVideoData(null);
    setStatus('idle');
    setErrorMessage('');
    setProgress(0);
  };

  return (
    <div className="main-wrapper">
      <div className="downloader-card">
        <div className="header-badge">MP4 • Alta Calidad</div>
        <h1 className="main-title">Descargador Universal</h1>
        <p className="main-subtitle">
          YouTube, TikTok, X (Twitter), Instagram, Facebook y más directo a tu dispositivo.
        </p>

        <form onSubmit={manejarBusqueda} className="search-form">
          <div className="input-wrapper">
            <input
              type="url"
              placeholder="Pega aquí el enlace del video..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={status === 'searching' || status === 'downloading'}
              className="search-input"
            />
            {url && status !== 'searching' && status !== 'downloading' && (
              <button type="button" onClick={limpiarFormulario} className="clear-btn" title="Limpiar">
                ✕
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={status === 'searching' || status === 'downloading'}
            className="search-btn"
          >
            {status === 'searching' ? (
              <span className="btn-content">
                <span className="loader-ring"></span> Analizando...
              </span>
            ) : (
              'Buscar Video'
            )}
          </button>
        </form>

        {/* Barra de animación fluida de procesamiento */}
        {(status === 'searching' || status === 'downloading') && (
          <div className="progress-section fade-in">
            <div className="progress-header">
              <span className="progress-label">{stepText}</span>
              <span className="progress-percentage">{progress}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        {/* Mensaje de Error */}
        {status === 'error' && (
          <div className="alert-error fade-in">
            <strong>Atención:</strong> {errorMessage}
          </div>
        )}

        {/* Tarjeta del Video Encontrado */}
        {(status === 'ready' || status === 'downloading' || status === 'completed') && videoData && (
          <div className="video-card fade-in">
            <div className="thumbnail-box">
              {videoData.miniatura ? (
                <img src={videoData.miniatura} alt={videoData.titulo} className="video-thumb" />
              ) : (
                <div className="thumb-placeholder">🎬 Video listo</div>
              )}
              <span className="platform-tag">{videoData.plataforma}</span>
              {videoData.duracion > 0 && (
                <span className="duration-tag">{formatearDuracion(videoData.duracion)}</span>
              )}
            </div>

            <div className="video-info">
              <h3 className="video-name">{videoData.titulo}</h3>

              <button
                onClick={iniciarDescargaDispositivo}
                disabled={status === 'downloading'}
                className={`download-btn ${status === 'completed' ? 'btn-success' : ''}`}
              >
                {status === 'downloading' ? (
                  <span className="btn-content">
                    <span className="loader-ring"></span> Procesando MP4...
                  </span>
                ) : status === 'completed' ? (
                  '✓ ¡Descarga iniciada! (Volver a descargar)'
                ) : (
                  '⬇ Guardar MP4 en mi dispositivo'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
