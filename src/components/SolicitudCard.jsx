import React, { useState } from 'react';
import { ChevronRight, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import SolicitudDetalleModal from '../components/SolicitudDetalleModal';

const estadoClases = {
  Pendiente: 'bg-yellow-100 text-yellow-600',
  Rechazada: 'bg-red-100 text-red-600',
  Aceptada: 'bg-green-100 text-green-600',
};

const estadoIconos = {
  pendiente: <Clock className="w-5 h-5 text-yellow-600" />,
  rechazada: <XCircle className="w-5 h-5 text-red-600" />,
  aceptada: <CheckCircle className="w-5 h-5 text-green-600" />,
};

export function SolicitudCard({ solicitud }) {

  const handleChangeSelected = () => {
    setIsOpen(true);
    setSolicitudSeleccionada(solicitud);
  }
  const [isOpen, setIsOpen] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  return (
    <>
      <div
        className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
        onClick={() => handleChangeSelected(solicitud)} // Abre el modal con la solicitud seleccionada
      >
        {/* Card Header */}
        <div className="p-4 flex items-center justify-between gap-4">
          {/* Estado con Ícono */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {estadoIconos[solicitud.estado]}
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${estadoClases[solicitud.estado]}`}
              >
                {solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1)}
              </div>
            </div>
            {/* Fecha */}
            <span className="text-sm text-gray-500">
              {new Date(solicitud.fecha).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          {/* Icono de Chevron */}
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        {/* Card Footer */}
        <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
          {/* Número de Productos */}
          <div className="flex items-center gap-2 text-gray-600">
            <Package className="w-5 h-5 text-gray-500" />
            <span>
              {solicitud.productos.length}{' '}
              {solicitud.productos.length === 1 ? 'producto' : 'productos'}
            </span>
          </div>
          {/* ID de la Solicitud */}
          <span className="text-gray-500 font-mono text-sm">#{solicitud.id}</span>
        </div>
      </div>

      {/* Modal */}
      {solicitudSeleccionada && (
        <SolicitudDetalleModal
        open={isOpen}
        handleClose={() => setIsOpen(false)}
        isEditable={false}
          solicitudSeleccionada={solicitudSeleccionada}
          closeModal={() => setSolicitudSeleccionada(null)} // Cierra el modal
        />
      )}
    </>
  );
}
