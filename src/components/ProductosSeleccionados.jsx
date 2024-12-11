import { ImageIcon, Minus } from "lucide-react";

const ProductosSeleccionados = ({ productos, openDialog, deleteFromList, handleReiniciar }) => (

    <section className="md:w-1/2 pr-4 flex flex-col h-full border rounded-xl p-4 shadow-md bg-white w-full">
        <div className="ml-2 p-2 flex items-center">
            <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2 text-2xl">
                    Productos solicitados
                </span>
                <button
                    onClick={handleReiniciar}
                    className={`hover:bg-gray-100 flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 transition-colors duration-200 ${productos.length === 0
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-red-500 hover:text-red-700'
                        }`}
                    disabled={productos.length === 0}
                >
                    Reiniciar
                </button>
            </div>
        </div>
        <div className="flex-grow overflow-y-auto rounded mb-4 mt-4">
            {productos.length === 0 ? (
                <p className="ml-7 text-gray-400">No hay productos seleccionados</p>
            ) : (
                <ul className="space-y-4">
                    {productos.map((producto, index) => (
                        <li
                            key={producto.id}
                            onClick={(e) => {
                                e.stopPropagation();
                                openDialog(producto, true);
                            }}
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
                            <span className="font-bold text-lg w-8 text-center">{producto.cantidad_solicitada}</span>
                            <button
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-400 hover:bg-red-500 text-gray-100 p-2 rounded-full"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteFromList(producto.id);
                                }}
                            >
                                <Minus size={16} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    </section>
);

export default ProductosSeleccionados;
