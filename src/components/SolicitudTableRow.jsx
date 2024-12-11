import React from 'react';
import { Archive, ArchiveRestore, CheckCircle, CircleX, Inbox, RotateCcw, Square, Trash2 } from 'lucide-react';
import SolicitudEstadoBadge from './SolicitudEstadoBadge';
import { format, isToday, isThisYear } from 'date-fns';
import { es } from 'date-fns/locale';

function parseFecha(fechaString) {
    const [fecha, hora] = fechaString.split(', ');
    const [dia, mes, anio] = fecha.split('/');
    return new Date(anio, mes - 1, dia, ...hora.split(':'));
}

const FormattedDate = ({ solicitud }) => {
    const fecha = parseFecha(solicitud.fecha);
    const formattedDate = (() => {
        if (isToday(fecha)) {
            return format(fecha, 'hh:mm a', { locale: es });
        } else if (isThisYear(fecha)) {
            return format(fecha, 'd MMMM', { locale: es });
        } else {
            return format(fecha, 'dd/MM/yyyy', { locale: es });
        }
    })();

    return <span>{formattedDate}</span>;
};


const SolicitudTableRow = ({ solicitud, handleAbrirSolicitud, handleAprobar, handleRechazarSolicitud, handleEliminarSolicitud, handleReevaluar }) => (
    <div
        className={`group py-2  cursor-pointer sol border-b hover:text-black relative transition-colors flex items-centers px-4
        ${solicitud.vista === false ? 'bg-gray-100' : 'text-gray-500 font-light'}`}
        onClick={() => handleAbrirSolicitud(solicitud)}
    >
        <div className="flex items-center w-[600px] gap-2 ">
            <div className="text-transparent group-hover:text-gray-400">
                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-grip-vertical">
                        <circle cx="9" cy="12" r="1" />
                        <circle cx="9" cy="5" r="1" />
                        <circle cx="9" cy="19" r="1" />
                        <circle cx="15" cy="12" r="1" />
                        <circle cx="15" cy="5" r="1" />
                        <circle cx="15" cy="19" r="1" />
                    </svg>
                </div>
            </div>

            <button
                className="p-2 rounded-full hover:bg-gray-200 mr-4 text-gray-400/60 group-hover:text-black h-full"
                aria-label="Seleccionar"
                onClick={(e) => e.stopPropagation()}
            >
                <Square size={18} />
            </button>
            {solicitud.eliminada && <Trash2 size={18} className="text-gray-400 mr-2">Eliminada</Trash2>}
            <SolicitudEstadoBadge estado={solicitud.estado} />
            <span className={`font-medium mr-2 ${!solicitud.vista ? 'font-semibold text-gray-600' : ''}`}>{solicitud.responsable} - {solicitud.unidad}</span>



        </div>

        {/* Descripción con truncamiento responsivo */}
        <div className="flex-1 px-2 pr-12 min-w-0">
            <div className="flex">
                <span className="text-gray-500 truncate">{solicitud.descripcion}</span>
            </div>
        </div>

        <div className="ml-4 flex items-center gap-2 min-w-[100px] justify-end">
            <div className="flex items-center relative justify-end group">
                {/* Fecha visible por defecto */}
                <div className={`absolute w-16 justify-end text-xs font-semibold text-gray-600 right-0 flex items-center  group-hover:opacity-0 transition-opacity duration-200 ${solicitud.vista ? 'bg-white' : 'bg-gray-100'}`}>
                    <FormattedDate solicitud={solicitud} />
                </div>

                {/* Botones visibles al hacer hover */}
                <div className={`absolute right-0 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${solicitud.vista ? 'bg-white' : 'bg-gray-100'}`}>
                    {solicitud.eliminada ? (
                        <button
                            className="p-2 rounded-full hover:bg-gray-300"
                            aria-label="Archivar"
                            onClick={(e) => {
                                e.stopPropagation();
                                // handleReevaluar(solicitud, solicitud.id);
                            }}
                        >
                            <ArchiveRestore size={22} className="text-gray-700" />
                        </button>
                    ) : (
                        <>
                            {solicitud.estado === "Pendiente" ? (
                                <>
                                    <button
                                        className="p-2 rounded-full hover:bg-gray-300"
                                        aria-label="Aceptar"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAprobar(solicitud, solicitud.id);
                                        }}
                                    >
                                        <CheckCircle size={22} className="text-gray-600" />
                                    </button>
                                    <button
                                        className="p-2 rounded-full hover:bg-gray-300"
                                        aria-label="Rechazar"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRechazarSolicitud(solicitud, solicitud.id);
                                        }}
                                    >
                                        <CircleX size={22} className="text-gray-700" />
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="py-1 px-3  rounded hover:bg-gray-100 text-sm border border-gray-300 font-medium text-gray-700 flex items-center gap-2"
                                    aria-label="Reevaluar"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleReevaluar(solicitud, solicitud.id);
                                    }}
                                >
                                    Reevaluar

                                    <RotateCcw size={14}  />
                                </button>
                            )}
                            <button
                                className="p-2 rounded-full hover:bg-gray-300"
                                aria-label="Archivar"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEliminarSolicitud(solicitud, solicitud.id);
                                }}
                            >
                                <Archive size={22} className="text-gray-700" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    </div>

);

export default SolicitudTableRow;
