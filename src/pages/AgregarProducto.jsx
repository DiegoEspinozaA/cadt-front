import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar';
import CloseButton from '../components/buttons/CloseButton';

const normalizeString = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const searchWordsInString = (searchStr, targetStr) => {
    const searchWords = searchStr.split(' ');
    const targetWords = targetStr.split(' ');

    return searchWords.every(word =>
        targetWords.some(targetWord => targetWord.includes(word))
    );
};


let palesExistentes = [
    {
        id: 1, fecha_ingreso: "2022-01-01", cantidad: 10, producto: { id: 1, nombre: "Guantes de látex", categoria: "Protección" },
    }
]
let productosExistentes = [
    { id: 1, nombre: "Guantes de látex", categoria: "Protección" },
    { id: 2, nombre: "Jeringas", categoria: "Instrumental" },
]

function AgregarProducto() {
    const [nuevoProducto, setNuevoProducto] = useState({ nombre: "", categoria: "" })
    const [productoSeleccionado, setProductoSeleccionado] = useState({ nombre: "", categoria: "" })

    const [pale, setPale] = useState({ id: "", fecha_ingreso: "", cantidad: "", producto: {} });
    const [listaPales, setListaPales] = useState(palesExistentes);

    const [productosAgregados, setProductosAgregados] = useState([])
    const [resultadosBusqueda, setResultadosBusqueda] = useState([])

    console.log(pale);
    useEffect(() => {
        if (productoSeleccionado.nombre && !seleccionoProducto) {
            const normalizedSearchTerm = normalizeString(productoSeleccionado.nombre);

            const resultados = productosExistentes.filter(producto => {
                const normalizedProductName = normalizeString(producto.nombre);
                return searchWordsInString(normalizedSearchTerm, normalizedProductName);
            });

            setResultadosBusqueda(resultados);
        } else {
            setResultadosBusqueda([]);
        }
    }, [productoSeleccionado.nombre]);


    const crearProducto = (e) => {
        e.preventDefault()
        const nuevoId = productosExistentes.length + 1
        const productoCreado = { id: nuevoId, ...nuevoProducto }
        productosExistentes = [...productosExistentes, productoCreado]
        setNuevoProducto({ nombre: "", categoria: "" })
        setResultadosBusqueda([])
        alert("Producto creado con éxito")
    }

    const agregarPale = (e) => {
        e.preventDefault()

        setListaPales([...listaPales, pale])
        // setPale({ id: "", fecha_ingreso: "", cantidad: "", producto: {} })
    }

    const agregarProductoInventario = (e) => {
        e.preventDefault()
        if (!productoSeleccionado.nombre || !productoSeleccionado.cantidadPales || !productoSeleccionado.categoria) {
            alert("Por favor, seleccione un producto, seleccione una categoria y especifique la cantidad de pales")
            return
        }
        const producto = productosExistentes.find(p => p.id === parseInt(productoSeleccionado))
        setProductosAgregados([...productosAgregados, { ...producto }])
        setProductoSeleccionado({ nombre: "", categoria: "", cantidadPales: 0 })
    }

    const eliminarProductoAgregado = (index) => {
        const nuevosProductosAgregados = productosAgregados.filter((_, i) => i !== index)
        setProductosAgregados(nuevosProductosAgregados)
    }

    const [seleccionoProducto, setSeleccionoProducto] = useState(false)

    const reiniciarSeleccionarProducto = () => {
        setSeleccionoProducto(false);
        setProductoSeleccionado({ nombre: "", categoria: "" })
        setResultadosBusqueda([])

    }
    const seleccionarProductoExistente = (producto) => {
        setProductoSeleccionado(producto);
        setPale({ ...pale, producto: producto });
        setSeleccionoProducto(true)
        setResultadosBusqueda([])
        console.log(resultadosBusqueda)
    }

    return (
        <div className='bg-white h-full'>
            <div className="flex gap-6 items-center mb-6 ">
                <button className='flex gap-2 bg-gray-100 border border-gray-300 shadow-sm px-4 py-2 rounded-lg'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>

                    Crear producto
                </button>
                <button className='flex gap-2 bg-gray-200 p-1'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                    </svg>
                    Agregar categoria


                </button>

            </div>

            <div className='flex justify-center'>

                <div className="container p-4 space-y-6">
                    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-300">
                        <h2 className="text-xl font-bold mb-4">Crear Nuevo Producto</h2>
                        <form onSubmit={crearProducto} className="space-y-4">
                            <div>
                                <label htmlFor="nombreProducto" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                                <div className='relative'>

                                    <input
                                        id="nombreProducto"
                                        type="text"
                                        value={nuevoProducto.nombre}
                                        onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
                                        placeholder="Ingrese el nombre del producto"
                                        className="mt-1 w-full py-2 px-4 flex items-center border border-gray-300 rounded-lg  hover:border-gray-400 transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
                                        required
                                    />
                                    {nuevoProducto.nombre.length > 0 &&
                                        <CloseButton
                                            onClick={() => setNuevoProducto({ ...nuevoProducto, nombre: "" })}
                                        />}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="categoriaProducto" className="block text-sm font-medium text-gray-700">Categoría</label>
                                <div className='relative'>
                                    <input
                                        id="categoriaProducto"
                                        type="text"
                                        value={nuevoProducto.categoria}
                                        onChange={(e) => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })}
                                        placeholder="Ingrese la categoría del producto"
                                        className="mt-1 w-full py-2 px-4 flex items-center border border-gray-300 rounded-lg  hover:border-gray-400 transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
                                        required
                                    />

                                </div>
                            </div>
                            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Crear Producto
                            </button>
                        </form>
                    </div>




                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Agregar producto al inventario</h2>
                        <form onSubmit={agregarPale} className="space-y-4">
                            <div>
                                <label htmlFor="productoSelect" className="block text-sm font-medium text-gray-700">Seleccionar Producto</label>
                                <div className='relative'>
                                    <input
                                        autoComplete='off'
                                        id="productoSelect"
                                        value={(seleccionoProducto ? productoSeleccionado.nombre + " - " + productoSeleccionado.categoria : productoSeleccionado.nombre)}
                                        disabled={seleccionoProducto}
                                        placeholder='Ingrese el nombre del producto'
                                        onChange={(e) => setProductoSeleccionado({ ...productoSeleccionado, nombre: e.target.value })}
                                        className="mt-1 w-full py-2 px-4 flex items-center border border-gray-300 rounded-lg  hover:border-gray-400 transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
                                        required
                                    >
                                    </input>
                                    {productoSeleccionado.nombre.length > 0 &&
                                        <CloseButton
                                            onClick={reiniciarSeleccionarProducto}
                                        />}

                                    {(resultadosBusqueda.length > 0 && setSeleccionoProducto) && (
                                        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg">
                                            {resultadosBusqueda.map((producto) => (
                                                <li
                                                    key={producto.id}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => seleccionarProductoExistente(producto)}
                                                >
                                                    {producto.nombre} - {producto.categoria}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="cantidadPales" className="block text-sm font-medium text-gray-700">Cantidad de Pales</label>
                                <input
                                    id="cantidadPales"
                                    type="number"
                                    value={pale.cantidad}
                                    onChange={(e) => setPale({ ...pale, cantidad: e.target.value })}
                                    placeholder="Ingrese la cantidad de pales"
                                    className="mt-1 w-full py-2 px-4 flex items-center border border-gray-300 rounded-lg  hover:border-gray-400 transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
                                    required
                                />

                            </div>
                            <button type="submit" className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Agregar al Inventario
                            </button>
                        </form>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Productos Agregados al Inventario</h2>
                        {listaPales.length > 0 ? (
                            <ul className="space-y-2">
                                {listaPales.map((pale, index) => (
                                    <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                                        <span>{pale.id} - {pale.fecha_ingreso} - {pale.cantidad} pales {pale.producto.nombre} - {pale.producto.categoria}</span>
                                        <button
                                            onClick={() => eliminarProductoAgregado(index)}
                                            className="text-red-500 hover:text-red-700 focus:outline-none"
                                            aria-label="Eliminar producto"
                                        >
                                            {/* <XIcon className="h-5 w-5" /> */}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No hay productos agregados al inventario.</p>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}

export default AgregarProducto;
