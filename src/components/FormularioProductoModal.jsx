import { Modal, Box } from '@mui/material';

const FormularioProductoModal = ({
    isDialogOpen,
    closeDialog,
    productoSeleccionado,
    cantidadSeleccionada,
    setCantidadSeleccionada,
    addToList,
    isEditing,
}) => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: 'none',
        borderRadius: 5,
        boxShadow: 24,
        p: 4,
    };

    return (
        <Modal open={isDialogOpen} onClose={closeDialog}>
            <Box sx={style}>
                <div>
                    <div className="font-semibold">{isEditing ? 'Editar Producto' : 'Agregar Producto'}</div>
                    <div className="flex items-center justify-center my-4">
                        {productoSeleccionado?.imagen ? (
                            <img
                                src={productoSeleccionado.imagen}
                                alt={productoSeleccionado.nombre}
                                className="w-32 h-32 border-2 shadow-md object-cover"
                            />
                        ) : (
                            <div className="w-32 h-32 flex items-center justify-center bg-gray-200 rounded-md">
                                Sin imagen
                            </div>
                        )}
                    </div>
                    <div className="text-gray-600">
                        {isEditing
                            ? `Actualizar cantidad para ${productoSeleccionado?.nombre}`
                            : `Ingrese cantidad para ${productoSeleccionado?.nombre}`}
                    </div>
                </div>
                <div className="py-4">
                    <label htmlFor="quantity" className="text-right">
                        Cantidad
                    </label>
                    <input
                        type="number"
                        value={cantidadSeleccionada}
                        onChange={(e) => setCantidadSeleccionada(Math.max(1, parseInt(e.target.value, 10)))}
                        min="1"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        aria-label="Cantidad"
                    />
                </div>
                <div className="flex gap-4 justify-between">
                    <button onClick={closeDialog} className="border px-4 py-2 rounded-lg">
                        Cancelar
                    </button>
                    <button onClick={addToList} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                        {isEditing ? 'Actualizar' : 'Agregar'}
                    </button>
                </div>
            </Box>
        </Modal>
    );
};

export default FormularioProductoModal;
