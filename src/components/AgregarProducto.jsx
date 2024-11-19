'use client'

import { useState } from 'react'

// Simulación de una base de datos de productos
const productosExistentes = [
    { id: 1, nombre: "Laptop HP", precio: 999.99, categoria: "Electrónicos", stock: 50 },
    { id: 2, nombre: "Smartphone Samsung", precio: 599.99, categoria: "Electrónicos", stock: 100 },
    { id: 3, nombre: "Laptop Dell", precio: 1099.99, categoria: "Electrónicos", stock: 30 },
    { id: 4, nombre: "Tablet Apple", precio: 499.99, categoria: "Electrónicos", stock: 75 },
]

export default function FormularioProducto() {
    const [busqueda, setBusqueda] = useState('')
    const [coincidencias, setCoincidencias] = useState([])
    const [productoSeleccionado, setProductoSeleccionado] = useState(null)
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [cantidadPales, setCantidadPales] = useState('')
    const [nombre, setNombre] = useState('')
    const [precio, setPrecio] = useState('')
    const [categoria, setCategoria] = useState('')
    const [stock, setStock] = useState('')
    const [mensaje, setMensaje] = useState({ tipo: '', contenido: '' })

    const [searchClick, setSearchClick] = useState(false);

    const buscarProducto = () => {
        setSearchClick(true);
        setProductoSeleccionado(null)
        const resultados = productosExistentes.filter(p =>
            p.nombre.toLowerCase().includes(busqueda.toLowerCase())
        )
        setCoincidencias(resultados)
        if (resultados.length === 0) {
            setMensaje({ tipo: 'info', contenido: 'No se encontraron coincidencias.' })
        } else {
            setMensaje({ tipo: '', contenido: '' })
        }
    }

    const seleccionarProducto = (producto) => {
        setProductoSeleccionado(producto)
        setCoincidencias([])
        setCantidadPales('')
        setMensaje({ tipo: 'info', contenido: 'Producto seleccionado. Ingresa la cantidad de pales.' })
    }

    const iniciarNuevoProducto = () => {
        setProductoSeleccionado(null)
        setNombre(busqueda)
        setPrecio('')
        setCategoria('')
        setStock('')
        setMostrarFormulario(true)
        setMensaje({ tipo: 'info', contenido: 'Ingresa los detalles del nuevo producto.' })
    }

    const guardarProducto = (e) => {
        e.preventDefault()
        if (productoSeleccionado) {
            if (!cantidadPales) {
                setMensaje({ tipo: 'error', contenido: 'Por favor, ingresa la cantidad de pales.' })
                return
            }
            // Aquí iría la lógica para actualizar el stock del producto existente
            setMensaje({
                tipo: 'success',
                contenido: `Se han agregado ${cantidadPales} pales al producto ${productoSeleccionado.nombre}.`
            })
        } else {
            if (!nombre || !precio || !categoria || !stock) {
                setMensaje({ tipo: 'error', contenido: 'Por favor, completa todos los campos.' })
                return
            }
            // Aquí iría la lógica para guardar el nuevo producto en la base de datos
            setMensaje({
                tipo: 'success',
                contenido: `Nuevo producto creado: ${nombre}`
            })
        }
        setSearchClick(false);
        limpiarFormulario()
    }

    const limpiarFormulario = () => {
        setBusqueda('')
        setCoincidencias([])
        setProductoSeleccionado(null)
        setNombre('')
        setPrecio('')
        setCategoria('')
        setStock('')
        setCantidadPales('')
        setMensaje({ tipo: '', contenido: '' })
        setSearchClick(false);
    }

    const volver = () => {
        setBusqueda('')
        setCoincidencias([])
        setProductoSeleccionado(null)
        setNombre('')
        setPrecio('')
        setCategoria('')
        setMostrarFormulario(false);
        setStock('')
        setCantidadPales('')
        setMensaje({ tipo: '', contenido: '' })
        setSearchClick(false);
    }

    const handleResetSearch = () => {
        setBusqueda('')
        setCoincidencias([])
        setProductoSeleccionado(null)
        setNombre('')
        setPrecio('')
        setCategoria('')
        setMostrarFormulario(false);
        setStock('')
        setCantidadPales('')
        setMensaje({ tipo: '', contenido: '' })
        setSearchClick(false);
    }

    return (
        <div className="max-w-2xl mx-auto  bg-white rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Gestión de Productos</h2>
            <div className="mb-6">
                {!mostrarFormulario && (
                     <div className="flex space-x-2">
                     <input
                         type="text"
                         value={busqueda}
                         onChange={(e) => setBusqueda(e.target.value)}
                         placeholder="Nombre del producto"
                         className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <ul className="mb-4 border border-gray-300 rounded-lg divide-y divide-gray-300">
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
                        <span>No se encontro el producto "{busqueda}" </span>

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
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="precio" className="block text-sm font-medium text-gray-700">Precio</label>
                            <input
                                id="precio"
                                type="number"
                                value={precio}
                                onChange={(e) => setPrecio(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
                            <select
                                id="categoria"
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Selecciona una categoría</option>
                                <option value="Electrónicos">Electrónicos</option>
                                <option value="Ropa">Ropa</option>
                                <option value="Alimentos">Alimentos</option>
                                <option value="Hogar">Hogar</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                            <input
                                id="stock"
                                type="number"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </>
                )}

                {(productoSeleccionado || mostrarFormulario) && (
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        {productoSeleccionado ? 'Agregar' : 'Crear Producto'}
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