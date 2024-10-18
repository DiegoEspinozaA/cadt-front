import React from 'react';


const AsideMenu = ({ opciones, categoriaActiva, setCategoriaActiva }) => {
    return (
            <nav className="p-4 space-y-2">
                {opciones.map((categoria) => (
                    <button
                        key={categoria.id}
                        className={`flex gap-2 w-full text-left py-2 px-3 transition-all duration-200 cursor-pointer ${categoria.nombre === categoriaActiva ? 'bg-gray-300 rounded font-bold text-blue-gray-900' : 'bg-white hover:bg-gray-200 text-gray-600'}`}
                        onClick={() => setCategoriaActiva(categoria.nombre)}
                    >
                        <div className="">
                        {categoria.icon}
                        </div>

                        {categoria.nombre}
                    </button>
                ))}
            </nav>
    );
};

export default AsideMenu;
