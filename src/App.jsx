import { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

  const manejarDescarga = async (e) => {
    e.preventDefault();
    if (!url) return;

    setStatus('loading');

    try {
      // Busca esta sección y déjala así:
      // 
      const response = await fetch('https://descargador-backend-3awh.onrender.com/descargar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      });

      if (!response.ok) throw new Error('Error en el servidor al descargar.');

      // Recibir el archivo binario (Blob)
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Crear enlace invisible para forzar la descarga en el almacenamiento local
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `Video_HQ_${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      
      // Limpieza
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
    <div style={{ padding: '50px', fontFamily: 'sans-serif', textAlign: 'center', background: '#111827', minHeight: '100vh', color: '#fff' }}>
      <h1>Descargador de Video en Alta Calidad</h1>
      <p>Pega links de YouTube o TikTok para unirlos en máxima resolución</p>
      
      <form onSubmit={manejarDescarga} style={{ marginTop: '30px' }}>
        <input 
          type="url" 
          placeholder="Introduce la URL del video..." 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={status === 'loading'}
          style={{ padding: '12px', width: '350px', borderRadius: '6px', border: '1px solid #4b5563', marginRight: '10px' }}
          required
        />
        <button 
          type="submit" 
          disabled={status === 'loading'}
          style={{ padding: '12px 24px', borderRadius: '6px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {status === 'loading' ? 'Procesando HQ...' : 'Descargar'}
        </button>
      </form>

      {status === 'loading' && <p style={{ color: '#3b82f6', marginTop: '20px' }}>⏳ Descargando y multiplexando pistas de alta fidelidad... por favor espera.</p>}
      {status === 'success' && <p style={{ color: '#10b981', marginTop: '20px' }}>✅ ¡Descargado! Busca el archivo en tu computadora.</p>}
      {status === 'error' && <p style={{ color: '#ef4444', marginTop: '20px' }}>❌ Hubo un problema al procesar el enlace.</p>}
    </div>
  );
}

export default App;