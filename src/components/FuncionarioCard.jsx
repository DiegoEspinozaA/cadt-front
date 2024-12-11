import { Stethoscope, Building2, Edit, Trash, UserCog } from "lucide-react";

export default function RecordCard({ funcionario, onDelete, onEdit }) {
    return (
        <div className="group overflow-hidden transition-all hover:shadow-lg border-l-4 border-l-blue-500 shadow-md rounded-lg border border-gray-300 cursor-pointer">
            <div className="flex flex-col lg:flex-row">
                <div className="relative h-32 lg:h-auto lg:w-32 shrink-0 border-r border-gray-200">
                    <img
                        src={funcionario.foto}
                        alt={funcionario.nombre}
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className="flex flex-1 flex-col p-4 lg:p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1">
                                {funcionario.nombre}
                            </h3>
                            <p className="text-sm text-gray-500">
                                Rut: {funcionario.rut}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 md:gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Stethoscope className="h-4 w-4 text-gray-500" />
                            <span>{funcionario.area}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Building2 className="h-4 w-4 text-gray-500" />
                            <span>Box - {funcionario.box}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-800">
                            <UserCog className="h-4 w-4" />
                            <span>{funcionario.rol.charAt(0).toUpperCase() + funcionario.rol.slice(1)}</span>
                        </div>
                    </div>
                    <div className="border-t pt-4 md:pt-5 border-gray-200 flex flex-col md:flex-row items-center gap-2">
                        {funcionario.rut !== 'admin' && (
                            <button
                                className="flex items-center gap-2 text-sm bg-red-400/90 px-3 py-2 rounded text-white hover:bg-red-500/90 transition-colors w-full md:w-auto"
                                onClick={() => onDelete(funcionario.rut)}
                            >
                                Eliminar
                            </button>
                        )}
                        <button
                            className="flex items-center gap-2 text-sm border text-gray-900 px-3 py-2 rounded hover:bg-gray-200 transition-colors border-gray-300 w-full md:w-auto"
                            onClick={() => onEdit(funcionario.id)}
                        >
                            Editar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
