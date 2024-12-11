import React, { useState } from 'react';
import {
  ChevronDown,
  X,
  User,
  Building2,
  MapPin,
  Activity,
  Hash,
  RotateCcw,
} from 'lucide-react';

const getColumnIcon = (key) => {
  switch (key) {
    case 'id':
      return <Hash className="w-4 h-4" />;
    case 'name':
      return <User className="w-4 h-4" />;
    case 'status':
      return <Activity className="w-4 h-4" />;
    case 'department':
      return <Building2 className="w-4 h-4" />;
    case 'location':
      return <MapPin className="w-4 h-4" />;
    default:
      return null;
  }
};

export function TableHeader({ columns, onFilterChange, onResetAllFilters, activeFilters,}) {
  const [activeFilter, setActiveFilter] = useState(null);
  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  const toggleFilter = (key) => {
    setActiveFilter(activeFilter === key ? null : key);
  };

  const handleFilterSelect = (columnKey, value) => {
    onFilterChange(columnKey, value);
    setActiveFilter(null);
  };

  const clearFilter = (columnKey) => {
    onFilterChange(columnKey, null);
  };

  return (
    <div className="sticky top-0  shadow-sm z-10">
      {/* Header section with reset filters button */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-700">Filtros aplicados</h2>
        {hasActiveFilters && (
          <button
            onClick={onResetAllFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reiniciar todos
          </button>
        )}
      </div>

      {/* Column headers with filter options */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] border-b border-gray-200">
        {columns.map((column) => (
          <div key={column.key} className="relative p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">{getColumnIcon(column.key)}</span>
                <span className="font-medium text-gray-900">{column.label}</span>
              </div>
              {column.filterOptions && (
                <div className="flex items-center gap-1">
                  {activeFilters[column.key] && (
                    <button
                      onClick={() => clearFilter(column.key)}
                      className="p-1 hover:bg-gray-100 rounded-full"
                      title="Limpiar filtro"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  )}
                  <button
                    onClick={() => toggleFilter(column.key)}
                    className={`p-1 rounded-full hover:bg-gray-100 ${
                      activeFilter === column.key ? 'bg-gray-100' : ''
                    }`}
                    title="Filtrar"
                  >
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              )}
            </div>

            {/* Dropdown for filter options */}
            {activeFilter === column.key && column.filterOptions && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                {column.filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterSelect(column.key, option.value)}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                      activeFilters[column.key] === option.value ? 'bg-gray-50' : ''
                    }`}
                  >
                    {option.label}
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
