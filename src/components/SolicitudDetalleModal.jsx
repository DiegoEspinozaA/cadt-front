import React from 'react';
import StatusBadge from '../components/StatusBadge';
import CheckAnimation from '../components/CheckAnimation';
import CrossAnimation from '../components/CrossAnimation';
import { ThumbsUp, ThumbsDown, FileText, Check, X, CheckCheck, Clock } from 'lucide-react';
import { Modal, Box } from '@mui/material';
import { isEditable } from '@testing-library/user-event/dist/utils';

const SolicitudDetalleModal = ({
    open,
    handleClose,
    solicitudSeleccionada,
    closeModal,
    handleAprobar,
    handleRechazarSolicitud,
    handleReevaluar,
    editingProductId,
    handleCantidadChange,
    handleSave,
    handleRechazarProducto,
    handleAprobarProducto,
    animateCheck,
    animateX,
    inventario,
    cantidadesEditadas,
    setEditingProductId,
    isEditable
}) => {
    const productos = solicitudSeleccionada.productos;
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    maxWidth: "90vw",
                    width: "70vh",
                    maxHeight: "80vh",
                }}
            >

                <Header solicitudSeleccionada={solicitudSeleccionada} />
                <SolicitudInfo
                    solicitudSeleccionada={solicitudSeleccionada}
                    handleAprobar={handleAprobar}
                    handleRechazarSolicitud={handleRechazarSolicitud}
                    isEditable={isEditable}
                />
                <Descripcion descripcion={solicitudSeleccionada.descripcion} />
                <ProductosTable
                    productos={productos}
                    inventario={inventario}
                    cantidadesEditadas={cantidadesEditadas}
                    editingProductId={editingProductId}
                    handleCantidadChange={handleCantidadChange}
                    handleSave={handleSave}
                    handleRechazarProducto={handleRechazarProducto}
                    handleAprobarProducto={handleAprobarProducto}
                    solicitudSeleccionada={solicitudSeleccionada}
                    setEditingProductId={setEditingProductId}
                    isEditable={isEditable}
                />
                <SolicitudDetalles
                    solicitudSeleccionada={solicitudSeleccionada}
                    animateCheck={animateCheck}
                    animateX={animateX}
                    isEditable={isEditable}
                />
                <Footer
                    closeModal={handleClose}
                    solicitudSeleccionada={solicitudSeleccionada}
                    handleReevaluar={handleReevaluar}
                    isEditable={isEditable}
                />

            </Box>
        </Modal>

    );
};

const Header = ({ solicitudSeleccionada }) => (
    <div className="flex items-center justify-between mb-8 text-gray-700">
        <div className="flex items-center gap-2">
            <FileText />
            <div>
                <h1 className="text-xl font-bold text-gray-600">Solicitud #{solicitudSeleccionada.id}</h1>
            </div>
        </div>
        <div className="text-right flex items-center gap-2">
            <Clock className='w-4 h-4 text-gray-400'/>
            <p className="text-gray-600 ">{solicitudSeleccionada.fecha}</p>
        </div>
    </div>
);

