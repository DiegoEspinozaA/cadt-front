import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  X,
  Building2,
  Boxes,
  PackageSearch,
  ArrowDownUp,
  Check,
  Filter,
  Tag,
} from "lucide-react";

export function InventoryFilters({ selectFilters, setSelectFilters, areas, bodeja, categorias, handleResetFilters }) {
  const [activeFilter, setActiveFilter] = useState(null);
  const dropdownRef = useRef(null);
  const hasActiveFilters = Object.keys(selectFilters).some((key) => selectFilters[key] !== "Todo");

  const toggleFilter = (key) => {
    setActiveFilter(activeFilter === key ? null : key);
  };

  const handleFilterSelect = (key, value) => {
    setSelectFilters((prev) => ({ ...prev, [key]: value }));
    setActiveFilter(null);
  };

  const clearFilter = (key) => {
    setSelectFilters((prev) => ({ ...prev, [key]: "Todo" }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveFilter(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const columns = [
    {
      key: "nombre",
      label: "Nombre",
    },
    {
      key: "tipoProducto",
      label: "Tipo de producto",
      options: categorias,
      icon: <PackageSearch className="w-5 h-5 text-gray-500" />,
    },
    {
      key: "unidad",
      label: "Área",
      options: areas,
      icon: <Building2 className="w-5 h-5 text-gray-500" />,
    },
    {
      key: "bodega",
      label: "Bodega",
      options: bodeja,
      icon: <Boxes className="w-5 h-5 text-gray-500" />,
    },
    {
      key: "stock",
      label: "Stock",
    },
    {
      key: "descripcion",
      label: "Descripción",
    },
    {
      key: "acciones",
      label: "",
    },
  ];



  return (
    <div className="sticky top-0 bg-white shadow-sm z-10" ref={dropdownRef}>
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200">
        <div className="flex flex-wrap gap-2 items-center min-h-[40px] ml-6">
          {Object.entries(selectFilters).some(([_, value]) => value !== "Todo") ? (
            <>
            <Tag className="w-4 h-4 text-blue-500"/>

            {Object.entries(selectFilters).map(
              ([key, value]) =>
                value !== "Todo" && (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors border border-gray-200"
                  >
                    {columns.find((col) => col.key === key)?.label}: {value}
                    <button
                      onClick={() => clearFilter(key)}
                      className="p-1 hover:bg-gray-200 rounded-full"
                      title="Eliminar filtro"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </span>
                )
            
            )}
            </>
          ) : (
            <span className="text-sm text-gray-500 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              No hay filtros aplicados</span>
          )}
        </div>


        {hasActiveFilters && (
          <button
            onClick={() => handleResetFilters({})}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            <ArrowDownUp className="w-4 h-4" />
            Reiniciar todos
          </button>
        )}
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] border-b border-gray-200 bg-gray-50 ">
        {columns.map((column) => (
          <div
            key={column.key}
            className={`relative py-4 px-2 ${column.key === "nombre" ? "pl-8" : ""}`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className={`flex items-center gap-2 ${column.key === "nombre" ? "ml-2" : ""}`}>
                {column.icon}
                <span className="font-light text-gray-700">{column.label}</span>
              </div>
              {column.options && (
                <div className="flex items-center gap-1">
                  {selectFilters[column.key] && selectFilters[column.key] !== "Todo" && (
                    <button
                      onClick={() => clearFilter(column.key)}
                      className="p-1 hover:bg-red-300 rounded-full bg-red-200 transition-colors"
                      title="Limpiar filtro"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  )}
                  <button
                    onClick={() => toggleFilter(column.key)}
                    className={`p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors ${activeFilter === column.key ? "bg-gray-100" : ""
                      }`}
                    title="Filtrar"
                  >
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              )}
            </div>
            {activeFilter === column.key && column.options && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <button
                  onClick={() => handleFilterSelect(column.key, "Todo")}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50"
                >
                  Todo
                </button>
                {column.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleFilterSelect(column.key, option.nombre)}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${selectFilters[column.key] === option.nombre ? "bg-gray-50" : ""
                      }`}
                  >
                    {option.nombre}
                    {selectFilters[column.key] === option.nombre && <Check className="w-4 h-4 text-gray-500 inline ml-2" />}

                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default InventoryFilters;
