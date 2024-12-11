import { useEffect, useState } from "react";
import Search from "../components/Search";
import { Boxes, Hospital, HospitalIcon, Package2, PackageSearch } from "lucide-react";

export default function AreaManagement() {
    const [areas, setAreas] = useState([]);
    const [text, setText] = useState("");
    const handleResetSearch = () => setText("");

    const [currentArea, setCurrentArea] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [splitBodegas, setSplitBodegas] = useState("");

    const [productTypes, setProductTypes] = useState([]);
    const [currentProductType, setCurrentProductType] = useState(null);
    const [showProductTypeModal, setShowProductTypeModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [areasResponse, tiposResponse] = await Promise.all([
                    fetch('http://localhost:3001/areas'),
                    fetch('http://localhost:3001/tipos')
                ]);
    
                if (areasResponse.ok && tiposResponse.ok) {
                    const areasData = await areasResponse.json();
                    const tiposData = await tiposResponse.json();
                    setAreas(areasData);
                    setProductTypes(tiposData);
                } else {
                    throw new Error('Error al obtener datos del servidor.');
                }
            } catch (error) {
                console.error('Error al obtener datos del servidor:', error);
            }
        };
    
        fetchData();
    }, []);
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "bodegas") {
            if (value[value.length - 1] === ",") {
                setSplitBodegas(value.slice(0, -1));
            }
            const isValid = /^(\d+(,\d+)*,?\s*)?$/.test(value);
            if (isValid) {
                setSplitBodegas(value.trim());
                const bodegas = value
                    .split(",")
                    .map((id) => id.trim())
                    .filter((id) => id && !isNaN(id))
                    .map((id) => ({ bodegaId: parseInt(id, 10) }));
                setCurrentArea({ ...currentArea, bodegas });
            }
        }

        if (name === "nombre") {
            setCurrentArea({ ...currentArea, nombre: value.trim() });
        }
    };

    const handleAddArea = async () => {
        try {
            if (!currentArea.nombre) {
                throw new Error('Por favor, completa todos los campos obligatorios.');
            }

            const bodegas = currentArea.bodegas.length
                ? currentArea.bodegas.map((bodegaId) => bodegaId)
                : [];

            const response = await fetch('http://localhost:3001/areas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: currentArea.nombre,
                    bodegas: bodegas,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al crear el área.');
            }

            const newArea = await response.json();
            setAreas([...areas, newArea]);
            closeModal();
        } catch (error) {
            console.error('Error al agregar el área:', error.message);
            alert(`Error: ${error.message}`);
        }
    };

    const handleEditArea = async () => {
        try {
            if (!currentArea.nombre) {
                throw new Error('El nombre del área no puede estar vacío.');
            }

            setAreas(
                areas.map((area) =>
                    area.id === currentArea.id ? currentArea : area
                )
            );
            // Enviar la solicitud PUT al backend
            const response = await fetch(`http://localhost:3001/areas/${currentArea.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: currentArea.nombre,
                    bodegas: currentArea.bodegas,
                }),
            });

            console.log(response);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al editar el área.');
            }


            const updatedArea = await response.json();
            setAreas(
                areas.map((area) =>
                    area.id === updatedArea.area.id ? updatedArea.area : area
                )
            );


            // Actualizar el estado de áreas con los datos recibidos

            // closeModal();
        } catch (error) {
            console.error('Error al editar el área:', error.message);
            alert(`Error: ${error.message}`);
        }
    };


    const handleDeleteArea = async (id) => {
        const updatedAreas = areas.filter((area) => area.id !== id);
        setAreas(updatedAreas);
        try {
            const response = await fetch(`http://localhost:3001/areas/${id}`, {
                method: "DELETE",
            });
    
            if (!response.ok) {
                throw new Error("Error al eliminar el área");
            }
        } catch (error) {
            console.error("Error al eliminar el área:", error);
            setAreas(areas);
            alert("Hubo un problema al intentar eliminar el área.");
        }
    };
    

    const openModal = (area = null) => {
        setCurrentArea(
            area || { id: "", nombre: "", bodegas: [] }
        );

        setSplitBodegas(area ? area.bodegas.map(bodega => bodega.bodegaId).join(',') : "");
        setShowModal(true);
    };


    const openProductTypeModal = (productType = null) => {
        setCurrentProductType(productType || { id: "", nombre: "" });
        setShowProductTypeModal(true);
    };

    const closeProductTypeModal = () => {
        setCurrentProductType(null);
        setShowProductTypeModal(false);
    };

    const [activeTab, setActiveTab] = useState("areas");


    const closeModal = () => {
        setCurrentArea(null);
        setShowModal(false);
    };

    
    const handleEditProductType = async () => {
        try {
            if (!currentProductType.nombre) {
                throw new Error('El nombre del tipo de producto es obligatorio.');
            }
    
            const response = await fetch(`http://localhost:3001/tipos/${currentProductType.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: currentProductType.nombre,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Error al editar el tipo de producto.');
            }
    
            const updatedProductType = await response.json();
            setProductTypes(
                productTypes.map((type) =>
                    type.id === updatedProductType.id ? updatedProductType : type
                )
            );
            closeProductTypeModal();
        } catch (error) {
            console.error('Error al editar el tipo de producto:', error);
            alert(`Error: ${error.message}`);
        }
    };

    const handleAddProductType = async () => {
        try {
            if (!currentProductType.nombre) {
                throw new Error('El nombre del tipo de producto es obligatorio.');
            }
    
            const response = await fetch('http://localhost:3001/tipos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: currentProductType.nombre,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Error al agregar el tipo de producto.');
            }
    
            const newProductType = await response.json();
            setProductTypes([...productTypes, newProductType]);
            closeProductTypeModal();
        } catch (error) {
            console.error('Error al agregar el tipo de producto:', error);
            alert(`Error: ${error.message}`);
        }
    };

    const handleDeleteProductType = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/tipos/${id}`, {
                method: 'DELETE',
            });
    
            if (!response.ok) {
                throw new Error('Error al eliminar el tipo de producto.');
            }
    
            setProductTypes(productTypes.filter((type) => type.id !== id));
        } catch (error) {
            console.error('Error al eliminar el tipo de producto:', error);
            alert(`Error: ${error.message}`);
        }
    };

    

    return (
        <div className="flex flex-col h-full p-4">
            <header>
                <div className="flex items-center mb-6 gap-2">
                    <div className='flex items-center gap-2'>
                        <button
                            onClick={() => setActiveTab('areas')}
                            className={`flex items-center gap-2 px-4 py-2 font-medium transition-all border-b-4 ${activeTab === 'areas'
                                ? 'border-gray-700 text-gray-800 shadow-sm'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <Hospital className={`w-5 h-5 ${activeTab === 'areas' ? 'text-gray-800' : 'text-gray-500'}`} />
                            Areas
                        </button>
                        <button
                            onClick={() => setActiveTab('tiposProductos')}
                            className={`flex items-center gap-2 px-4 py-2 font-medium transition-all border-b-4 ${activeTab === 'tiposProductos'
                                ? 'border-gray-700 text-gray-800 shadow-sm'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <PackageSearch className={`w-5 h-5 ${activeTab === 'tiposProductos' ? 'text-gray-800' : 'text-gray-500'}`} />
                            Tipos de productos
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex justify-between items-center mb-6">

            </div>



            {activeTab === 'areas' && (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <Search placeholder="Buscar area..." text={text} setText={setText} handleResetSearch={handleResetSearch} />
                        <button onClick={() => openModal()} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Agregar area</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto py-4">
                        {areas.map((area) => (
                            <div
                                key={area.id}
                                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
                                onClick={() => openModal(area)}
                            >
                                <div className="flex items-center gap-3">
                                    <HospitalIcon className="w-8 h-8 text-blue-400" />
                                    <h3 className="text-lg font-bold text-gray-800">{area.nombre}</h3>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center gap-2">
                                        {/* <Package2 className="w-4 h-4 text-gray-400" /> */}
                                        <p className="text-sm text-gray-600 font-semibold">Bodegas</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {area.bodegas.length > 0 ? (
                                            area.bodegas.map((bodega) => (
                                                <div
                                                    key={bodega.bodegaId}
                                                    className="bg-gray-100 p-2 rounded-lg border text-sm text-gray-800 flex items-center justify-center w-12 h-12"
                                                >
                                                    {bodega.bodegaId}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-400">Ninguna</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-end mt-4 gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Evitar que el clic abra el modal
                                            openModal(area);
                                        }}
                                         className="flex items-center gap-2 text-sm border text-gray-900 p-2 rounded hover:bg-gray-200 transition-colors border-gray-300"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Evitar que el clic abra el modal
                                            handleDeleteArea(area.id);
                                        }}
                                        className="flex items-center gap-2 text-sm  bg-red-400/90 p-2 rounded text-white hover:bg-red-500/90 transition-colors"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>

                        ))}
                    </div>
                </>
            )}

            {activeTab === 'tiposProductos' && (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <div></div>
                        <button onClick={() => openProductTypeModal()} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Agregar tipo de producto</button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 overflow-y-auto py-4">
                        {productTypes.map((type) => (
                          <div
                          key={type.id}
                          className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all flex justify-between items-center"
                      >
                          <h3 className="text-lg font-bold text-gray-800">{type.nombre}</h3>
                          <div className="flex gap-2">
                              <button
                                  onClick={() => openProductTypeModal(type)}
                                  className="flex items-center gap-2 text-sm border text-gray-900 p-2 rounded hover:bg-gray-200 transition-colors border-gray-300"
                              >
                                  Editar
                              </button>
                              <button
                                  onClick={() => handleDeleteProductType(type.id)}
                                  className="flex items-center gap-2 text-sm  bg-red-400/90 p-2 rounded text-white hover:bg-red-500/90 transition-colors"
                              >
                                  Eliminar
                              </button>
                          </div>
                      </div>
                      
                        ))}
                    </div>
                </>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-gray-700 mb-4">
                            {currentArea?.id ? "Editar Área" : "Agregar Área"}
                        </h2>
                        <div className="grid gap-4">
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Nombre"
                                value={currentArea.nombre}
                                onChange={handleInputChange}
                                className="p-2 border rounded-lg"
                            />
                            <textarea
                                name="bodegas"
                                placeholder="IDs de bodegas (separados por comas)"
                                value={splitBodegas}
                                onChange={handleInputChange}
                                className="p-2 border rounded-lg"
                            />

                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={closeModal}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={currentArea?.id ? handleEditArea : handleAddArea}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                {currentArea?.id ? "Guardar cambios" : "Agregar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showProductTypeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-gray-700 mb-4">
                            {currentProductType?.id ? "Editar Tipo de Producto" : "Agregar Tipo de Producto"}
                        </h2>
                        <div className="grid gap-4">
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Nombre del tipo"
                                value={currentProductType?.nombre || ""}
                                onChange={(e) =>
                                    setCurrentProductType({
                                        ...currentProductType,
                                        nombre: e.target.value.trim(),
                                    })
                                }
                                className="p-2 border rounded-lg"
                            />
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={closeProductTypeModal}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={async () => {
                                    if (currentProductType?.id) {
                                        // Editar tipo de producto
                                        try {
                                            const response = await fetch(
                                                `http://localhost:3001/tipos/${currentProductType.id}`,
                                                {
                                                    method: "PUT",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: JSON.stringify(currentProductType),
                                                }
                                            );
                                            if (!response.ok) throw new Error("Error al editar el tipo de producto.");
                                            const updatedType = await response.json();
                                            setProductTypes(
                                                productTypes.map((type) =>
                                                    type.id === updatedType.id ? updatedType : type
                                                )
                                            );
                                            closeProductTypeModal();
                                        } catch (error) {
                                            alert(`Error: ${error.message}`);
                                        }
                                    } else {
                                        // Agregar nuevo tipo de producto
                                        try {
                                            const response = await fetch("http://localhost:3001/tipos", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify({
                                                    ...currentProductType,
                                                }),
                                            });
                                            if (!response.ok) throw new Error("Error al agregar el tipo de producto.");
                                            const newType = await response.json();
                                            setProductTypes([...productTypes, newType]);
                                            closeProductTypeModal();
                                        } catch (error) {
                                            alert(`Error: ${error.message}`);
                                        }
                                    }
                                }}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                {currentProductType?.id ? "Guardar cambios" : "Agregar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}
