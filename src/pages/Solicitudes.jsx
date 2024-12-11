import React, { useState, useEffect } from "react";
import Tabs from '../components/Tabs';
import Search from "../components/Search";
import { Square, MoreVertical, ArrowLeft, ArrowRight, CheckCircle, Trash2, Inbox, Clock, XCircle, Loader } from 'lucide-react'
import SolicitudesTable from '../components/SolicitudesTable';
import SolicitudDetalleModal from '../components/SolicitudDetalleModal';


const categoriasSolicitudes = [
    { id: 1, nombre: "Todas", icon: <Inbox size={18} /> },
    { id: 2, nombre: "Pendientes", icon: <Clock size={18} /> },
    { id: 3, nombre: "Aceptadas", icon: <CheckCircle size={18} /> },
    { id: 4, nombre: "Rechazadas", icon: <XCircle size={18} /> },
    { id: 5, nombre: "Eliminadas", icon: <Trash2 size={18} /> },
]

function Solicitudes() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [categoriaActiva, setCategoriaActiva] = useState("Todas");
    const [inventario, setInventario] = useState([]);

    const [cantidadSolicitudesTotales, setCantidadSolicitudesTotales] = useState({}); // [setCantidadSolicitudesTotales]
    const [animateCheck, setAnimateCheck] = useState(false);
    const [animateX, setAnimateX] = useState(false);

    const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
    const [cantidadesEditadas, setCantidadesEditadas] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const closeModal = () => setSolicitudSeleccionada(null);
    const [activePage, setActivePage] = useState(1);



    // Busqueda de solicitud
    const [text, setText] = useState("");
    const handleResetSearch = () => {
        setText("");
    };

    const [editingProductId, setEditingProductId] = useState(null);


    const solicitudesFiltradas = categoriaActiva === "Todas"
        ? solicitudes.filter(solicitud => solicitud.eliminada !== true)
        : categoriaActiva === "Eliminadas"
            ? solicitudes.filter(solicitud => solicitud.eliminada === true)
            : solicitudes.filter(solicitud => solicitud.estado === categoriaActiva.slice(0, -1) && solicitud.eliminada !== true);

    // Paginación
    const totalPages = Math.ceil(solicitudesFiltradas.length / 50) === 0 ? 1 : Math.ceil(solicitudesFiltradas.length / 50);

    const solicitudesPaginadas = solicitudesFiltradas.slice(
        (activePage - 1) * 50,
        activePage * 50
    );
    const next = () => {
        if (activePage < totalPages) {
            setActivePage((prev) => prev + 1);
        }
    };
    const prev = () => {
        if (activePage > 1) {
            setActivePage((prev) => prev - 1);
        }
    };


    const handleChangeActiveCategory = (categoria) => {
        setCategoriaActiva(categoria);
        setActivePage(1);
    };


    useEffect(() => {
        // const token = localStorage.getItem('token');

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [solicitudesRes, productosRes, categoriasTotalesRes] = await Promise.all([
                    // fetch('http://localhost:3001/solicitudes', { //con proyeccion de token (timepo)
                    //     method: 'GET',
                    //     headers: {
                    //         'Authorization': `Bearer ${token}`, // Incluir el token en el encabezado
                    //     },
                    // }),

                     fetch('http://localhost:3001/solicitudes', {
                        method: 'GET',
                     
                    }),
                    
                    fetch('http://localhost:3001/productos', {
                        method: 'GET',
                    }),
                    fetch('http://localhost:3001/solicitudes-categorias-totales', {
                        method: 'GET',
                    }),
                ]);

                if (!solicitudesRes.ok || !productosRes.ok || !categoriasTotalesRes.ok) {
                    throw new Error('Error al cargar datos');
                }

                const solicitudes = await solicitudesRes.json();
                const productos = await productosRes.json();
                const categoriasTotales = await categoriasTotalesRes.json();
                setSolicitudes(solicitudes);
                setInventario(productos);
                setCantidadSolicitudesTotales(categoriasTotales);

            } catch (error) {
                console.error('Error al obtener los datos:', error);
                alert('Hubo un problema al cargar los datos. Por favor, intenta de nuevo.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);


    useEffect(() => {
        const socket = new WebSocket('ws://localhost:3002');

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const { id } = message;

            setSolicitudes((prevData) => {
                const existingSolicitudIndex = prevData.findIndex(s => s.id === id);
                let updatedSolicitudes;

                if (existingSolicitudIndex >= 0) {
                    updatedSolicitudes = [...prevData];
                    const solicitudAnterior = prevData[existingSolicitudIndex];
                    updatedSolicitudes[existingSolicitudIndex] = message;
                } else {
                    updatedSolicitudes = [...prevData, message];
                    setCantidadSolicitudesTotales((prev) => ({
                        Todas: (prev.Todas || 0) + 1,
                        Pendientes: (prev.Pendientes || 0) + 1,
                        Aceptadas: (prev.Aceptadas || 0),
                        Eliminadas: (prev.Eliminadas || 0),
                    }));
                }
                return updatedSolicitudes.sort((a, b) => b.id - a.id);
            });
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            if (socket.readyState === 1) {
                socket.close();
            }
        };
    }, []);


    // Función para manejar los cambios en las cantidades de los productos a entregar
    const handleCantidadChange = (id, nuevaCantidad) => {
        if (nuevaCantidad === '') return;
        setCantidadesEditadas((prevCantidades) => ({
            ...prevCantidades,
            [id]: nuevaCantidad,
        }));

    };


    const handleAprobar = async (sol, id) => {

        setCantidadSolicitudesTotales({
            ...cantidadSolicitudesTotales,
            Aceptadas: (cantidadSolicitudesTotales.Aceptadas || 0) + 1,
            Pendientes: (cantidadSolicitudesTotales.Pendientes || 0) - 1,
        });

        setAnimateCheck(true);
        const fecha_revision = new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        });

        if (solicitudSeleccionada && solicitudSeleccionada.id === id) {
            const productosActualizados = solicitudSeleccionada.productos.map(producto => {
                const cantidadEntregada = cantidadesEditadas[producto.id] || 0;
                return {
                    ...producto,
                    cantidad_entregada: cantidadEntregada,
                };
            });

            setSolicitudSeleccionada(prev => ({
                ...prev,
                estado: "Aceptada",
                fecha_revision: fecha_revision,
                productos: productosActualizados,
            }));
        }

        const nuevasSolicitudes = solicitudes.map(solicitud => {
            if (solicitud.id === id) {
                const productosActualizados = solicitud.productos.map(producto => {
                    const cantidadEntregada = cantidadesEditadas[producto.id] || 0;
                    return {
                        ...producto,
                        cantidad_entregada: cantidadEntregada,
                    };
                });

                return {
                    ...solicitud,
                    estado: "Aceptada",
                    fecha_revision: fecha_revision,
                    productos: productosActualizados,
                };
            }
            return solicitud;
        });

        setSolicitudes(nuevasSolicitudes);

        try {
            const solicitudActualizada = nuevasSolicitudes.find(solicitud => solicitud.id === id);
            const response = await fetch(`http://localhost:3001/solicitudes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    estado: solicitudActualizada.estado,
                    fecha_revision: solicitudActualizada.fecha_revision,
                    productos: solicitudActualizada.productos,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar la solicitud en el backend.');
            }

            const result = await response.json();
        } catch (error) {
            alert('Hubo un problema al actualizar la solicitud en el backend.');
        }
    };



    const handleRechazarSolicitud = async (sol, id) => {
        setAnimateX(true);

        setCantidadSolicitudesTotales({
            ...cantidadSolicitudesTotales,
            Rechazadas: (cantidadSolicitudesTotales.Rechazadas || 0) + 1,
            Pendientes: (cantidadSolicitudesTotales.Pendientes || 0) - 1,
        });

        const cantidadesReseteadas = Object.keys(cantidadesEditadas).reduce((acc, key) => {
            acc[key] = 0;
            return acc;
        }, {});

        setCantidadesEditadas(cantidadesReseteadas);

        const fecha_revision = new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        });

        if (solicitudSeleccionada && solicitudSeleccionada.id === id) {
            const productosActualizados = solicitudSeleccionada.productos.map(producto => ({
                ...producto,
                cantidad_entregada: 0,
            }));

            setSolicitudSeleccionada(prev => ({
                ...prev,
                estado: "Rechazada",
                fecha_revision: fecha_revision,
                productos: productosActualizados,
            }));
        }

        const nuevasSolicitudes = solicitudes.map(solicitud => {
            if (solicitud.id === id) {
                const productosActualizados = solicitud.productos.map(producto => ({
                    ...producto,
                    cantidad_entregada: 0,
                }));

                return {
                    ...solicitud,
                    estado: "Rechazada",
                    fecha_revision: fecha_revision,
                    productos: productosActualizados,
                };
            }
            return solicitud;
        });

        setSolicitudes(nuevasSolicitudes);

        try {
            const solicitudActualizada = nuevasSolicitudes.find(solicitud => solicitud.id === id);
            const response = await fetch(`http://localhost:3001/solicitudes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    estado: solicitudActualizada.estado,
                    fecha_revision: solicitudActualizada.fecha_revision,
                    productos: solicitudActualizada.productos,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar la solicitud en el backend.');
            }
            const result = await response.json();
        } catch (error) {
            alert('Hubo un problema al actualizar la solicitud en el backend.');
        }
    };



    const handleEliminarSolicitud = async (sol, id) => {

        if (sol.eliminada === true) {
            return
        }

        setCantidadSolicitudesTotales({
            ...cantidadSolicitudesTotales,
            Todas: cantidadSolicitudesTotales.Todas -= 1,
            Eliminadas: cantidadSolicitudesTotales.Eliminadas += 1,
            [`${sol.estado}s`]: cantidadSolicitudesTotales[`${sol.estado}s`] -= 1
        });

        const fecha_revision = new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        });

        const nuevasSolicitudes = solicitudes.map(s => {
            if (id === s.id) {
                return { ...s, eliminada: true, fecha_revision: fecha_revision };
            }
            return s;
        });

        setSolicitudes(nuevasSolicitudes);

        try {
            const response = await fetch(`http://localhost:3001/solicitudes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    eliminada: true,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la solicitud en el backend');
            }
            const result = await response.json();
        } catch (error) {
            setSolicitudes(solicitudes);
            alert('Hubo un problema al eliminar la solicitud. Se han revertido los cambios.');
        }
    };





    const handleSave = (solId, productId) => {
        let indexOfSol = solicitudes.findIndex(s => s.id === solId);

        if (indexOfSol === -1) {
            console.error("No se encontró la solicitud con el ID proporcionado.");
            return;
        }

        let updatedSolicitud = { ...solicitudes[indexOfSol] };

        updatedSolicitud.productos = updatedSolicitud.productos.map(producto => {
            if (producto.id === productId) {
                return {
                    ...producto,
                    cantidad_entregada: cantidadesEditadas[productId] || 0,
                };
            }
            return producto;
        });

        let updatedSolicitudes = [...solicitudes];
        updatedSolicitudes[indexOfSol] = updatedSolicitud;

        setSolicitudes(updatedSolicitudes);
        setSolicitudSeleccionada(updatedSolicitud);
        setEditingProductId(null);
    };



    const handleRechazarProducto = (solId, productId) => {
        setCantidadesEditadas((prevCantidades) => ({
            ...prevCantidades,
            [productId]: 0
        }))

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


    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);

    const handleAbrirSolicitud = (solicitud) => {
        if (solicitud.fecha_revision !== null) {
            setAnimateCheck(false);
            setAnimateX(false);
        }
        setCantidadesEditadas(
            solicitud.productos.reduce((acc, producto) => {
                acc[producto.id] = producto.cantidad_entregada !== null
                    ? producto.cantidad_entregada
                    : producto.cantidad_solicitada;
                return acc;
            }, {})
        );


        setSolicitudSeleccionada(solicitud);
        setIsOpen(true);

        setSolicitudes((prevSolicitudes) =>
            prevSolicitudes.map((item) =>
                item.id === solicitud.id ? { ...item, vista: true } : item
            )
        );

        if (solicitud.vista === true) {
            return;
        }

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

    const handleReevaluar = async (sol, id) => {
        setAnimateCheck(true);
        const solicitud = solicitudSeleccionada || sol; // Usa solicitudSeleccionada si existe, sino sol
        setCantidadSolicitudesTotales((prev) => ({
            ...prev,
            Total: (prev.Total || 0) + 1, // Incrementar Total
            [`${solicitud.estado}s`]: (prev[`${solicitud.estado}s`] || 0) - 1, // Decrementar el estado actual
            Pendientes: (prev.Pendientes || 0) + 1, // Incrementar Pendientes
        }));

        const nuevasSolicitudes = solicitudes.map((solicitud) =>
            solicitud.id === id
                ? {
                    ...solicitud,
                    estado: "Pendiente",
                    fecha_revision: null,
                }
                : solicitud
        );

        setSolicitudes(nuevasSolicitudes);
        if (solicitudSeleccionada && solicitudSeleccionada.id === id) {
            setSolicitudSeleccionada((prev) => ({
                ...prev,
                estado: "Pendiente",
                fecha_revision: null,
            }));
        }

        try {
            const response = await fetch(`http://localhost:3001/solicitudes/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    estado: "Pendiente",
                    fecha_revision: null, // Reinicia la fecha en el servidor
                }),
            });

            if (!response.ok) {
                throw new Error("Error al reevaluar la solicitud");
            }
            const updatedSolicitud = await response.json();
        } catch (error) {
            alert("Hubo un problema al reevaluar la solicitud. Por favor, inténtalo de nuevo.");
        }
    };






    return (
        <>
            <div className='flex flex-col h-full '>
                <div className="w-full flex gap-4 items-center  mb-4">
                    <Search handleResetSearch={handleResetSearch} text={text} setText={setText} />
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader size={40} className="animate-spin text-gray-600" />
                        <p className="ml-4 text-gray-600">Cargando datos...</p>
                    </div>
                ) : (
                    <div className="flex-grow flex flex-col  overflow-hidden bg-white w-full">
                        <div className="pl-6 rounded-xl">
                            <div className="sticky top-0 bg-white">
                                <div className="flex flex-col h-full w-full bg-white rounded-xl mt-4">
                                    <div className="flex items-center justify-between  bg-white mb-4">
                                        <div className="flex items-center">
                                            <button className="text-gray-800 hover:bg-gray-200 p-1 rounded-lg ml-3">
                                                <Square className=" " size={20}
                                                />
                                            </button>
                                            <button className="ml-5">
                                                <MoreVertical className="text-gray-400" size={20} />
                                            </button>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span>{activePage} de {totalPages}</span>
                                            <button className="ml-4"
                                                disabled={activePage === 1}
                                                onClick={prev}
                                            >
                                                <ArrowLeft className={`transition-colors duration-100 ${activePage === 1 ? "text-gray-400" : "text-gray-800"}`} size={22} />
                                            </button>
                                            <button className="ml-4 mr-4"
                                                onClick={next}
                                                disabled={activePage === totalPages}
                                            >
                                                <ArrowRight className={`transition-colors duration-100 ${activePage === 1 && activePage !== totalPages ? "text-gray-900" : "text-gray-400"}`} size={22}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                    <Tabs options={categoriasSolicitudes} active={categoriaActiva} handleChangeActive={handleChangeActiveCategory} cantidadSolicitudesTotales={cantidadSolicitudesTotales} />
                                </div>
                            </div>
                        </div>
                        <SolicitudesTable
                            solicitudes={solicitudesPaginadas}
                            handleAbrirSolicitud={handleAbrirSolicitud}
                            handleAprobar={handleAprobar}
                            handleRechazarSolicitud={handleRechazarSolicitud}
                            handleEliminarSolicitud={handleEliminarSolicitud}
                            handleReevaluar={handleReevaluar}
                        />
                    </div>



                )}
            </div>



            {solicitudSeleccionada && (
                <SolicitudDetalleModal
                    open={isOpen}
                    handleClose={handleClose}
                    solicitudSeleccionada={solicitudSeleccionada}
                    closeModal={closeModal}
                    handleAprobar={handleAprobar}
                    handleRechazarSolicitud={handleRechazarSolicitud}
                    handleReevaluar={handleReevaluar}
                    editingProductId={editingProductId}
                    handleCantidadChange={handleCantidadChange}
                    handleSave={handleSave}
                    handleRechazarProducto={handleRechazarProducto}
                    handleAprobarProducto={handleAprobarProducto}
                    animateCheck={animateCheck}
                    animateX={animateX}
                    inventario={inventario}
                    cantidadesEditadas={cantidadesEditadas}
                    setEditingProductId={setEditingProductId}
                    isEditable={true}
                />
            )}

        </>
    );
}

export default Solicitudes;

