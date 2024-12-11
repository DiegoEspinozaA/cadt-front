import { useState, useEffect } from 'react'
import { ClipboardList, History } from "lucide-react";
import { HistorialSolicitudes } from '../components/HistorialSolicitudes';
import ProductosDisponibles from '../components/ProductosDisponibles';
import ProductosSeleccionados from '../components/ProductosSeleccionados';
import FormularioProductoModal from '../components/FormularioProductoModal';
import EnviarSolicitudButton from '../components/EnviarSolicitudButton';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';


const ESTADO = "Pendiente";
const VISTA = false;

export default function SolicitudSimplificada() {
    const [user, setUser] = useState(null);
    
    const [solicitud, setSolicitud] = useState({
        fecha: '',
        fecha_revision: '',
        estado: ESTADO,
        responsable: '',
        unidad: '',
        descripcion: '',
        vista: VISTA,
        eliminada: false,
        productos: []
    })

    const [solicitudes, setSolicitudes] = useState([]);

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token); // Decodificar el token
        setUser({
          nombre: decoded.nombre,
          rut: decoded.rut,
          rol: decoded.rol,
          foto: decoded.foto,
      
        });

        setSolicitud(prevSolicitud => ({
            ...prevSolicitud, // Mantener los valores anteriores
            unidad: decoded.area, // Cambiar el valor de unidad
            responsable: decoded.nombre // Cambiar el valor de responsable
        }));
      }
    }, []);


    const [isSending, setIsSending] = useState(false);
    const [busqueda, setBusqueda] = useState('')
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([])
    const [productoSeleccionado, setProductoSeleccionado] = useState(null)
    const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1)



    useEffect(() => {
        const fetchData = async () => {
            if (!user || !user.rut) {
                return; // No realizar la petición si el usuario no está listo
            }
    
            try {
                const productosResponse = await fetch('http://localhost:3001/productos');
                const solicitudesResponse = await fetch(`http://localhost:3001/solicitudes-empleado/${user.rut}`);
    
                if (productosResponse.ok && solicitudesResponse.ok) {
                    const productosData = await productosResponse.json();
                    const solicitudesData = await solicitudesResponse.json();
    
                    setProductos(productosData);
                    setProductosFiltrados(productosData);
                    setSolicitudes(solicitudesData);
                } else {
                    throw new Error('Error al obtener datos del servidor.');
                }
            } catch (error) {
                console.error(error.message);
            }
        };
    
        fetchData();
    }, [user]); // Ahora depende de `user`
    


    useEffect(() => {
        const filtrados = productos.filter(producto =>
            producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
        )
        setProductosFiltrados(filtrados)
    }, [busqueda])


    const enviarSolicitud = async (e) => {
        e.preventDefault();
        setIsSending(true);

        const solicitudConFecha = {
            ...solicitud,
            fecha: new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            }),
        };

        try {
            const response = await fetch('http://localhost:3001/solicitudes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(solicitudConFecha),
            });

            if (response.ok) {
                setIsSending(false);
                handleReiniciar();
                alert('Solicitud enviada con éxito!');

            } else {
                alert('Hubo un error al enviar la solicitud.');
            }
        } catch (error) {
            alert('Error de red al enviar la solicitud.');
        } finally {
            // Desactiva el estado de carga
        }
    };

    const handleReiniciar = () => {
        setSolicitud({
            fecha: '',
            fecha_revision: '',
            estado: ESTADO,
            responsable: 'Jadier Espinoza Varas',
            unidad: 'Unidad 1',
            descripcion: 'Solicitamos los siguientes productos para reabastecer el box 1 con la peticion mensual, necesitamos con urgencia los productos',
            vista: VISTA,
            productos: [],
            eliminada: false
        })
    }
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const closeDialog = () => {
        setCantidadSeleccionada(1);
        setIsDialogOpen(false);
    }

    const [currentProduct, setCurrentProduct] = useState(null);
    const [quantity, setQuantity] = useState(1)

    const openDialog = (producto, editing = false) => {
        setCurrentProduct(producto);
        setProductoSeleccionado(producto);
        setIsEditing(editing);
        setIsDialogOpen(true);
        setCantidadSeleccionada(editing ? producto.cantidad_solicitada : 1);
    };


    const [isEditing, setIsEditing] = useState(false);

    const deleteFromList = (id) => {
        setSolicitud(prev => ({
            ...prev,
            productos: prev.productos.filter(p => p.id !== id),
        }));
    }
    const addToList = () => {
        if (currentProduct) {
            if (isEditing) {
                // Actualizar producto en la lista
                setSolicitud(prev => ({
                    ...prev,
                    productos: prev.productos.map(p =>
                        p.id === currentProduct.id ? { ...p, cantidad_solicitada: cantidadSeleccionada } : p
                    ),
                }));
            } else {
                // Agregar producto nuevo
                setSolicitud(prev => ({
                    ...prev,
                    productos: [
                        ...prev.productos,
                        {
                            id: currentProduct.id,
                            nombre: currentProduct.nombre,
                            cantidad_solicitada: cantidadSeleccionada,
                            cantidad_entregada: '',
                            categoria: currentProduct.categoria,
                            imagen: currentProduct.imagen,

                        },
                    ],
                }));
            }
            setIsDialogOpen(false);
            setCurrentProduct(null);
            setQuantity(1);
            setIsEditing(false);
        }
    };

    const [activeTab, setActiveTab] = useState('historial');
    const handleTabChange = (tab) => {
        setActiveTab(tab); // Cambia la pestaña activa
    };



    return (
        <>
            <div className="flex flex-col h-full ">
                <header className="flex space-x-4 mb-6 justify-between">
                    <div className='flex items-center gap-2'>
                        <button
                            onClick={() => handleTabChange('historial')}
                            className={`flex items-center gap-2 px-4 py-2 font-medium transition-all border-b-4 ${activeTab === 'historial'
                                ? 'border-gray-700 text-gray-800 shadow-sm'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <History
                                className={`w-5 h-5 transition-transform ${activeTab === 'historial' ? 'text-gray-800 ' : 'text-gray-500'
                                    }`}
                            />
                            Historial de solicitudes
                        </button>

                        <button
                            onClick={() => handleTabChange('nueva')}
                            className={`flex items-center gap-2 px-4 py-2 font-medium transition-all border-b-4 ${activeTab === 'nueva'
                                ? 'border-gray-700 text-gray-800 shadow-sm'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <ClipboardList
                                className={`w-5 h-5 transition-transform ${activeTab === 'nueva' ? 'text-gray-800 ' : 'text-gray-500'
                                    }`}
                            />
                            Nueva Solicitud
                        </button>
                    </div>

            
                </header>

                {activeTab === 'nueva' &&
                    <>
                        <div className="flex-grow flex flex-col md:flex-row overflow-hidden gap-6">
                            <ProductosDisponibles
                                productos={productosFiltrados}
                                openDialog={openDialog}
                            />
                            <ProductosSeleccionados
                                productos={solicitud.productos}
                                openDialog={openDialog}
                                deleteFromList={deleteFromList}
                                handleReiniciar={handleReiniciar}
                            />
                        </div>

                        <EnviarSolicitudButton
                            enviarSolicitud={enviarSolicitud}
                            isSending={isSending}
                            productos={solicitud.productos}
                        />
                        <FormularioProductoModal
                            isDialogOpen={isDialogOpen}
                            closeDialog={closeDialog}
                            productoSeleccionado={productoSeleccionado}
                            cantidadSeleccionada={cantidadSeleccionada}
                            setCantidadSeleccionada={setCantidadSeleccionada}
                            addToList={addToList}
                            isEditing={isEditing}
                        />
                    </>
                }

                {activeTab === 'historial' &&
                    (
                        <div className='flex-grow flex flex-col md:flex-row overflow-hidden gap-6 '>
                            <section className="flex flex-col h-full border rounded-xl p-4  bg-white w-full">
                                <HistorialSolicitudes solicitudes={solicitudes} />

                            </section>
                        </div>
                    )
                }
            </div>
        </>

    )
}



