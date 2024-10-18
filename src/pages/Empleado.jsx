import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import AsideMenu from '../components/Aside';
import { FileStack, Send, History } from 'lucide-react'
import { Button } from '@material-tailwind/react';
import EnviarSolicitud from '../components/EnviarSolicitud';
const opciones = [
    {
        id: 1,
        nombre: 'Inventario',
        icon: (<FileStack />)
    },
    {
        id: 2,
        nombre: 'Solicitudes',
        icon: (<Send />)
    },
    {
        id: 3,
        nombre: 'Historial',
        icon: (<History />)
    },
]


function Empleado() {
    const [categoriaActiva, setCategoriaActiva] = useState(opciones[0].nombre);

    return (
        <div className="flex flex-col h-screen p-6 bg-gray-100" >
            <Navbar />
            <div className="flex h-screen mt-6 relative">
                <aside className="w-64 bg-white border rounded border-gray-300">
                    <div className="p-4">

                    <EnviarSolicitud />
                    </div>

                    <AsideMenu opciones={opciones} categoriaActiva={categoriaActiva} setCategoriaActiva={setCategoriaActiva} />

                </aside>
                <main className="flex-1  bg-white ml-6 border border-gray-300">

                </main>
            </div>
        </div>
    );
}

export default Empleado;
