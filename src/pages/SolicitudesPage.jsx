import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Solicitudes from "../logic/solicitudes";
import { database, ref, onValue, get, update } from '../firebase/firebase';
import toast, { Toaster } from 'react-hot-toast';
import { Clock, CheckCircle, XCircle, Square, CircleX, Layers, Info, MoreVertical, ArrowRight, ArrowLeft, Search, Trash2 } from 'lucide-react'

const categorias = [
    {
        id: 1,
        nombre: "Todas",
        icon: (<Layers></Layers>)

    },
    {
        id: 2,
        nombre: "Pendientes",
        icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>)
    },
    {
        id: 3,
        nombre: "Aceptadas",
        icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check-big"><path d="M21.801 10A10 10 0 1 1 17 3.335" /><path d="m9 11 3 3L22 4" /></svg>)
    },
    {
        id: 4,
        nombre: "Rechazadas",
        icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>)
    }

]

const inventario = [

    {
        id: 1,
        nombre: "Jeringa",
        cantidad: 100,
    },
    {
        id: 2,
        nombre: "Isopos",
        cantidad: 50,
    }
]


const listaSolicitudes = new Solicitudes();



export default function SolicitudesPage() {

    const [solicitudes, setSolicitudes] = useState([]);
    const [categoriaActiva, setCategoriaActiva] = useState(categorias[0].nombre);

    const solicitudesPorEstado = solicitudes.reduce((acc, solicitud) => {
        if (!acc[solicitud.estado]) {
            acc[solicitud.estado] = [];
        }
        acc[solicitud.estado].push(solicitud);
        return acc;
    }, {});



    const getHeaderStyles = (status) => {
        if (status === 'Pendiente') {
            return 'bg-yellow-50'
        }

        if (status === "Rechazada") {
            return 'bg-red-50'
        }

        if (status === "Aceptada") {
            return 'bg-green-50'
        }
    }

    const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
    const [cantidadesEditadas, setCantidadesEditadas] = useState({});



    const closeModal = () => setSolicitudSeleccionada(null);
    // LOGICA PARA EDITAR LA CANTIDAD PEDIDAS POR EL USUARIO


    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://localhost:3001/solicitudes');
            const result = await response.json();
            setSolicitudes(result);
            listaSolicitudes.actualizarLista(result);

        };

        fetchData();
    }, []);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:3002'); // URL del servidor WebSocket

        socket.onopen = () => {
            console.log('Conectado al WebSocket');
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const { id } = message; // Asegúrate de que el mensaje tiene un campo 'id'

            setSolicitudes((prevData) => {
                // Verificar si la solicitud ya existe en el estado
                const existingSolicitudIndex = prevData.findIndex(s => s.id === id);

                if (existingSolicitudIndex >= 0) {
                    // Si existe, actualizarla
                    const updatedSolicitudes = [...prevData];
                    console.log(updatedSolicitudes);
                    updatedSolicitudes[existingSolicitudIndex] = message; // Actualizar la solicitud existente
                    return updatedSolicitudes; // Devolver el nuevo estado
                } else {
                    // Si no existe, agregarla
                    return [...prevData, message];
                }
            });


        };

        socket.onclose = () => {
            console.log('Desconectado del WebSocket');
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            socket.close();
        };
    }, []);




    // Función para manejar los cambios en las cantidades
    const handleCantidadChange = (id, nuevaCantidad) => {
        setCantidadesEditadas((prevCantidades) => ({
            ...prevCantidades,
            [id]: nuevaCantidad,
        }));

    };



    const handleAprobar = (id) => {
        const nuevasSolicitudes = solicitudes.map(s => {
            if (id === s.id) {
                return { ...s, estado: "Aceptada", fecha_revision: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' }) };
            }
            return s;
        });

        // setSolicitudes(listaSolicitudes.getListaSolicitudes());
        // const solicitudRef = ref(database, `solicitudes/${id}`);
        // update(solicitudRef, { estado: "Aceptada", fecha_revision: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' }) })
        //     .then(() => {
        //         console.log('Solicitud actualizada exitosamente');
        //     })
        //     .catch((error) => {
        //         console.error('Error al actualizar la solicitud:', error);
        //     });

        setSolicitudes(nuevasSolicitudes);
        closeModal();
    };


    const handleEliminarSolicitud = async (id) => {

        try {
            // Actualizar el estado local de la solicitud antes de hacer la solicitud HTTP
            const nuevasSolicitudes = solicitudes.filter(s => s.id !== id);

            // Realizar la solicitud de eliminación usando async/await
            const response = await fetch(`http://localhost:3001/solicitudes/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                // Manejo de errores en caso de que la eliminación falle
                throw new Error('Error al eliminar la solicitud');
            }

            // Actualizar la lista local y el estado una vez que la solicitud HTTP se haya completado
            setSolicitudes(nuevasSolicitudes);
            // Cerrar el modal después de actualizar el estado
            closeModal();
        } catch (error) {
            console.error('Hubo un error al rechazar la solicitud:', error);
        }
    };


    const handleRechazarSolicitud = async (id) => {

        try {
            // Actualizar el estado local de la solicitud antes de hacer la solicitud HTTP
            const nuevasSolicitudes = solicitudes.map(s => {
                if (s.id === id) {
                    return { ...s, estado: "Rechazada" };
                }
                return s;
            });

            // Realizar la solicitud de eliminación usando async/await
            const response = await fetch(`http://localhost:3001/solicitudes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
                ,
                body: JSON.stringify({
                    estado: "Rechazada"
                })
            });

            if (!response.ok) {
                // Manejo de errores en caso de que la eliminación falle
                throw new Error('Error al eliminar la solicitud');
            }

            // Actualizar la lista local y el estado una vez que la solicitud HTTP se haya completado
            setSolicitudes(nuevasSolicitudes);
            // Cerrar el modal después de actualizar el estado
            closeModal();
        } catch (error) {
            console.error('Hubo un error al rechazar la solicitud:', error);
        }
    };


    const handleSave = (solId, productId) => {
        let indexOfSol = solicitudes.findIndex(s => s.id === solId);
        solicitudes.forEach(s => {
            if (s.id === solId) {
                s.productos.forEach(p => {
                    if (p.id === productId) {
                        p.cantidad_entregada = cantidadesEditadas[productId];
                    }
                });
            }
        })
        setSolicitudSeleccionada(solicitudes[indexOfSol]);
        setEditingProductId(null);
    };

    const handleRechazarProducto = (solId, productId) => {
        let indexOfSol = solicitudes.findIndex(s => s.id === solId);
        handleCantidadChange(productId, 0);

        solicitudes.forEach(s => {
            if (s.id === solId) {
                s.productos.forEach(p => {
                    if (p.id === productId) {
                        p.cantidad_entregada = 0;
                    }
                });
            }
        })
        setSolicitudSeleccionada(solicitudes[indexOfSol]);
        setEditingProductId(null);
    };

    const handleAprobarProducto = (solId, productId, cantidad_solicitada) => {
        let indexOfSol = solicitudes.findIndex(s => s.id === solId);
        handleCantidadChange(productId, cantidad_solicitada);
        solicitudes.forEach(s => {
            if (s.id === solId) {
                s.productos.forEach(p => {
                    if (p.id === productId) {
                        p.cantidad_entregada = cantidad_solicitada;
                    }
                });
            }
        })
        setSolicitudSeleccionada(solicitudes[indexOfSol]);
        setEditingProductId(null);
    };


    const changeSolicitudViewState = (id, datosActualizados) => {
        listaSolicitudes.fueVista(id);
        setSolicitudes(listaSolicitudes.getListaSolicitudes());
        const solicitudRef = ref(database, `solicitudes/${id}`);
        update(solicitudRef, datosActualizados)
            .then(() => {
                console.log('Solicitud actualizada exitosamente');
            })
            .catch((error) => {
                console.error('Error al actualizar la solicitud:', error);
            });
    };

    const handleAbrirSolicitud = (solicitud) => {
        setSolicitudSeleccionada(solicitud);
        setIsDialogOpen(true);
        if (solicitud.vista === true) {
            return
        };

        console.log("solicitud", solicitud)

        const actualizarVista = (idSolicitud) => {
            try {
                const response = fetch(`http://localhost:3001/solicitudes/${idSolicitud}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        vista: true  // Enviar solo el campo 'vista'
                    })
                });

                const data = response.json();
                console.log('Solicitud actualizada:', data);
            } catch (error) {
                console.error('Error al actualizar la solicitud:', error);
            }
        };
        actualizarVista(solicitud.id);
    };

    //editar
    const [editingProductId, setEditingProductId] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <>
            <div className="flex h-screen relative">
                <aside className="w-64 bg-white border rounded-lg border-gray-300">
                    <nav className="p-4 space-y-2">
                        {categorias.map((categoria) => (
                            <button
                                key={categoria.id}
                                className={`flex gap-2 w-full text-left py-2 px-3 transition-all duration-200 cursor-pointer ${categoria.nombre === categoriaActiva ? 'bg-gray-300 rounded font-bold text-blue-gray-900' : 'bg-white hover:bg-gray-200 text-gray-600'}`}
                                onClick={() => setCategoriaActiva(categoria.nombre)}
                            >
                                {categoria.icon}
                                {categoria.nombre}
                            </button>
                        ))}
                    </nav>
                </aside>

                <main className="flex-1  bg-white ml-6 border border-gray-300 rounded-lg">
                    {solicitudesPorEstado[categoriaActiva.slice(0, -1)] && solicitudesPorEstado[categoriaActiva.slice(0, -1)].length > 0 ? (
                        <div className="p-6">
                            {/* Search bar */}
                            <div className="">
                                <div className=" max-w-4xl py-2 px-4 flex items-center border border-gray-300 rounded-lg focus-within:shadow-md focus-within:border-gray-300">
                                    <Search className="text-gray-700 mr-2" />
                                    <input
                                        type="text"
                                        placeholder="Buscar solicitud"
                                        className="flex-grow  py-2 px-4 focus:outline-none focus:none"
                                    />
                                </div>

                            </div>

                            {/* Opciones globales solicitudes */}
                            <div className="flex items-center justify-between  bg-white shadow-sm mt-6">
                                <div className="flex items-center">
                                    <button className="ml-2">
                                        <Square className="text-gray-400 " size={22} />
                                    </button>
                                    <button className="ml-5">
                                        <MoreVertical className="text-gray-400" size={22} />
                                    </button>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <span>1-50 de 1,258</span>
                                    <button className="ml-4">
                                        <ArrowLeft className="  text-gray-400" size={22} />

                                    </button>
                                    <button className="ml-4">
                                        <ArrowRight className=" text-gray-800" size={22} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center font-bold flex h-full justify-center gap-2 text-lg items-center">
                            <Info />
                            No hay solicitudes para la categoria {categoriaActiva}
                        </div>
                    )}

                    {/* Header */}
                    {/* solicitudees + contenedor con overflow */}
                    <div className="overflow-y-auto max-h-[900px]">
                        <table className="mb-1 w-full">
                            <tbody>
                                {solicitudesPorEstado[categoriaActiva.slice(0, -1)] && solicitudesPorEstado[categoriaActiva.slice(0, -1)].length > 0 && (
                                    solicitudesPorEstado[categoriaActiva.slice(0, -1)].map((sol) => (
                                        <tr key={sol.id} className="sol relative">
                                            <div
                                                className={`group flex items-center px-6 py-2 cursor-pointer   hover:text-black
                                                ${sol.vista === false ? ' font-semibold bg-gray-100 ' : 'text-gray-400'}`}
                                                onClick={() => handleAbrirSolicitud(sol)}
                                            >
                                                <div className="flex items-center ">
                                                    <button
                                                        className="p-2 rounded-full hover:bg-gray-300 mr-4 transition-colors "
                                                        aria-label="Seleccionar"
                                                        onClick={(e) => e.stopPropagation()} // Evita que el click se propague
                                                    >
                                                        <Square size={22} />
                                                    </button>

                                                    {sol.estado === 'Pendiente' && (
                                                        <div className="flex items-center bg-orange-100 text-orange-900 rounded-full p-2 mr-2 text-xs">
                                                            <Clock size={14} className="" />
                                                        </div>
                                                    )}
                                                    {sol.estado === 'Aceptada' && (
                                                        <div className="flex items-center bg-green-100 text-green-900 rounded-full p-2  mr-2 text-xs font-medium">
                                                            <CheckCircle size={14} className="" />
                                                        </div>
                                                    )}
                                                    {sol.estado === 'Rechazada' && (
                                                        <div className="flex items-center bg-red-100 text-red-900 rounded-full p-2 text-xs  mr-2 font-medium">
                                                            <XCircle size={14} className="" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="w-1/4 truncate text-gray-800">{sol.responsable} - {sol.unidad}</div>
                                                <h1>{sol.vista}</h1>
                                                <div className="flex-grow truncate text-gray-800">
                                                    <span className="">{sol.descripcion}</span>
                                                </div>

                                                <div className="w-40 flex justify-end items-center relative">
                                                    <div className="text-sm text-right transition-opacity duration-200 group-hover:opacity-0 text-gray-800">
                                                        {sol.fecha}
                                                    </div>
                                                    <div className="absolute right-0 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ">
                                                        <button
                                                            className="p-2 rounded-full hover:bg-gray-300"
                                                            aria-label="Aceptar"
                                                            onClick={(e) => {
                                                                e.stopPropagation();  // Evita que el click se propague
                                                                handleAprobar(sol.id);
                                                            }}
                                                        >
                                                            <CheckCircle size={22} className="text-gray-600" />
                                                        </button>
                                                        <button
                                                            className="p-2 rounded-full hover:bg-gray-300"
                                                            aria-label="Rechazar"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleRechazarSolicitud(sol.id);
                                                            }}
                                                        >
                                                            <CircleX size={22} className="text-gray-700" />
                                                        </button>

                                                        <button
                                                            className="p-2 rounded-full hover:bg-gray-300"
                                                            aria-label="Rechazar"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleEliminarSolicitud(sol.id);
                                                            }}
                                                        >
                                                            <Trash2 size={22} className="text-gray-700" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </tr>


                                    ))

                                )

                                }
                            </tbody>

                        </table>
                    </div>
                </main>
            </div>



            {solicitudSeleccionada && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
                        <h2 className="text-xl font-bold mb-4">
                            Solicitud #{solicitudSeleccionada.id} - {solicitudSeleccionada.estado}
                        </h2>
                        <p className="mb-2">
                            <strong>Fecha de emisión:</strong> {solicitudSeleccionada.fecha}
                        </p>
                        <p className="mb-2">
                            <strong>Responsable:</strong> {solicitudSeleccionada.responsable}
                        </p>
                        <p className="mb-2">
                            <strong>Unidad:</strong> {solicitudSeleccionada.unidad}
                        </p>
                        <p className="mb-4">
                            <strong>Descripción:</strong> {solicitudSeleccionada.descripcion || "N/A"}
                        </p>
                        <h3 className="font-semibold mb-2">Productos solicitados</h3>

                        <div className="mb-4 max-h-[700px] overflow-y-auto p-2 border border-gray-200 shadow-sm">
                            <ul>
                                {solicitudSeleccionada.productos.map((productoSolicitado) => {
                                    const productoInventario = inventario.find(
                                        (item) => item.nombre === productoSolicitado.nombre
                                    );

                                    const cantidadRestante = productoInventario
                                        ? productoInventario.cantidad - (productoSolicitado.cantidad_entregada)
                                        : "No disponible en inventario";


                                    return (
                                        <li key={productoSolicitado.id} className="ml-4 list-disc mb-4">
                                            <div key={productoSolicitado.id} className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <span>{productoSolicitado.nombre} - </span>
                                                    {(productoSolicitado.cantidad_entregada === null) && <span>{productoSolicitado.cantidad_solicitada}</span>}
                                                    {(productoSolicitado.cantidad_solicitada === productoSolicitado.cantidad_entregada) && <span>{productoSolicitado.cantidad_entregada}</span>}
                                                    {((productoSolicitado.cantidad_entregada !== null && productoSolicitado.cantidad_solicitada !== productoSolicitado.cantidad_entregada))
                                                        &&
                                                        <div className="flex items-center gap-2">
                                                            <span className="line-through text-red-600">{productoSolicitado.cantidad_solicitada}</span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right">
                                                                <path d="M5 12h14" />
                                                                <path d="m12 5 7 7-7 7" />
                                                            </svg>
                                                            <span>{productoSolicitado.cantidad_entregada}</span>
                                                        </div>}


                                                    {(productoSolicitado.cantidad_entregada === 0) && <h1 className="text-sm text-red-600 font-bold">Rechazado</h1>}
                                                </div>
                                                {solicitudSeleccionada.estado === "Pendiente" && (
                                                    <div className="flex gap-1 items-center">
                                                        <input
                                                            placeholder="Nuevo valor"
                                                            type="number"
                                                            value={productoSolicitado[productoSolicitado.id]}
                                                            onChange={(e) => handleCantidadChange(productoSolicitado.id, Number(e.target.value))}
                                                            className={`w-24  ${editingProductId === productoSolicitado.id ? ' border border-gray-300 rounded-lg px-4 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-150' : 'hidden'} `}
                                                        />


                                                        {editingProductId === productoSolicitado.id ? (
                                                            <button onClick={() => handleSave(solicitudSeleccionada.id, productoSolicitado.id)}
                                                                className="flex items-center border border-gray-300 p-2 rounded-lg gap-1 hover:bg-slate-100 hover:border-gray-500 transition-all duration-100 h-9 text-xs shadow-sm"
                                                            >
                                                                {/* <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-save"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" /><path d="M7 3v4a1 1 0 0 0 1 1h7" /></svg> */}
                                                                <span>Guardar</span></button>
                                                        ) : (
                                                            <button onClick={() => setEditingProductId(productoSolicitado.id)}
                                                                className="flex items-center border border-gray-300 p-2 rounded-lg gap-1 hover:bg-slate-100 hover:border-gray-500 transition-all duration-100 h-9 text-xs shadow-sm"
                                                            >
                                                                {/* <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" /></svg> */}
                                                                <span>Editar</span></button>
                                                        )}

                                                        {(productoSolicitado.cantidad_entregada !== 0) &&
                                                            <button
                                                                onClick={() => handleRechazarProducto(solicitudSeleccionada.id, productoSolicitado.id)}
                                                                className="flex items-center border border-gray-300 p-2 rounded-lg gap-1 hover:bg-slate-100 hover:border-gray-500 transition-all duration-100 h-9 text-xs shadow-sm"
                                                            >
                                                                {/* <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ban"><circle cx="12" cy="12" r="10" /><path d="m4.9 4.9 14.2 14.2" /></svg> */}
                                                                <span>Denegar</span>

                                                            </button>
                                                        }

                                                        {(productoSolicitado.cantidad_entregada === 0) &&

                                                            <button
                                                                onClick={() => handleAprobarProducto(solicitudSeleccionada.id, productoSolicitado.id, productoSolicitado.cantidad_solicitada)}
                                                                className="flex items-center border border-gray-300 p-2 rounded-lg gap-1 hover:bg-slate-100 hover:border-gray-500 transition-all duration-100 h-9 text-xs shadow-sm"
                                                            >
                                                                {/* <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg> */}
                                                                <span>Aprobar</span>
                                                            </button>
                                                        }
                                                    </div>
                                                )}


                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {productoInventario
                                                    ? `Quedarán: ${cantidadRestante > 0 ? cantidadRestante : 0}`
                                                    : "No disponible en inventario"}
                                            </span>


                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        <div className="bg-gray-100 p-2 rounded-lg flex gap-2 justify-between text-sm mt-8">
                            <button
                                className="flex items-center border border-gray-300 p-2 rounded-lg gap-1 hover:bg-slate-100 hover:border-gray-400 transition-all duration-100"
                                onClick={closeModal}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    className="lucide lucide-minimize-2"
                                >
                                    <polyline points="4 14 10 14 10 20" />
                                    <polyline points="20 10 14 10 14 4" />
                                    <line x1="14" x2="21" y1="10" y2="3" />
                                    <line x1="3" x2="10" y1="21" y2="14" />
                                </svg>
                                Cerrar
                            </button>


                            {solicitudSeleccionada.estado === "Pendiente" && (
                                <div className="flex gap-2">
                                    <button
                                        className="flex items-center border border-gray-300 p-2 rounded-lg gap-1 hover:bg-slate-100 hover:border-gray-400 transition-all duration-100 shadow-sm"
                                        onClick={() => handleRechazarSolicitud(solicitudSeleccionada.id)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            className="lucide lucide-circle-x"
                                        >
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="m15 9-6 6" />
                                            <path d="m9 9 6 6" />
                                        </svg>
                                        Rechazar
                                    </button>
                                    <button
                                        className="bg-green-500 hover:bg-green-600 text-white flex items-center p-2 rounded-lg gap-1 transition-all hover:border-gray-400 duration-100 shadow-sm"
                                        onClick={() => handleAprobar(solicitudSeleccionada.id)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            className="lucide lucide-circle-check-big"
                                        >
                                            <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                                            <path d="m9 11 3 3L22 4" />
                                        </svg>
                                        Aprobar
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </>

    );
}
