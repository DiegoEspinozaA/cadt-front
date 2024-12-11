
import { useEffect, useState } from 'react'
import ImageUploader from './ImageUploader';
export default function FormularioProducto({ productos, setProductos, categorias, areas }) {

    const [busqueda, setBusqueda] = useState('')
    const [busquedaAnterior, setBusquedaAnterior] = useState('')
    const [coincidencias, setCoincidencias] = useState([])
    const [productoSeleccionado, setProductoSeleccionado] = useState(null)
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [cantidadPales, setCantidadPales] = useState('')
    const [nombre, setNombre] = useState('')
    const [categoria, setCategoria] = useState('')
    const [stock, setStock] = useState('')
    const [imagen, setImagen] = useState(null)
    const [mensaje, setMensaje] = useState({ tipo: '', contenido: '' })
    const [loading, setLoading] = useState(false);
    const [searchClick, setSearchClick] = useState(false);
    const [productosExistentes, setProductosExistentes] = useState([]);
    const [descripcion, setDescripcion] = useState('');
    const [bodega, setBodega] = useState('');
    const [area, setArea] = useState('');

    const [imagenKey, setImagenKey] = useState(Date.now());
    const [error, setError] = useState("");


    const buscarProducto = () => {
        setSearchClick(true);
        setProductoSeleccionado(null);
        setBusquedaAnterior(busqueda);
        const resultados = productosExistentes.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));
        setCoincidencias(resultados); if (resultados.length === 0) {
            setMensaje({ tipo: 'info', contenido: 'No se encontraron coincidencias.' });
        } else {
            setMensaje({ tipo: '', contenido: '' });
        }

    };

    const seleccionarProducto = (producto) => {
        setProductoSeleccionado(producto)
        setCoincidencias([])
        setCantidadPales('')
        setMensaje({ tipo: 'info', contenido: 'Producto seleccionado. Ingresa la cantidad de pales.' })
    }

    const iniciarNuevoProducto = () => {
        setProductoSeleccionado(null)
        setNombre(busquedaAnterior)
        setDescripcion('')
        setCategoria('')
        setStock('')
        setBodega('')
        setArea('')
        setImagen(null)
        setMostrarFormulario(true)
        setMensaje({ tipo: 'info', contenido: 'Ingresa los detalles del nuevo producto.' })
    }

    const guardarProducto = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (productoSeleccionado) {
            if (!cantidadPales) {
                setMensaje({ tipo: 'error', contenido: 'Por favor, ingresa la cantidad de pales.' });
                setLoading(false);
                return;
            }
            setMensaje({
                tipo: 'success',
                contenido: `Se han agregado ${cantidadPales} pales al producto ${productoSeleccionado.nombre}.`,
            });
        } else {
            if (!nombre || !stock || !categoria || !descripcion || !area || !bodega) {
                setMensaje({ tipo: 'error', contenido: 'Por favor, completa todos los campos e incluye una imagen.' });
                setLoading(false);
                return;
            }


            const ultimoId = productos.length > 0 ? productos[0].id : 0;
            const nuevoId = ultimoId + 1;
            const nuevoProducto = {
                id: nuevoId,
                nombre,
                stock,
                categoria,
                area: area.nombre,
                bodegaId: bodega,
                descripcion,
                imagen: imagen ? URL.createObjectURL(imagen) : ""
            };

            // Actualizar la lista de productos localmente

            // Crear el FormData para enviar los datos al servidor
            const formData = new FormData();
            formData.append('id', nuevoId);
            formData.append('nombre', nombre);
            formData.append('stock', stock);
            formData.append('categoria', categoria);
            formData.append('descripcion', descripcion);
            formData.append('imagen', imagen); // Agregar la imagen seleccionada
            formData.append('area', area.nombre);
            formData.append('bodegaId', bodega);

            try {
                const response = await fetch('http://localhost:3001/producto', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    setMensaje({
                        tipo: 'success',
                        contenido: `Nuevo producto creado: ${data.nombre}`,
                    });
                    setLoading(false);
                    limpiarFormulario();
                    setProductos([nuevoProducto, ...productos]);

                } else {
                    throw new Error('Error al guardar el producto.');
                }
            } catch (error) {
                setMensaje({ tipo: 'error', contenido: 'Ocurrió un error al guardar el producto.' });
                // Revertir la actualización local si la solicitud falla
                setProductos((prevProductos) => prevProductos.filter((p) => p.id !== nuevoProducto.id));
            }
        }

        setSearchClick(false);
    };



    const limpiarFormulario = () => {
        setBusqueda('')
        setBusquedaAnterior('')
        setCoincidencias([])
        setProductoSeleccionado(null)
        setNombre('')
        setDescripcion('')
        setCategoria('')
        setBodega('')
        setStock('')
        setArea('')
        setCantidadPales('')
        setImagen(null)
        setMensaje({ tipo: '', contenido: '' })
        setSearchClick(false);

        setImagenKey(Date.now());
    }

    const volver = () => {
        setBusqueda('')
        setBusquedaAnterior('')
        setCoincidencias([])
        setProductoSeleccionado(null)
        setNombre('')
        setDescripcion('')
        setCategoria('')
        setBodega('')
        setMostrarFormulario(false);
        setStock('')
        setArea('')
        setCantidadPales('')
        setMensaje({ tipo: '', contenido: '' })
        setSearchClick(false);
    }

    const handleResetSearch = () => {
        setBusqueda('')
        setBusquedaAnterior('')
        setCoincidencias([])
        setProductoSeleccionado(null)
        setNombre('')
        setDescripcion('')
        setBodega('')
        setCategoria('')
        setMostrarFormulario(false);
        setStock('')
        setArea('')
        setCantidadPales('')
        setMensaje({ tipo: '', contenido: '' })
        setSearchClick(false);
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const maxSizeInMB = 0.5; // Límite en MB
            if (file.size / 1024 / 1024 > maxSizeInMB) {
                setError(`La imagen es demasiado grande. Tamaño máximo permitido: ${maxSizeInMB} MB`);
                setImagen(null);
                setImagenKey(Date.now()); // Reinicia el input file
            } else {
                setError(""); // Limpia el error si la imagen es válida
                setImagen(file);
            }
        }
    };


    const changeArea = (e) => {
        console.log(e);
        if (e === "Selecciona una area") {
            setArea(null);
            return;
        }

        const selectedArea = areas.find((area) => area.nombre === e);
        setArea(selectedArea);
    };


    return (
        <div className="max-w-2xl mx-auto  bg-white rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Gestión de productos</h2>
            <div className="mb-6">
                {!mostrarFormulario && (
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Nombre del producto"
                            className="flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-150"
                        />
                        <button
                            onClick={buscarProducto}
                            className="px-4 py-2 flex items-center bg-gray-700 gap-2 text-gray-100  rounded-lg focus:outline-none  "
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                            Buscar
                        </button>
                    </div>
                )}

            </div>

            {!mostrarFormulario && coincidencias.length > 0 && (
                <ul className="mb-4 border border-gray-300 rounded-lg divide-y divide-gray-300 max-h-96 overflow-y-auto">
                    {coincidencias.map((producto) => (
                        <li
                            key={producto.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => seleccionarProducto(producto)}
                        >
                            {producto.nombre}
                        </li>
                    ))}
                </ul>
            )}

            {!mostrarFormulario && !productoSeleccionado && searchClick && coincidencias.length === 0 && (
                <div className="mb-4">
                    <span className='font-bold'>Producto no encontrado</span>
                    <div className='flex justify-between items-center'>
                        <span>No se encontro el producto "{busquedaAnterior}" </span>

                        <button
                            onClick={iniciarNuevoProducto}
                            className="flex items-center  gap-4 px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-900 rounded-lg focus:outline-none  focus:ring-offset-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-plus"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>
                            Crear producto
                        </button>
                    </div>

                </div>
            )}

            {!mostrarFormulario && searchClick && (
                <div className="mb-4 flex gap-4 justify-between">
                    {coincidencias.length > 0 && (
                        <button
                            onClick={iniciarNuevoProducto}
                            className="flex  items-center justify-center  gap-4 px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-900 rounded-lg focus:outline-none  focus:ring-offset-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-plus"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>
                            Crear producto
                        </button>
                    )}


                    {!productoSeleccionado && (
                        <button
                            onClick={handleResetSearch}
                            className='flex  items-center justify-center  gap-4 px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-900 rounded-lg focus:outline-none  focus:ring-offset-2'>
                            Reiniciar</button>
                    )}

                </div>
            )}


            <form onSubmit={guardarProducto} className="space-y-4">
                {productoSeleccionado && (
                    <div>
                        <label htmlFor="cantidadPales" className="block text-sm font-medium text-gray-700">
                            Cantidad de Pales para {productoSeleccionado.nombre}
                        </label>
                        <input
                            id="cantidadPales"
                            type="number"
                            value={cantidadPales}
                            onChange={(e) => setCantidadPales(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-150"
                        />
                    </div>
                )}

                {!productoSeleccionado && mostrarFormulario && (
                    <>
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                id="nombre"
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-150"
                            />
                        </div>

                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                            <input
                                id="stock"
                                type="number"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-150"
                            />
                        </div>

                        <div>
                            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
                            <select
                                id="categoria"
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-150"
                            >
                                <option value="">Selecciona una categoría</option>

                                {categorias.map((categoria) => (
                                    <option key={categoria.id} value={categoria.nombre}>{categoria.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="area" className="block text-sm font-medium text-gray-700">Area</label>
                            <select
                                id="area"
                                value={area?.nombre ? area.nombre : "Selecciona una area"}
                                onChange={(e) => changeArea(e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-150"
                            >
                                <option value="Selecciona una area">Selecciona un area</option>
                                {areas.map((categoria) => (
                                    <option key={categoria.id} value={categoria.nombre}>{categoria.nombre}</option>
                                ))}
                            </select>
                        </div>


                        <div>
                            <label htmlFor="bodega" className="block text-sm font-medium text-gray-700">Bodega</label>
                            <select
                                id="bodega"
                                value={bodega}
                                onChange={(e) => setBodega(e.target.value)}
                                required
                                disabled={!area}
                                className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-150"
                            >
                                <option value="">Selecciona una bodega</option>
                                {area &&
                                    <>
                                        {area.bodegas.map((bodega) => (
                                            <option key={bodega.bodegaId} value={bodega.bodegaId}>{bodega.bodegaId}</option>
                                        ))}
                                    </>
                                }

                            </select>
                        </div>

                        <div>
                            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
                            <input
                                id="descripcion"
                                type="text"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-150"
                            />
                        </div>

                        <ImageUploader
                            label="Sube una imagen del producto"
                            description="Máximo 0.5 MB"
                            accept="image/*"
                            onImageChange={handleImageChange}
                            imagen={imagen}
                            error={error}
                            imagenKey={imagenKey}
                        />
                    </>
                )}


                {(productoSeleccionado || mostrarFormulario) && (
                    <button
                        type="submit"
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-white  transition-colors rounded-lg focus:outline-none ${loading ? 'bg-gray-600 ' : '  bg-blue-400'}`}
                    >
                        {loading ?
                            <svg aria-hidden="true" role="status" class="inline w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                            </svg>
                            :
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-plus"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>
                            </div>
                        }
                        {productoSeleccionado ? 'Agregar' : loading ? 'Creando producto...' : 'Crear Producto'}
                    </button>

                )}
            </form>

            {(productoSeleccionado || mostrarFormulario) && (
                <>
                    <button
                        onClick={limpiarFormulario}
                        className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Limpiar Formulario
                    </button>
                    <button
                        onClick={volver}
                        className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Volver
                    </button>
                </>


            )}
        </div>
    )
}