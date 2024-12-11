import React from 'react';

const SolicitudEstadoBadge = ({ estado }) => {
    const estadoStyles = {
        Pendiente: "bg-orange-100 text-orange-500 border border-orange-200",
        Aceptada: "bg-green-100 text-green-600 border border-green-300",
        Rechazada: "bg-red-100 text-red-400 border border-red-200",
        Eliminada: "bg-gray-100 text-gray-400 border border-gray-300",
    };

    return (
        <div className={`flex items-center ${estadoStyles[estado]} rounded-lg py-1 px-2 mr-2 text-xs`}>
            {estado === 'Pendiente' && <span>Pendiente</span>}
            {estado === 'Aceptada' && <span>Aceptada</span>}
            {estado === 'Rechazada' && <span>Rechazada</span>}
            {estado === 'Eliminada' && <span>Eliminada</span>}
        </div>
    );
};

export default SolicitudEstadoBadge;
