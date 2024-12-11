import React from 'react';
import { Clock, CheckCircle2, XCircle, Trash } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const config = {
    Pendiente: {
      icon: Clock,
      classes: 'bg-gray-50 text-gray-600 border-gray-200',
    },
    Aceptada: {
      icon: CheckCircle2,
      classes: 'bg-green-50 text-green-600 border-green-200',
    },
    Rechazada: {
      icon: XCircle,
      classes: 'bg-red-50 text-red-600 border-red-200',
    },
    Eliminada: {
        icon: Trash,
        classes: 'bg-red-50 text-red-600 border-red-200',
      },

  };

  const StatusIcon = config[status].icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${config[status].classes}`}
    >
      <StatusIcon className="w-4 h-4" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
