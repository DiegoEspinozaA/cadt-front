import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Inventario from './pages/Inventario.jsx';
import SolicitudesPage from './pages/SolicitudesPage.jsx';
import Empleado from './pages/Empleado.jsx';
import AgregarProducto from './pages/AgregarProducto.jsx';
import { Toaster } from 'react-hot-toast';
import Layout from './layout/Layout.jsx';

function App() {
  return (
    <Router>
      <div className="App bg-slate-100 h-screen bg-gray-100 ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/' element={<Layout />}>

            {/* <Route path="/carrito" element={<Carrito />} /> */}
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/solicitudes" element={<SolicitudesPage />} />
            <Route path="/empleado" element={<Empleado />} />
            <Route path="/inventario/agregarproducto" element={<AgregarProducto />} />
          </Route>

        </Routes>
      </div>
      <Toaster
        position="left-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{
          zIndex: 99999,
        }}
        toastOptions={{
          // Define default options
          className: '',
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },

          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
    </Router>

  );
}

export default App;
