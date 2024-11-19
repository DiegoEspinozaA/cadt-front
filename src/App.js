import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Solicitudes from './pages/Solicitudes';
import Inventario from './pages/Inventario';
import Layout from './components/Layout';
import Empleado from './pages/Empleado';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/solicitudes" element={<Layout><Solicitudes /></Layout>} />
        <Route path="/inventario" element={<Layout><Inventario /></Layout>} />
        <Route path="/empleado" element={<Layout><Empleado /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
