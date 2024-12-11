import React from 'react';
import { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { LogOut } from 'lucide-react';
export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token); // Decodificar el token
      setUser({
        nombre: decoded.nombre,
        rol: decoded.rol,
        foto: decoded.foto
      });
    }
  }, []);


  const cerrarSesion = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="bg-white border border-gray-200 px-2 flex rounded-lg justify-between">
      <div className="flex gap-3 w-full px-3 py-4">
        <Link to="/admin">
          <button className="p-3 bg-gray-600 rounded-lg text-gray-200 hover:shadow-md hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" strokeLinejoin="round" class="lucide lucide-move-left"><path d="M6 8L2 12L6 16" /><path d="M2 12H22" /></svg>

          </button>
        </Link>
        <Link to="/admin"
        >
          <button className="p-3 bg-gray-600 rounded-lg text-gray-200 hover:shadow-md hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" strokeLinejoin="round" class="lucide lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
          </button>
        </Link>
      </div>

      {user && (
        <>
          <div className="flex items-center gap-4">
            {user.foto && (
              <div className="flex items-center ">
                <div className="h-6 w-8 mr-3 ">
                  <img
                    alt={user.nombre}
                    src={user.foto}
                    className="h-full w-full rounded-full object-cover object-center"
                  />
                </div>
                
                <span className="text-gray-700 font-semibold text-sm">
                  {user.nombre}
                </span>
               
              </div>
            )}
            <span className='py-1 px-3 bg-gray-200 rounded-lg border text-gray-500 text-xs'>
            {user.rol[0].toUpperCase() + user.rol.substring(1)}
            </span>
            <button
              onClick={cerrarSesion}
              className="flex items-center gap-2 px-3 py-1 transition-colors text-gray-600 hover:text-gray-800 border border-gray-300 whitespace-nowrap rounded-lg hover:bg-gray-200"
            >
              <LogOut className='w-4 h-4' />
              Cerrar sesión
            </button>

          </div>

        </>
      )}


    </div >
  )
}

