// import { database, ref, push, set} from '../firebase/firebase';
import React, { useState } from 'react';
import seedrandom from 'seedrandom';

const generateUniqueId = (seed) => {
    const rng = seedrandom(seed); // Usar la semilla para crear un generador aleatorio
    console.log("random", rng)
    const now = new Date(); 
    const secondsPart = now.getSeconds().toString().padStart(2, '0'); // Obtener los segundos actuales
    const datePart = now.getTime().toString(); // Parte basada en la fecha
    const randomPart = Math.floor(rng() * 10000).toString().padStart(4, '0'); // Generar número aleatorio con semilla
    return datePart + secondsPart + randomPart; // Retornar como cadena incluyendo los segundos
};

let cont = 0;

const FECHA_EMISION = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' });
const ESTADO = "Pendiente";
const VISTA = false;

const nuevaSolicitud = {
    id: Math.floor(Math.random() * 100),
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

const EnviarSolicitud = ({datosSolicitud}) => {

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
