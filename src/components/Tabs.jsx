export default function Tabs({
    options,
    active,
    handleChangeActive,
    cantidadSolicitudesTotales
}) {
    return (
        <div className="text-sm font-semibold text-gray-500 border-b border-gray-200">
            <ul className="w-full">
                {options.map((option) => (
                    <li key={option.id} className="inline-block">
                        <button
                            onClick={() => handleChangeActive(option.nombre)}
                            className={`flex items-center gap-3 ${active === option.nombre
                                    ? 'text-gray-700 border-b-2 border-gray-700'
                                    : 'text-gray-500/80 border-b-2 border-gray-100'
                                } p-4 rounded-t-lg hover:bg-gray-100 inline-flex items-center space-x-2 select-none transition-all duration-200 ease-in-out`}
                        >
                            <div className="flex items-center gap-2">
                                <span>{option.icon}</span>
                                <span>{option.nombre}</span>
                            </div>

                            {/* Mostrar el contador si hay solicitudes no vistas */}
                            <span
                                className={`text-xs rounded-lg p-1 ${active === option.nombre
                                        ? 'text-gray-700 opacity-100'
                                        : 'text-gray-500 opacity-50'
                                    }`}
                            >
                                {cantidadSolicitudesTotales[option.nombre] || <p>&nbsp;</p>}
                            </span>

                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
