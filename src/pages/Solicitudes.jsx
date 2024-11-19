import React, { useState, useEffect } from "react";
import categorias from "../data/categories.json"

import Tabs from '../components/Tabs';
import Search from "../components/Search";
import { ChartBarStacked, ChevronDown, Square, MoreVertical, ArrowLeft, ArrowRight, CircleX, CheckCircle, Pencil, Plus, ChevronLeft, ChevronRight, X, Trash2 } from 'lucide-react'
import solicitudesLogic from "../logic/solicitudes";

const categoriasSolicitudes = [
    {
        id: 1,
        nombre: "Todas",
        icon: (<></>)

    },
    {
        id: 2,
        nombre: "Pendientes",
        icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" strokeLinejoin="round" class="lucide lucide-clock"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>)
    },
    {
        id: 3,
        nombre: "Aceptadas",
        icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" strokeLinejoin="round" class="lucide lucide-circle-check-big"><path d="M21.801 10A10 10 0 1 1 17 3.335" /><path d="m9 11 3 3L22 4" /></svg>)
    },
    {
        id: 4,
        nombre: "Rechazadas",
        icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" strokeLinejoin="round" class="lucide lucide-circle-x"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>)
    },
    {
        id: 5,
        nombre: "Eliminadas",
        icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>)
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

const listaSolicitudes = new solicitudesLogic();
function Solicitudes() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [categoriaActiva, setCategoriaActiva] = useState("Todas");

    const handleChangeActiveCategory = (categoria) => {
        setCategoriaActiva(categoria);
        setActivePage(1);
    };
    const [activePage, setActivePage] = useState(1);

    const solicitudesPorEstado = solicitudes.reduce((acc, solicitud) => {
        // Organizar por estado
        if (!acc[solicitud.estado]) {
            acc[solicitud.estado] = [];
        }
        acc[solicitud.estado].push(solicitud);

        // Agregar a la lista 'todo'
        if (!acc.Toda) {
            acc.Toda = [];
        }
        acc.Toda.push(solicitud);
        return acc;
    }, {});


    const getHeaderStyles = (status) => {
        if (status === 'Pendiente') {
            return 'bg-yellow-50/80'
        }

        if (status === "Rechazada") {
            return 'bg-red-100/60'
        }

        if (status === "Aceptada") {
            return 'bg-green-100/60'
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

        // socket.onopen = () => {
        //     console.log('Conectado al WebSocket');
        // };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const { id } = message; // Asegúrate de que el mensaje tiene un campo 'id'

            setSolicitudes((prevData) => {
                // Verificar si la solicitud ya existe en el estado
                const existingSolicitudIndex = prevData.findIndex(s => s.id === id);

                if (existingSolicitudIndex >= 0) {
                    // Si existe, actualizarla
                    const updatedSolicitudes = [...prevData];
                    updatedSolicitudes[existingSolicitudIndex] = message; // Actualizar la solicitud existente
                    return updatedSolicitudes; // Devolver el nuevo estado
                } else {
                    // Si no existe, agregarla
                    return [...prevData, message];
                }
            });


        };

        // socket.onclose = () => {
        //     console.log('Desconectado del WebSocket');
        // };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            if (socket.readyState === 1) {
                socket.close();
            }
        };
    }, []);


    const itemsPerPage = 50;

    const productosFiltrados = solicitudesPorEstado;


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

        setSolicitudes(nuevasSolicitudes);
        closeModal();
    };


    const handleEliminarSolicitud = async (id) => {
        try {
            const nuevasSolicitudes = solicitudes.map(s => {
                if (id === s.id) {
                    return { ...s, estado: "Eliminada", fecha_revision: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' }) };
                }
                return s;
            });

            const response = await fetch(`http://localhost:3001/solicitudes/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la solicitud');
            }

            setSolicitudes(nuevasSolicitudes);
            closeModal();
        } catch (error) {
            console.error('Hubo un error al rechazar la solicitud:', error);
        }
    };


    const handleRechazarSolicitud = async (id) => {
        try {
            const nuevasSolicitudes = solicitudes.map(s => {
                if (s.id === id) {
                    return { ...s, estado: "Rechazada" };
                }
                return s;
            });

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
                throw new Error('Error al eliminar la solicitud');
            }
            setSolicitudes(nuevasSolicitudes);
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


    const handleAbrirSolicitud = (solicitud) => {
        setSolicitudSeleccionada(solicitud);
        setSolicitudes(prevSolicitudes =>
            prevSolicitudes.map(item =>
                item.id === solicitud.id ? { ...item, vista: true } : item
            )
        );
        setIsDialogOpen(true);
        if (solicitud.vista === true) {
            return
        };
        actualizarVista(solicitud.id);
    };

    const actualizarVista = async (idSolicitud) => {
        try {
            const response = await fetch(`http://localhost:3001/solicitudes/${idSolicitud}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    vista: true  // Enviar solo el campo 'vista'
                })
            });
        } catch (error) {
        }
    };

    const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);

    const [text, setText] = useState("");

    const handleResetSearch = () => {
        setText("");
    };
    //editar
    const [editingProductId, setEditingProductId] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div className='flex flex-row h-full'>
            <div className='w-full '>
                <div className='flex flex-col h-full w-full'>
                    <div className="w-full flex gap-4 items-center bg-gray-100 mb-4">
                        <Search handleResetSearch={handleResetSearch} text={text} setText={setText} />
                    </div>

                    <div className="bg-white  pl-6 rounded-xl">
                        <div className="sticky top-0 bg-white">
                            <div className="flex flex-col h-full w-full bg-white rounded-xl mt-4">
                                <div className="flex items-center justify-between  bg-white mb-4">
                                    <div className="flex items-center">
                                        <button className="ml-4">
                                            <Square className="text-gray-400 " size={20}
                                            />
                                        </button>
                                        <button className="ml-5">
                                            <MoreVertical className="text-gray-400" size={20} />
                                        </button>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <span>{activePage} de {totalPages}</span>
                                        <button className="ml-4"
                                        // disabled={activePage === 1}
                                        // onClick={prev}
                                        >
                                            <ArrowLeft className={`transition-colors duration-100 ${activePage === 1 ? "text-gray-400" : "text-gray-800"}`} size={22} />
                                        </button>
                                        <button className="ml-4"
                                        // onClick={next}
                                        // disabled={activePage === totalPages}
                                        >
                                            <ArrowRight className={`transition-colors duration-100 ${activePage === 1 && activePage !== totalPages ? "text-gray-900" : "text-gray-400"}`} size={22}
                                            />
                                        </button>
                                    </div>
                                </div>
                                <Tabs options={categoriasSolicitudes} active={categoriaActiva} handleChangeActive={handleChangeActiveCategory} />
                            </div>
                        </div>
                    </div>


                    <div className="overflow-y-auto bg-white border-b border-gray-300 pb-[1px] h-full">
                        <table className="w-full  ">
                            <tbody>
                                {solicitudesPorEstado[categoriaActiva.slice(0, -1)] && solicitudesPorEstado[categoriaActiva.slice(0, -1)].length > 0 && (
                                    solicitudesPorEstado[categoriaActiva.slice(0, -1)].map((sol) => (
                                        <tr key={sol.id}
                                            className={`group px-6 py-2 cursor-pointer sol hover:text-black relative
                                            ${sol.vista === false ? ' font-semibold bg-gray-100' : ''}`}
                                            onClick={() => handleAbrirSolicitud(sol)}
                                        >
                                            <td className=" p-2 flex items-center">
                                                <div className="text-transparent group-hover:text-gray-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-grip-vertical "><circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" /></svg>
                                                </div>
                                                <button
                                                    className="p-2 rounded-full hover:bg-gray-200 mr-4 text-gray-400/60 group-hover:text-black"
                                                    aria-label="Seleccionar"
                                                    onClick={(e) => e.stopPropagation()} // Evita que el click se propague
                                                >
                                                    <Square size={22} />
                                                </button>
                                                {sol.estado === 'Pendiente' && (
                                                    <div className="flex items-center bg-orange-100 text-gray-800 rounded-lg p-2 mr-2 text-xs gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                                        Pendiente
                                                    </div>
                                                )}
                                                {sol.estado === 'Aceptada' && (
                                                    <div className="flex items-center bg-green-100 text-gray-800 rounded-lg p-2  mr-2 text-xs font-medium gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
                                                        Aceptada
                                                    </div>
                                                )}
                                                {sol.estado === 'Rechazada' && (
                                                    <div className="flex items-center bg-red-100 text-gray-800 rounded-lg p-2 text-xs  mr-2 font-medium gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
                                                        Rechazada
                                                    </div>
                                                )}

                                                {sol.estado === 'Eliminada' && (
                                                    <div className="flex items-center bg-red-100 text-gray-800 rounded-lg p-2 text-xs  mr-2 font-medium gap-2">
                                                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                                        Eliminada
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-2">{sol.responsable} - {sol.unidad}</td>
                                            <td className="p-2">{sol.descripcion}</td>
                                            <td className="p-2">
                                                <div className="flex items-center relative justify-end">
                                                    <div className="text-sm text-right transition-opacity duration-200 group-hover:opacity-0 text-gray-800 flex items-center">
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
                                            </td>
                                        </tr>
                                    ))
                                )
                                }
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Solicitudes;
