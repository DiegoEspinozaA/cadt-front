import React from 'react';
import SolicitudTableRow from './SolicitudTableRow';

const SolicitudesTable = ({ solicitudes, handleAbrirSolicitud, handleAprobar, handleRechazarSolicitud, handleEliminarSolicitud, handleReevaluar}) => (
    <div className="overflow-y-auto bg-white border-b border-gray-300 pb-[1px] h-full">
        <div className="w-full ">
                {solicitudes.map((sol) => (
                    <SolicitudTableRow
                        key={sol.id}
                        solicitud={sol}
                        handleAbrirSolicitud={handleAbrirSolicitud}
                        handleAprobar={handleAprobar}
                        handleRechazarSolicitud={handleRechazarSolicitud}
                        handleEliminarSolicitud={handleEliminarSolicitud}
                        handleReevaluar={handleReevaluar}
                    />
                ))}
        </div>
    </div>
);

export default SolicitudesTable;
