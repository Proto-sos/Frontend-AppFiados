import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Inventario from './pages/Inventario';
import Clientes from './pages/Clientes';
import NuevoFiado from './pages/NuevoFiado';
import ResumenClientes from './pages/ResumenClientes'; // 1. Importamos la nueva página
import './App.css';
import Sincronizador from './components/Sincronizador'; // Importar

function App() {
  return (
    <Router>
      <div className="container">
        <Sincronizador />
        {/* MENÚ DE NAVEGACIÓN ACTUALIZADO */}
        <nav className="navbar">
          <Link to="/" className="nav-link">📦 Inventario</Link>
          <Link to="/clientes" className="nav-link">👥 Clientes y Pagos</Link>
          <Link to="/nuevo-fiado" className="nav-link">📝 Registrar Fiado</Link>
          {/* 2. Añadimos el link al menú */}
          <Link to="/cobranza" className="nav-link">📋 Deudas Generales</Link>
        </nav>

        <hr />

        {/* DEFINICIÓN DE RUTAS */}
        <Routes>
          <Route path="/" element={<Inventario />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/nuevo-fiado" element={<NuevoFiado />} />
          {/* 3. Registramos la ruta para que React sepa qué mostrar */}
          <Route path="/cobranza" element={<ResumenClientes />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
