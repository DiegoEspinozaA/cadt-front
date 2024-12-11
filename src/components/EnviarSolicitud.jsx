// import { database, ref, push, set} from '../firebase/firebase';
import React, { useState } from 'react';


const FECHA_EMISION = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' });
const ESTADO = "Pendiente";
const VISTA = false;

const nuevaSolicitud = {
    fecha: FECHA_EMISION,
    estado: ESTADO,
    responsable: 'Diego Espinoza 2',
    unidad: 'Unidad 2',
    descripcion: 'Jeringas porfavor',
    vista: VISTA,
    productos: [
      {
        id: 1,
        nombre: 'Producto 1',
        cantidad_solicitada: 10,
        cantidad_entregada: ""
      },
      {
        id: 2,
        nombre: 'Producto 2',
        cantidad_solicitada: 20,
        cantidad_entregada: ""
      }
    ]
}

const EnviarSolicitud = () => {

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


    const enviarSolicitud = async (e) => {
        e.preventDefault();
        await fetch('http://localhost:3001/solicitudes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaSolicitud)
        });
    };


    return (
        <div>
            <button className="w-full p-4 flex items-center justify-center gap-2 bg-blue-50 text-blue-800 font-semibold rounded hover:shadow-md transition-all duration-100 border border-blue-100/50"
            onClick={enviarSolicitud}>Enviar Solicitud</button>
        </div>
    );
};

export default EnviarSolicitud;