const SolicitudInfo = ({ solicitudSeleccionada, handleAprobar, handleRechazarSolicitud, isEditable }) => (
    <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
            <h2 className="text-lg font-light text-gray-800">Formulario de solicitud de producto</h2>
            <StatusBadge status={solicitudSeleccionada.estado} />
            {
                solicitudSeleccionada.eliminada && (
                    <StatusBadge status={"Eliminada"} />
                )
            }
        </div>
        {(solicitudSeleccionada.estado === 'Pendiente' && isEditable) && (
            <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                    onClick={() => handleAprobar(solicitudSeleccionada, solicitudSeleccionada.id)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-50 hover:text-green-600 transition-colors"
                >
                    <ThumbsUp className="w-5 h-5" />
                </button>
                <button
                    onClick={() => handleRechazarSolicitud(solicitudSeleccionada, solicitudSeleccionada.id)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-r-lg hover:bg-gray-50 hover:text-red-600 transition-colors"
                >
                    <ThumbsDown className="w-5 h-5" />
                </button>
            </div>
        )}
    </div>
);

const Descripcion = ({ descripcion }) => (
    <div className="mb-6">
        <p className="text-gray-400 mb-2">Descripción</p>
        <p className="text-gray-700 mb-4">{descripcion}</p>
    </div>
);

const ProductosTable = ({
    productos,
    inventario,
    cantidadesEditadas,
    editingProductId,
    handleCantidadChange,
    handleSave,
    handleRechazarProducto,
    handleAprobarProducto,
    solicitudSeleccionada,
    setEditingProductId,
    isEditable,
}) => (
    <div className="mb-4 max-h-[400px] overflow-y-auto border rounded-lg">
        <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Cantidad</th>
                    {isEditable && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">En Stock</th>

                    )}
                    {isEditable && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500"></th>

                    )}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {productos.map((producto) => {


                    const productoInventario =
                        Array.isArray(inventario) && inventario.find((item) => item.nombre === producto.nombre);
                    const cantidadRestante = productoInventario
                        ? productoInventario.stock - (cantidadesEditadas[producto.id])
                        : 'No disponible';

                    return (
                        <tr key={producto.id}>
                            <td className="px-6 py-4">{producto.nombre}</td>
                            <td className="px-6 py-4">

                                {/* Caso 1: cantidad_solicitada igual a cantidad_entregada */}
                                <>
                                    {isEditable && (
                                        <>
                                            {producto.cantidad_solicitada === cantidadesEditadas[producto.id] && (
                                                <div className="flex items-center gap-2">
                                                    {producto.cantidad_solicitada}
                                                    {solicitudSeleccionada.estado !== "Pendiente" && (
                                                        <Check size={14} className="text-green-600 opacity-80" />
                                                    )}
                                                </div>
                                            )}

                                            {cantidadesEditadas[producto.id] === 0 && (
                                                <div className="flex items-center gap-2 text-red-600">
                                                    <span className="line-through">{producto.cantidad_solicitada}</span>
                                                    <X size={14} />
                                                </div>
                                            )}

                                            {producto.cantidad_solicitada !== cantidadesEditadas[producto.id] &&
                                                cantidadesEditadas[producto.id] > 0 && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="line-through text-red-600">
                                                            {producto.cantidad_solicitada}
                                                        </span>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="14"
                                                            height="14"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="lucide lucide-arrow-right"
                                                        >
                                                            <path d="M5 12h14" />
                                                            <path d="m12 5 7 7-7 7" />
                                                        </svg>
                                                        <span>{cantidadesEditadas[producto.id]}</span>
                                                        {solicitudSeleccionada.estado !== "Pendiente" && (
                                                            <Check size={14} className="text-green-600 opacity-80" />
                                                        )}
                                                    </div>
                                                )}
                                        </>
                                    )}

                                    {!isEditable && (
                                        <>
                                            {producto.cantidad_solicitada === producto.cantidad_entregada && (
                                                <div className="flex items-center gap-2">
                                                    {producto.cantidad_solicitada}
                                                    {solicitudSeleccionada.estado !== "Pendiente" && (
                                                        <Check size={14} className="text-green-600 opacity-80" />
                                                    )}
                                                </div>
                                            )}

                                            {producto.cantidad_entregada === 0 && (
                                                <div className="flex items-center gap-2 text-red-600">
                                                    <span className="line-through">{producto.cantidad_solicitada}</span>
                                                    <X size={14} />
                                                </div>
                                            )}

                                            {producto.cantidad_solicitada !== producto.cantidad_entregada &&
                                                producto.cantidad_entregada > 0 && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="line-through text-red-600">
                                                            {producto.cantidad_solicitada}
                                                        </span>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="14"
                                                            height="14"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="lucide lucide-arrow-right"
                                                        >
                                                            <path d="M5 12h14" />
                                                            <path d="m12 5 7 7-7 7" />
                                                        </svg>
                                                        <span>{producto.cantidad_entregada}</span>
                                                        {solicitudSeleccionada.estado !== "Pendiente" && (
                                                            <Check size={14} className="text-green-600 opacity-80" />
                                                        )}
                                                    </div>
                                                )}
                                        </>
                                    )}

                                </>
                            </td>
                            {isEditable && (
                                <td className="px-6 py-4">{cantidadRestante}</td>

                            )}
                            {isEditable && (
                                <td className="px-6 py-4 flex justify-end">
                                    {solicitudSeleccionada.estado === "Pendiente" && (
                                        <div className="flex justify-end gap-2 items-center">
                                            {/* Input siempre ocupa espacio, pero con visibility para mostrar/ocultar */}
                                            <input
                                                type="number"
                                                placeholder="Nuevo valor"
                                                min={1}

                                                value={producto[producto.id]}
                                                onChange={(e) =>
                                                    handleCantidadChange(
                                                        producto.id,
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className={`w-20 border border-gray-300 rounded-lg px-4 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-150 ${editingProductId === producto.id
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                                    }`}
                                            />
                                            {/* Botón Guardar o Editar */}
                                            {editingProductId === producto.id ? (
                                                <button
                                                    onClick={() =>
                                                        handleSave(
                                                            solicitudSeleccionada.id,
                                                            producto.id
                                                        )
                                                    }
                                                    className="flex items-center justify-center border border-gray-300 p-2 rounded-lg gap-1 hover:bg-slate-100 hover:border-gray-500 transition-all duration-100 h-9 text-xs shadow-sm w-14"
                                                >
                                                    Guardar
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setEditingProductId(producto.id)}
                                                    className="flex items-center justify-center border border-gray-300 p-2 rounded-lg gap-1 hover:bg-slate-100 hover:border-gray-500 transition-all duration-100 h-9 text-xs shadow-sm w-14"
                                                >
                                                    Editar
                                                </button>
                                            )}
                                            {/* Botón Denegar o Aprobar */}
                                            {cantidadesEditadas[producto.id] !== 0 ? (
                                                <button
                                                    onClick={() =>
                                                        handleRechazarProducto(
                                                            solicitudSeleccionada.id,
                                                            producto.id
                                                        )
                                                    }
                                                    className="flex items-center border border-gray-300 p-2 rounded-lg gap-1 hover:bg-slate-100 hover:border-gray-500 transition-all duration-100 h-9 text-xs shadow-sm"
                                                >
                                                    Denegar
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        handleAprobarProducto(
                                                            solicitudSeleccionada.id,
                                                            producto.id,
                                                            producto.cantidad_solicitada
                                                        )
                                                    }
                                                    className="flex items-center border border-gray-300 p-2 rounded-lg gap-1 hover:bg-slate-100 hover:border-gray-500 transition-all duration-100 h-9 text-xs shadow-sm"
                                                >
                                                    Aprobar
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </td>
                            )}

                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
);

const SolicitudDetalles = ({ solicitudSeleccionada, animateCheck, animateX, isEditable }) => (
    <div className="mt-8 space-y-8">
        {isEditable && (
            <div>
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">SOLICITADO POR:</p>
                <div>
                    <p className="font-medium text-gray-900">{solicitudSeleccionada.responsable}</p>
                    <p className="text-sm text-gray-600">{solicitudSeleccionada.unidad}</p>
                    {/* <p className="text-sm text-gray-600">{solicitudSeleccionada.box}</p> */}
                </div>
            </div>
        )}

        <div className="flex gap-12">
            <div className="flex-1">
                <p className="text-sm text-gray-600">Estado</p>
                <div className="border-b-2 border-gray-300 pt-2 w-48 pb-1 relative">
                    {solicitudSeleccionada.estado !== 'Pendiente' ? (
                        <p className="text-sm text-gray-800 relative-container">
                            &nbsp;
                            {solicitudSeleccionada.estado === 'Aceptada' && (
                                <div className="seal approved">APROBADA</div>
                            )}
                            {solicitudSeleccionada.estado === 'Rechazada' && (
                                <>
                                    <div className="seal rejected">RECHAZADA</div>
                                    {/* <CrossAnimation shouldAnimate={animateX} /> */}
                                </>
                            )}

                        </p>

                    ) : (
                        <p className="text-sm text-gray-800">&nbsp;</p>
                    )}
                </div>
            </div>
            <div className="flex-1">
                <p className="text-sm text-gray-600">Revisado</p>
                <div className="border-b-2 border-gray-300 pt-2 w-48 pb-1">
                    {solicitudSeleccionada.fecha_revision ? (
                        <p className="text-sm text-gray-800 flex items-center gap-2">
                            <CheckCheck size={16} className='text-gray-400' />
                            {solicitudSeleccionada.fecha_revision}</p>
                    ) : (
                        <p className="text-sm text-gray-800">&nbsp;</p>
                    )}
                </div>
            </div>
        </div>
    </div>
);

const Footer = ({ closeModal, solicitudSeleccionada, handleReevaluar, isEditable }) => (
    <div className="p-2 rounded-lg flex gap-2 justify-between text-sm mt-8">
        <button
            className="flex items-center border border-gray-300 p-2 rounded-lg gap-1 hover:bg-slate-100 hover:border-gray-400 transition-all duration-100"
            onClick={closeModal}
        >
            Cerrar
        </button>
        {solicitudSeleccionada.estado !== "Pendiente" && isEditable && (
            <button
                className="flex items-center border border-gray-300 p-2 rounded-lg gap-1 hover:bg-slate-100 hover:border-gray-400 transition-all duration-100"
                onClick={() => handleReevaluar(solicitudSeleccionada, solicitudSeleccionada.id)}
            >
                Reevaluar
            </button>
        )}
    </div>
);

export default SolicitudDetalleModal;
