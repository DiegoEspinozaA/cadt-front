import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setRole }) => {
  const [rut, setrut] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rut, password }),
      });

      if (!response.ok) throw new Error('Credenciales incorrectas');

      const { token, rol } = await response.json();
      localStorage.setItem('token', token); // Guardar el token en localStorage
      setRole(rol); // Actualizar el rol en el estado global
      if (rol === 'admin' || rol === 'encargado') navigate('/admin');
      else if (rol === 'empleado') navigate('/empleado');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Iniciar sesión
        </h2>
        <p className="text-sm text-gray-500 text-center">
          Ingresa tus credenciales para continuar
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rut
            </label>
            <input
              type="text"
              placeholder="Ingrese su rut"
              value={rut}
              onChange={(e) => setrut(e.target.value)}
              className="nt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-150"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-150"
            />
          </div>
        </div>
        <button
          onClick={handleLogin}
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none"
        >
          Ingresar
        </button>
        {/* <p className="text-sm text-gray-500 text-center">
          ¿Olvidaste tu contraseña?{' '}
          <a
            href="/reset-password"
            className="text-blue-500 hover:underline"
          >
            Recuperar
          </a>
        </p> */}
      </div>
    </div>
  );
};

export default Login;
