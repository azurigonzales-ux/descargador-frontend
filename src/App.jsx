import { useState } from 'react'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [videoData, setVideoData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // IMPORTANTE: Cambia esta URL por la de tu backend en Render
  // Ejemplo: 'https://mi-descargador-backend.onrender.com/api/descargar'
  const BACKEND_URL = 'https://descargador-backend-3awh.onrender.com/descargar'

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true)
    setError(null)
    setVideoData(null)

    try {
        const response = await fetch(`${BACKEND_URL}?url=${encodeURIComponent(url)}`)
        const data = await response.json()

        if (response.ok) {
            setVideoData(data)
        } else {
            setError(data.detail || "Error al obtener el video de la plataforma.")
        }
    } catch (error) {
        console.error("Error:", error)
        setError("Error de conexión con el backend. Revisa que tu servidor esté encendido.")
    } finally {
        setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Descargador Universal</h1>
      <p>Pega enlaces de YouTube, X, TikTok, Facebook, etc.</p>
      
      <form onSubmit={handleDownload} style={{ marginTop: '20px' }}>
        <input
          type="url"
          placeholder="https://www.youtube.com/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          style={{ padding: '10px', width: '70%', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button 
          type="submit" 
          disabled={loading} 
          style={{ padding: '10px 15px', marginLeft: '10px', cursor: 'pointer', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          {loading ? 'Extrayendo...' : 'Buscar'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}

      {videoData && videoData.url_directa && (
        <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #eaeaea', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3>{videoData.titulo}</h3>
          {videoData.miniatura && (
            <img src={videoData.miniatura} alt="Miniatura" style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '10px' }} />
          )}
          <br />
          <a href={videoData.url_directa} target="_blank" rel="noopener noreferrer">
            <button style={{ marginTop: '20px', padding: '12px 24px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
              Descargar Archivo MP4
            </button>
          </a>
        </div>
      )}
    </div>
  )
}

export default App
