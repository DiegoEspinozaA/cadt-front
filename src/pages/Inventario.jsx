import React, { useEffect, useState } from "react";
import categorias from "../data/categories.json"
import areas from "../data/areas.json"
import bodeja from "../data/bodeja.json"
import { Producto } from "../logic/producto";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import Search from "../components/Search";
import { Square, MoreVertical, ArrowLeft, ArrowRight, CircleX, Pencil, Loader } from 'lucide-react'
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AgregarProducto from "../components/AgregarProducto";
import { Image as ImageIcon } from "lucide-react";
import InventoryFilters from "../components/InventoryFilters";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius: 5,
    boxShadow: 24,
    p: 4,
};


function Inventario() {
    const itemsPerPage = 50;
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [areas, setAreas] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true); // Establecer el estado de carga en true al inicio
                // Realizar solicitudes en paralelo
                const [productosResponse, tiposResponse, areasResponse] = await Promise.all([
                    fetch('http://localhost:3001/productos', {
                        method: 'GET',
                      
                    }),
                    fetch('http://localhost:3001/tipos', {
                        method: 'GET',
                      
                    }),
                    fetch('http://localhost:3001/areas', {
                        method: 'GET',
                        
                    }),
                ]);
    
                if (
                    productosResponse.ok &&
                    tiposResponse.ok &&
                    areasResponse.ok
                ) {
                    const [productosData, tiposData, areasData] = await Promise.all([
                        productosResponse.json(),
                        tiposResponse.json(),
                        areasResponse.json(),
                    ]);
                    setProductos(productosData);
                    setCategorias(tiposData);
                    setAreas(areasData);
                } else {
                    throw new Error('Error al obtener los datos del servidor.');
                }
            } catch (error) {
                console.error('Error fetching datos:', error);
            } finally {
                setIsLoading(false)
            }
        };
    
        fetchData();
    }, []);
    

    const [isLoading, setIsLoading] = useState(false);
    const [productoEditando, setProductoEditando] = useState(null);

    const [nuevoProducto, setNuevoProducto] = useState(() => {
        return new Producto(0, "", 0, 0, "", "");
    });

    const [selectFilters, setSelectFilters] = useState({
        unidad: "Todo",
        bodega: "Todo",
        tipoProducto: "Todo"
    });

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);

    const [modoModal, setModoModal] = useState("agregar"); // "agregar" o "editar"

    const handleAddProduct = () => {
        setNuevoProducto(new Producto(0, "", 0, 0, "", ""));
    };


    const editarProducto = () => {
        if (productoEditando !== null) {
            setProductoEditando(nuevoProducto)
            const { id } = productoEditando; // ID del producto que se va a editar
            const index = productos.findIndex((p) => p.id === id);
            // toast('Producto actualizado', {
            //   icon: (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" strokeLinejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>),
            // });
        }
    };

    const handleEliminar = (producto) => {
        const nuevosProductos = productos.filter((p) => p.id !== producto.id);
        setProductos(nuevosProductos);
        fetch(`http://localhost:3001/producto/${producto.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                // console.log(data);
            })
            .catch(error => {
                // console.error('Error al eliminar el producto:', error);
            });
        // Mostrar notificación de éxito (si está activado)
        // toast('Producto eliminado correctamente', {
        //     icon: (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" strokeLinejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5" /></svg>)
        // });
    };



    const openModal = (modo, producto) => {
        setOpen(!open)
        setModoModal(modo);
        console.log(producto);
        if (modo === "editar") {
            setProductoEditando(producto);
            let p = new Producto(
                producto.id,
                producto.nombre,
                producto.stock,
                producto.bodegaId,
                producto.categoria,
                producto.imagen,
                producto.area,
            );
            setProductoEditando(p);
            setNuevoProducto(p);
        }

        else {
            setNuevoProducto(new Producto(0, "", 0, 0, "", ""));
            setProductoEditando(null);
        }
    };


    const [text, setText] = useState("");
    const [activePage, setActivePage] = useState(1);
    const startIndex = (activePage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;


    const productosFiltrados = productos.filter(producto => {
        const nombreMatch = producto.nombre.toLowerCase().includes(text.toLowerCase());
        const unidadMatch = selectFilters.unidad === "Todo" || producto.area === selectFilters.unidad;
        const bodegaMatch = selectFilters.bodega === "Todo" || producto.bodega === selectFilters.bodega;
        const tipoProductoMatch = selectFilters.tipoProducto === "Todo" || producto.categoria === selectFilters.tipoProducto;
        return nombreMatch && unidadMatch && bodegaMatch && tipoProductoMatch;
    });

    const productosPaginados = productosFiltrados.slice(startIndex, endIndex);
    const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);

    const next = () => {
        if (activePage === totalPages) return;
        setActivePage(activePage + 1);
    };

    const prev = () => {
        if (activePage === 1) return;
        setActivePage(activePage - 1);
    };

    const handleClose = () => setOpen(false);
    const handleResetSearch = () => {
        setText("");
    };

    const handleResetFilters = () => {
        setSelectFilters({
            unidad: "Todo",
            bodega: "Todo",
            tipoProducto: "Todo"
        })
    };

    const [openAddModal, setOpenAddModal] = useState(false);
    const handleCloseAddModal = () => setOpenAddModal(false);
    const handleOpenAddModal = () => {
        setOpenAddModal(!open)
        setNuevoProducto(new Producto(0, "", 0, 0, "", ""));
    }

    return (

        <div className='flex flex-row h-full text-sm'>
            <div className='w-full '>
                <div className="flex flex-col h-full w-full ">
                    {/* Header Search, botones con opciones*/}
                    <div className="w-full flex gap-4 items-center mb-4">
                        <button className=" flex items-center justify-start gap-2 px-5 py-4 rounded-lg bg-gray-600 text-gray-200 hover:bg-gray-700   transition-colors font-semibold hover:shadow-md "
                            onClick={() => handleOpenAddModal()}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" />
                            </svg>
                            <span>Agregar producto
                            </span>
                        </button>
                        <Search handleResetSearch={handleResetSearch} text={text} setText={setText} />
                    </div>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader size={40} className="animate-spin text-gray-600" />
                            <p className="ml-4 text-gray-600">Cargando datos...</p>
                        </div>
                    ) : (

                        <div className="h-full flex-grow flex flex-col overflow-hidden bg-white">
                            <div className="pl-6 rounded-xl">
                                {/* componentes de paginacion, elementos fijos en relacion a la tabla*/}
                                <div className="sticky top-0 bg-white ">
                                    <div className="flex items-center justify-between  bg-white mb-4 mt-4 ">
                                        <div className="flex items-center">
                                            <div className="flex items-center  h-full">
                                                <button className="text-gray-800 hover:bg-gray-200 p-1 rounded-lg ml-3">
                                                    <Square className=" " size={20}
                                                    />
                                                </button>

                                            </div>

                                            <button className="ml-5">
                                                <MoreVertical className="text-gray-400" size={20} />
                                            </button>

                                        </div>
                                        <div className="flex items-center text-sm text-gray-500 ">
                                            <span>{activePage} de {totalPages}</span>
                                            <button className="ml-4"
                                                disabled={activePage === 1}
                                                onClick={prev}
                                            >
                                                <ArrowLeft className={`transition-colors duration-100 ${activePage === 1 ? "text-gray-400" : "text-gray-800"}`} size={22} />
                                            </button>
                                            <button className="ml-4 mr-4"
                                                onClick={next}
                                                disabled={activePage === totalPages}
                                            >
                                                <ArrowRight className={`transition-colors duration-100 ${activePage === 1 && activePage !== totalPages ? "text-gray-900" : "text-gray-400"}`} size={22}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className=" overflow-y-auto bg-white border-b border-gray-300 h-full mt-6 ">
                                <InventoryFilters
                                    selectFilters={selectFilters}
                                    setSelectFilters={setSelectFilters}
                                    areas={areas}
                                    bodeja={bodeja}
                                    categorias={categorias}
                                    handleResetFilters={handleResetFilters}
                                />
                                <div>
                                    {productosPaginados.map((producto) => (
                                        <div key={producto.id} className="sol group cursor-pointer grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] border-b border-gray-100 last:border-b-0"
                                            onClick={(e) => {
                                                e.stopPropagation();  // Evita que el click se propague
                                                openModal("editar", producto)

                                            }}>
                                            <div className="p-2 flex items-center relative">
                                                <div className="text-transparent group-hover:text-gray-400">
                                                    <div className="relative">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-grip-vertical "><circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" /></svg>
                                                    </div>

                                                </div>
                                                <button
                                                    className="p-2 rounded-full hover:bg-gray-200 mr-4 text-gray-400/60 group-hover:text-black h-full"
                                                    aria-label="Seleccionar"
                                                    onClick={(e) => e.stopPropagation()} // Evita que el click se propague
                                                >
                                                    <Square size={20} />
                                                </button>

                                                <div className="flex items-center gap-2 relative group">
                                                    {producto.imagen ? (
                                                        <img
                                                            src={producto.imagen}
                                                            alt={producto.nombre || "Producto"}
                                                            className="w-6 h-6 aspect-auto cursor-pointer bg-white border-2 p-[1px] border-gray-300 shadow-sm rounded-md"
                                                        />
                                                    ) : (
                                                        <div className="w-6 h-6 flex items-center justify-center bg-gray-200 border border-gray-300 shadow-sm rounded-md">
                                                            <ImageIcon className="w-4 h-4 text-gray-500" />
                                                        </div>
                                                    )}
                                                </div>

                                                <span className="ml-4">
                                                    {producto.nombre}
                                                </span>

                                            </div>

                                            <div className="p-2 flex items-center">{producto.categoria}</div>
                                            <div className="p-2 flex items-center">{producto.area}</div>
                                            <div className="p-2 flex items-center">{producto.bodegaId}</div>
                                            <div className="p-2 flex items-center">{producto.stock}</div>
                                            <div className="p-2 flex items-center">{producto.descripcion}</div>


                                            <div className=" text-right relative top-0 flex justify-end mr-2">
                                                <div className=" flex justify-end items-center  text-gray-900">
                                                    <div className="absolute flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ">
                                                        <button
                                                            className="p-2 rounded-full hover:bg-gray-300"
                                                            aria-label="Editar"
                                                            onClick={(e) => {
                                                                e.stopPropagation();  // Evita que el click se propague
                                                                openModal("editar", producto)

                                                            }}
                                                        >
                                                            <Pencil size={22} className="text-gray-600" />
                                                        </button>
                                                        <button
                                                            className="p-2 rounded-full hover:bg-gray-300"
                                                            aria-label="Rechazar"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEliminar(producto)
                                                            }}
                                                        >
                                                            <CircleX size={22} className="text-gray-700" />
                                                        </button>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box className="p-3" sx={style}>
                    <div className="">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">{modoModal === "agregar" ? "Agregar Producto" : "Editar Producto"}</h2>
                        <div className="mb-4 justify-center items-center flex">
                            {nuevoProducto.imagen ? (
                                <div className="border-2 border-gray-300 rounded-lg shadow-md p-2">
                                    <img
                                        src={nuevoProducto.imagen}
                                        alt={nuevoProducto.nombre || "Producto"}
                                        className="w-32 h-32 object-cover rounded-md"
                                    />
                                </div>
                            ) : (
                                <div className="">
                                    <div className="relative">
                                        <label title="Click to upload" htmlFor="button2" className="cursor-pointer flex items-center gap-4 px-6 py-4 before:border-gray-400/60 hover:before:border-gray-300 group before:bg-gray-100 before:absolute before:inset-0 before:rounded-3xl before:border before:border-dashed before:transition-transform before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95">
                                            <div className="w-max relative">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                                            </div>
                                            <div className="relative">
                                                <span className="block text-base font-semibold relative text-blue-900 group-hover:text-blue-500"> Sube una imagen del producto </span>
                                                <span className="mt-0.5 block text-sm text-gray-500">Máximo 0.5 MB</span>
                                                {/* {imagen &&
                                                (<span className="mt-0.5 block text-sm text-gray-500">{imagen.name} ({(imagen.size / 1024 / 1024).toFixed(2)} MB)</span>)
                                            } */}
                                            </div>
                                        </label>
                                        <input type="file"
                                            name="button2"
                                            id="button2"
                                            className="hidden"
                                            accept="image/*"
                                        // onChange={handleImageChange}
                                        // key={imagenKey}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mb-4">
                            <TextField
                                type="text"
                                label="Nombre"
                                value={nuevoProducto.nombre}
                                onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
                                className="border px-2 py-1 w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <TextField
                                type="number"
                                label="Cantidad"
                                inputMode="numeric"
                                value={nuevoProducto.stock}
                                onChange={(e) => setNuevoProducto({ ...nuevoProducto, stock: parseInt(e.target.value) })}
                                className="border px-2 py-1 w-64 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                        </div>
                        <div className="mb-4">
                            <FormControl fullWidth>
                                <InputLabel id="select-categoria">Categoria</InputLabel>
                                <Select
                                    labelId="select-categoria"
                                    id="Categoria"
                                    value={nuevoProducto.categoria}
                                    label="categoria"
                                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })}
                                >
                                    {categorias.map((c) => (
                                        <MenuItem key={c.id} value={c.nombre}>
                                            {c.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                        </div>
                        <div className="mb-4">

                        </div>
                        <div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                size="sm"
                                onClick={productoEditando !== null ? editarProducto : handleAddProduct}
                                className="px-4 py-2  text-white rounded"
                            >
                                {modoModal === "agregar" ? "Guardar" : "Actualizar"}
                            </Button>
                            <Button
                                variant="outlined"
                                size="sm"
                                onClick={handleOpen}
                            >
                                Cerrar
                            </Button>
                        </div>
                    </div>
                </Box>
            </Modal>

            <Modal
                open={openAddModal}
                onClose={handleCloseAddModal}
                handleCloseAddModal={handleCloseAddModal}
            >
                <Box className="p-3" sx={style} >
                    <AgregarProducto productos={productos} categorias={categorias} areas={areas}  setProductos={setProductos} 
                    />
                </Box>
            </Modal>
        </div>

    );
}

export default Inventario;
