import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import Search from "../components/Search";

const ProductosDisponibles = ({ productos, openDialog }) => {
    const [busqueda, setBusqueda] = useState('');

    const productosFiltrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const handleResetSearch = () => setBusqueda('');

    return (
        <section className="md:w-1/2 pr-4 flex flex-col h-full border rounded-xl p-4 shadow-md bg-white w-full">
            <Search handleResetSearch={handleResetSearch} text={busqueda} setText={setBusqueda} />
            <div className="flex-grow overflow-y-auto rounded mb-4 mt-4">
                <ul className="space-y-4">
                    {productosFiltrados.map(producto => (
                        <li
                            key={producto.id}
                            onClick={() => openDialog(producto, false)}
                            className="flex items-center space-x-4 p-4 bg-gray-100/50 rounded shadow-md border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                        >
                            {producto.imagen ? (
                                <img
                                    src={producto.imagen}
                                    alt={producto.nombre}
                                    className="w-12 h-12 aspect-auto"
                                />
                            ) : (
                                <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-md">
                                    <ImageIcon className="w-6 h-6 text-gray-500" />
                                </div>
                            )}
                            <div className="flex-grow">
                                <h3 className="font-semibold">{producto.nombre}</h3>
                                <div className="text-gray-600 text-sm">{producto.categoria}</div>
                            </div>
                            <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gray-600'>

                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                            </div>

                        </li>
                    ))}
                </ul>
                {productosFiltrados.length === 0 && (
                    <p className="text-center text-gray-500 mt-4">No se encontraron productos.</p>
                )}
            </div>
        </section>
    );
};

export default ProductosDisponibles;
