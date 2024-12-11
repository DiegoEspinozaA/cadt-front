import React, { useState, useRef, useEffect } from "react";
import { ArrowDownUp, Filter, SortAsc } from "lucide-react";

export function FilterBar({ filtroEstado, setFiltroEstado, ordenarPor, setOrdenarPor }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const orderDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        orderDropdownRef.current &&
        !orderDropdownRef.current.contains(event.target)
      ) {
        setIsOrderDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-wrap gap-4 items-center p-4 bg-white shadow-sm rounded-lg">
      {/* Filtro por Estado */}
      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-300 transition"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="text-gray-600">
            {filtroEstado === "todos"
              ? "Todas"
              : filtroEstado.charAt(0).toUpperCase() + filtroEstado.slice(1)}
          </span>
          <ArrowDownUp className="w-4 h-4 text-gray-400" />
        </button>
        {isDropdownOpen && (
          <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-md w-full ">
            <ul>
              <li
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-600"
                onClick={() => {
                  setFiltroEstado("todos");
                  setIsDropdownOpen(false);
                }}
              >
                Todas
              </li>
              <li
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-600"
                onClick={() => {
                  setFiltroEstado("pendientes");
                  setIsDropdownOpen(false);
                }}
              >
                Pendientes
              </li>
              <li
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-600"
                onClick={() => {
                  setFiltroEstado("aceptadas");
                  setIsDropdownOpen(false);
                }}
              >
                Aceptadas
              </li>
              <li
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-600"
                onClick={() => {
                  setFiltroEstado("rechazadas");
                  setIsDropdownOpen(false);
                }}
              >
                Rechazadas
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Ordenar por */}
      <div className="relative" ref={orderDropdownRef}>
        <button
          className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-300 transition"
          onClick={() => setIsOrderDropdownOpen(!isOrderDropdownOpen)}
        >
          <SortAsc className="w-5 h-5 text-gray-500" />
          <span className="text-gray-600">
            {ordenarPor === "fecha"
              ? "Ordenar por fecha"
              : "Ordenar por estado"}
          </span>
          <ArrowDownUp className="w-4 h-4 text-gray-400" />
        </button>
        {isOrderDropdownOpen && (
          <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-md w-full">
            <ul>
              <li
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-600"
                onClick={() => {
                  setOrdenarPor("fecha");
                  setIsOrderDropdownOpen(false);
                }}
              >
                Ordenar por fecha
              </li>
              <li
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-600"
                onClick={() => {
                  setOrdenarPor("estado");
                  setIsOrderDropdownOpen(false);
                }}
              >
                Ordenar por estado
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
