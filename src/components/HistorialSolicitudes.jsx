import React, { useState } from 'react';
import { History, CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';
import { SolicitudCard } from './SolicitudCard';
import { FilterBar } from './FilterBar';

export function HistorialSolicitudes({ solicitudes }) {
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [ordenarPor, setOrdenarPor] = useState('fecha');

    if (solicitudes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <History className="w-16 h-16 mb-4" />
                <p className="text-lg">No hay solicitudes en el historial</p>
            </div>
        );
    }

    const solicitudesFiltradas = solicitudes
        .filter((s) =>
            filtroEstado === 'todos'
                ? true
                : s.estado.toLowerCase() === filtroEstado.toLowerCase().slice(0, -1)
        )
        .sort((a, b) => {
            if (ordenarPor === 'fecha') {
                return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
            }
            return a.estado.localeCompare(b.estado);
        });


    const stats = {
        total: solicitudes.length,
        pendientes: solicitudes.filter((s) => s.estado === 'Pendiente').length,
        aceptadas: solicitudes.filter((s) => s.estado === 'Aceptada').length,
        rechazadas: solicitudes.filter((s) => s.estado === 'Rechazada').length,
    };


    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className='w-full flex justify-center text-center'>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm max-w-md">
                {/* Total */}
                <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-md shadow-sm hover:shadow-md transition text-center">
                    <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                        <p className="text-blue-600 font-medium">Total</p>
                    </div>
                    <p className="text-2xl font-semibold text-blue-700 mt-1">{stats.total}</p>
                </div>

                {/* Pendientes */}
                <div className="px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-md shadow-sm hover:shadow-md transition text-center">
                    <div className="flex items-center justify-center gap-2">
                        <Clock className="w-5 h-5 text-yellow-500" />
                        <p className="text-yellow-600 font-medium">Pendientes</p>
                    </div>
                    <p className="text-2xl font-semibold text-yellow-700 mt-1">{stats.pendientes}</p>
                </div>

                {/* Aceptadas */}
                <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-md shadow-sm hover:shadow-md transition text-center">
                    <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <p className="text-green-600 font-medium">Aceptadas</p>
                    </div>
                    <p className="text-2xl font-semibold text-green-700 mt-1">{stats.aceptadas}</p>
                </div>

                {/* Rechazadas */}
                <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-md shadow-sm hover:shadow-md transition text-center">
                    <div className="flex items-center justify-center gap-2">
                        <XCircle className="w-5 h-5 text-red-500" />
                        <p className="text-red-600 font-medium">Rechazadas</p>
                    </div>
                    <p className="text-2xl font-semibold text-red-700 mt-1">{stats.rechazadas}</p>
                </div>
            </div>
            </div>

            <FilterBar
                filtroEstado={filtroEstado}
                setFiltroEstado={setFiltroEstado}
                ordenarPor={ordenarPor}
                setOrdenarPor={setOrdenarPor}
            />

            <div className="flex-grow overflow-y-auto space-y-3   py-4 border-t border-gray-200">
                {solicitudesFiltradas.map((solicitud) => (
                    <SolicitudCard key={solicitud.id} solicitud={solicitud} />
                ))}
            </div>
        </div>
    );
}
