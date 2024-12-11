import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import Solicitudes from './pages/Solicitudes';
import Inventario from './pages/Inventario';
import Layout from './components/Layout';
import Empleado from './pages/Empleado';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Funcionarios from './pages/Funcionarios';
import AreaBodega from './pages/AreaBodega';
import { useEffect } from 'react';

function App() {
  const [rol, setRol] = useState(() => {
    // Restaurar el rol desde localStorage si existe
    return localStorage.getItem('rol');
  });

  useEffect(() => {
    // Actualizar localStorage cuando el rol cambie
    if (rol) {
      localStorage.setItem('rol', rol);
    } else {
      localStorage.removeItem('rol'); // Limpiar el rol si no hay sesión
    }
  }, [rol]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setRole={setRol} />} />

        <Route
          path="/funcionarios"
          element={
            <ProtectedRoute allowedRoles={['admin']} rol={rol}>
              <Layout>
                <Funcionarios />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/areasbodegas"
          element={
            <ProtectedRoute allowedRoles={['admin']} rol={rol}>
              <Layout>
                <AreaBodega />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/solicitudes"
          element={
            <ProtectedRoute allowedRoles={['admin', 'encargado']} rol={rol}>
              <Layout>
                <Solicitudes />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventario"
          element={
            <ProtectedRoute allowedRoles={['admin', 'encargado']} rol={rol}>
              <Layout>
                <Inventario />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin', 'encargado']} rol={rol}>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/empleado"
          element={
            <ProtectedRoute allowedRoles={['empleado']} rol={rol}>
              <Layout>
                <Empleado />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
