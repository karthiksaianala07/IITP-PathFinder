import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MapProvider } from './context/MapContext.jsx'

createRoot(document.getElementById('root')).render(
  <MapProvider>
    <App />
  </MapProvider>,
)
