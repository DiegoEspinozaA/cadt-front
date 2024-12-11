import React, { useEffect, useState } from "react";
import FuncionarioCard from "../components/FuncionarioCard";
import Search from "../components/Search";
import ImageUploader from "../components/ImageUploader";

export default function Funcionarios() {

    const [funcionarios, setFuncionarios] = useState([]);
    const [currentFuncionario, setCurrentFuncionario] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
    const [imagenKey, setImagenKey] = useState(Date.now());
    const [imagen, setImagen] = useState(null);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Loader state
    const [areas, setAreas] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [funcionariosResponse, areasResponse] = await Promise.all([
                    fetch("http://localhost:3001/funcionarios"),
                    fetch("http://localhost:3001/areas")
                ]);

                if (!funcionariosResponse.ok || !areasResponse.ok) {
                    throw new Error('Error al obtener los datos del servidor');
                }

                const funcionariosData = await funcionariosResponse.json();
                const areasData = await areasResponse.json();

                setFuncionarios(funcionariosData);
                setAreas(areasData); // Suponiendo que tienes un estado llamado `areas`
            } catch (error) {
                console.error('Error al obtener funcionarios o áreas:', error);
            }
        };

        fetchData();
    }, []);


    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const maxSizeInMB = 0.5;
            if (file.size / 1024 / 1024 > maxSizeInMB) {
                setError(`La imagen es demasiado grande. Tamaño máximo permitido: ${maxSizeInMB} MB`);
                setImagen(null);
                setImagenKey(Date.now());
            } else {
                setError("");
                setImagen(file);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentFuncionario({ ...currentFuncionario, [name]: value });
    };

    const handleAddFuncionario = async () => {
        try {
            const tempFuncionario = {
                rut: currentFuncionario.rut,
                ...currentFuncionario,
                foto: imagen ? URL.createObjectURL(imagen) : "",
            };

            setFuncionarios([...funcionarios, tempFuncionario]);
            closeModal();

            const formData = new FormData();
            Object.keys(currentFuncionario).forEach(key => {
                formData.append(key, currentFuncionario[key]);
            });
            if (imagen) {
                formData.append("foto", imagen);
            }

            const response = await fetch("http://localhost:3001/funcionarios", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Error al agregar el funcionario");
            }

            setMensaje({ tipo: 'success', contenido: "Funcionario agregado con éxito" });
        } catch (error) {
            alert("Error al agregar el funcionario");
            setFuncionarios(funcionarios.filter(f => f.rut !== currentFuncionario.rut));
        }
    };

    const handleEditFuncionario = async () => {
        try {
            setIsLoading(true);

            const formData = new FormData();
            Object.keys(currentFuncionario).forEach(key => {
                formData.append(key, currentFuncionario[key]);
            });
            if (imagen) {
                formData.append("foto", imagen);
            }

            const response = await fetch(`http://localhost:3001/funcionarios/${currentFuncionario.rut}`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Error al editar el funcionario");
            }

            const updatedFuncionario = await response.json();

            setFuncionarios(
                funcionarios.map(funcionario =>
                    funcionario.rut === currentFuncionario.rut ? updatedFuncionario.funcionario : funcionario
                )
            );

            setMensaje({ tipo: 'success', contenido: "Funcionario editado con éxito" });
        } catch (error) {
            alert("Error al editar el funcionario");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteFuncionario = async (rut) => {
        try {
            const response = await fetch(`http://localhost:3001/funcionarios/${rut}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Error al eliminar el funcionario");
            }
            setFuncionarios(funcionarios.filter((funcionario) => funcionario.rut !== rut));
            // alert("Funcionario eliminado con éxito");
        } catch (error) {
            console.error("Error al eliminar el funcionario:", error);
            alert("Hubo un problema al intentar eliminar el funcionario.");
        }
    };


    const openModal = (funcionario = null, mode = "add") => {
        setModalMode(mode);
        setCurrentFuncionario(funcionario || { nombre: "", password: "", rut: "", area: "", rol: "", box: "", foto: "" });
        setShowModal(true);
    };

    const closeModal = () => {
        setCurrentFuncionario(null);
        setShowModal(false);
        setModalMode("add");
        setImagen(null);
        setImagenKey(Date.now());
    };

    const [text, setText] = useState("");
    const handleResetSearch = () => setText("");

    return (
        <div className="flex flex-col h-full p-4 bg-gray-100">
            <div className="flex justify-between items-center mb-6">
                <Search placeholder="Buscar funcionario..." text={text} setText={setText} handleResetSearch={handleResetSearch} />
                <button
                    onClick={() => openModal(null, "add")}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    Agregar funcionario
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto py-4">
                {funcionarios.map((funcionario) => (
                    <FuncionarioCard
                        key={funcionario.rut}
                        funcionario={funcionario}
                        onDelete={() => handleDeleteFuncionario(funcionario.rut)}
                        onEdit={() => openModal(funcionario, "edit")}
                    />
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-gray-700 mb-4">
                            {modalMode === "edit" ? "Editar Funcionario" : "Agregar Funcionario"}
                        </h2>
                        <div className="grid gap-4">
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Nombre"
                                value={currentFuncionario.nombre}
                                onChange={handleInputChange}
                                className="p-2 border rounded-lg"
                            />
                            <input
                                type={`${modalMode === "edit" ? "password" : "text"}`}
                                name="password"
                                placeholder="Contraseña"
                                value={`${modalMode === "edit" ? "********" : currentFuncionario.password}`}
                                onChange={handleInputChange}
                                className={` p-2 border rounded-lg ${modalMode === "edit" ? "bg-gray-200 text-gray-400" : ""}`}
                            />

                            <input
                                type="text"
                                name="rut"
                                disabled={modalMode === "edit"}
                                placeholder="RUT"
                                value={currentFuncionario.rut}
                                onChange={handleInputChange}
                                className={` p-2 border rounded-lg ${modalMode === "edit" ? "bg-gray-200 text-gray-400" : ""}`}
                            />

                            {currentFuncionario.rut !== 'admin' && (

                                <select
                                    type="text"
                                    name="area"
                                    value={currentFuncionario.area}
                                    onChange={handleInputChange}
                                    className="p-2 border rounded-lg"
                                >
                                    <option value="">Selecciona un area</option>
                                    {areas.map((area) => (
                                        <option key={area.nombre} value={area.nombre}>{area.nombre}</option>
                                    ))}
                                </select>
                            )}
                            {currentFuncionario.rut !== 'admin' && (
                                <input
                                    type="text"
                                    name="box"
                                    placeholder="Box"
                                    value={currentFuncionario.box}
                                    onChange={handleInputChange}
                                    className="p-2 border rounded-lg"
                                />
                            )}
                            {currentFuncionario.rut !== 'admin' && (
                                <select
                                    type="text"
                                    placeholder="Rol"
                                    value={currentFuncionario.rol}
                                    onChange={handleInputChange}
                                    className="p-2 border rounded-lg"
                                >
                                    <option value="">Selecciona un rol</option>
                                    <option value="encargado">Encargado</option>
                                    <option value="empleado">Empleado</option>

                                </select>
                            )}

                        </div>
                        <div className="mt-4">
                            <ImageUploader key={imagenKey} imagen={imagen} onImageChange={handleImageChange} />
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={closeModal}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400">
                                Cancelar
                            </button>
                            <button
                                onClick={modalMode === "edit" ? handleEditFuncionario : handleAddFuncionario}
                                className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={isLoading}>
                                {isLoading ? "Guardando..." : (modalMode === "edit" ? "Guardar cambios" : "Agregar")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
