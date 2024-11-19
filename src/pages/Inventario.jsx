import React, { useState } from "react";
import categorias from "../data/categories.json"
import areas from "../data/areas.json"
import bodeja from "../data/bodeja.json"
import inventario from "../logic/Inventario";
import productosData from "../data/products.json"
import { Producto } from "../logic/producto";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import Search from "../components/Search";
import { Square, MoreVertical, ArrowLeft, ArrowRight, CircleX, Pencil } from 'lucide-react'


import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AgregarProducto from "../components/AgregarProducto";


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

const inv = new inventario(productosData);

function Inventario() {
    const itemsPerPage = 50;
    const [productos, setProductos] = useState(inv.obtenerListaProductos());

    const [categoriaActiva, setCategoriaActiva] = useState(categorias[0].nombre);
    const [productoEditando, setProductoEditando] = useState(null);

    const [nuevoProducto, setNuevoProducto] = useState(() => {
        return new Producto(0, "", 0, 0, "", "");
    });

    const [selectFilters, setSelectFilters] = useState({
        unidad: "Todo",
        bodega: "Todo",
        tipoProducto: "Todo"
    });

    const handleChangeActiveCategory = (event, field) => {
        setSelectFilters((prevFilters) => ({
            ...prevFilters,
            [field]: event.target.value
        }));
        setActivePage(1);
    };


    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);

    const [modoModal, setModoModal] = useState("agregar"); // "agregar" o "editar"

    const handleAddProduct = () => {
        const newProduct = {
            id: Date.now(),
            ...nuevoProducto,
        };

        inv.agregarProducto(newProduct);
        actualizarInventario();
        setNuevoProducto(new Producto(0, "", 0, 0, "", ""));
    };


    const editarProducto = () => {
        if (productoEditando !== null) {
            setProductoEditando(nuevoProducto)
            const { id } = productoEditando; // ID del producto que se va a editar
            const index = productos.findIndex((p) => p.id === id);

            inv.editarProducto(index, nuevoProducto);
            actualizarInventario();
            // toast('Producto actualizado', {
            //   icon: (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" strokeLinejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>),
            // });
        }
    };

    const handleEliminar = (producto) => {
        // Eliminamos el producto del array de manera inmutable
        const nuevosProductos = productos.filter((p) => p.id !== producto.id);
        setProductos(nuevosProductos);
        inv.eliminar(producto);
        //   toast('Producto eliminado correctamente', {
        //     icon: (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" strokeLinejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5" /></svg>)
        //   });
    };




    const openModal = (modo, producto) => {
        setOpen(!open)
        setModoModal(modo);
        if (modo === "editar") {
            setProductoEditando(producto);
            const productoEditando = new Producto(
                producto.id,
                producto.nombre,
                producto.precio,
                producto.cantidad,
                producto.categoria,
                producto.uso
            );

            setNuevoProducto(productoEditando);
        }

        else {
            setNuevoProducto(new Producto(0, "", 0, 0, "", ""));
            setProductoEditando(null);
        }
    };


    const handleChangeSelect = (value) => {
        setNuevoProducto({ ...nuevoProducto, categoria: value });
    };

    const handleChangeUsoSelect = (value) => {
        setNuevoProducto({ ...nuevoProducto, uso: value });
    };

    const [text, setText] = useState("");

    const actualizarInventario = () => {
        setProductos(inv.obtenerListaProductos());
    };


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



    const [searchAllMode, setSearchAllMode] = useState(false);

    const setSearchMode = () => {
        setSearchAllMode(!searchAllMode);
        if (!searchAllMode) {
            setCategoriaActiva("Todo");
        }
    }

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


    // modal para agregar un producto
    const [openAddModal, setOpenAddModal] = useState(false);
    const handleCloseAddModal = () => setOpenAddModal(false);
    const handleOpenAddModal = () => {
        setOpenAddModal(!open)
        setNuevoProducto(new Producto(0, "", 0, 0, "", ""));
    }

    return (

        <div className='flex flex-row h-full'>
            <div className=' w-full '>
                <div className="flex flex-col h-full w-full">
                    {/* Header Search, botones con opciones*/}
                    <div className="w-full flex gap-4 items-center bg-gray-100 mb-4">
                        <button className=" flex items-center justify-start gap-2 px-6 py-4 rounded-full  bg-gray-600 text-white hover:shadow-md "
                            onClick={() => handleOpenAddModal()}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" />
                            </svg>
                            <span>Agregar producto
                            </span>
                        </button>
                        <Search handleResetSearch={handleResetSearch} text={text} setText={setText} />
                    </div>
                    <div className="bg-white pl-2 rounded-xl">
                        {/* componentes de paginacion, elementos fijos en relacion a la tabla*/}
                        <div className="sticky top-0 bg-white">
                            <div className="flex gap-4 mt-4 items-center">
                                <FormControl sx={{ width: 200 }} size="small"  >
                                    <Select
                                        sx={{ width: 200, borderRadius: '10px' }}
                                        labelId="select-Area"
                                        id="Area"
                                        value={selectFilters.unidad}
                                        onChange={(e) => handleChangeActiveCategory(e, 'unidad')}
                                        className={"transition-all duration-200 flex" + (selectFilters.unidad !== "Todo" ? " bg-gray-300/40" : " hover:bg-zinc-100/80")}
                                    >
                                        <MenuItem value="Todo" className="">
                                            Area
                                        </MenuItem>
                                        {areas.map((c) => (
                                            <MenuItem key={c.id} value={c.nombre} className="flex items-center">
                                                {c.nombre}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl sx={{ width: 200 }} size="small" >
                                    <Select
                                        sx={{ width: 200, borderRadius: '10px' }}
                                        labelId="select-Bodega"
                                        id="Categoria"
                                        value={selectFilters.bodega}
                                        onChange={(e) => handleChangeActiveCategory(e, 'bodega')}
                                        className={" transition-all duration-200 flex" + (selectFilters.bodega !== "Todo" ? " bg-gray-300/40" : " hover:bg-zinc-100/80")}
                                    >
                                        <MenuItem value="Todo">
                                            Bodega
                                        </MenuItem>
                                        {bodeja.map((c) => (
                                            <MenuItem key={c.id} value={c.nombre}>
                                                {c.nombre}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl sx={{ width: 200 }} size="small" >
                                    <Select
                                        sx={{ width: 200, borderRadius: '10px' }}
                                        labelId="select-Tipo"
                                        id="Tipo"
                                        value={selectFilters.tipoProducto}
                                        onChange={(e) => handleChangeActiveCategory(e, 'tipoProducto')}
                                        className={"transition-all duration-200 flex" + (selectFilters.tipoProducto !== "Todo" ? " bg-gray-300/40" : " hover:bg-zinc-100/80")}
                                    >
                                        <MenuItem value="Todo" >
                                            Tipo de producto
                                        </MenuItem>
                                        {categorias.map((c) => (
                                            <MenuItem key={c.id} value={c.nombre} >
                                                {c.nombre}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <button className="flex gap-2 transition-all duration-150 items-center rounded-lg py-2 px-4 hover:bg-gray-100 border border-gray-300"
                                    onClick={handleResetFilters}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
                                    Reiniciar filtros
                                </button>

                            </div>
                            <div className="flex items-center justify-between  bg-white mb-4 mt-4 ml-2">
                                <div className="flex items-center">
                                    <div className="flex items-center  h-full">
                                        <button className="text-gray-800 hover:bg-gray-200 p-2 rounded-lg">
                                            <Square className=" " size={24}
                                            />
                                        </button>

                                    </div>

                                    <button className="ml-5">
                                        <MoreVertical className="text-gray-800" size={20} />
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
                                    <button className="ml-4"
                                        onClick={next}
                                        disabled={activePage === totalPages}
                                    >
                                        <ArrowRight className={`transition-colors duration-100 ${activePage === 1 && activePage !== totalPages ? "text-gray-900" : "text-gray-400"}`} size={22}
                                        />
                                    </button>
                                </div>
                            </div>
                            {/* <Tabs options={categorias} active={categoriaActiva} handleChangeActive={handleChangeActiveCategory} /> */}
                        </div>
                    </div>

                    <div className=" overflow-y-auto bg-white border-b border-gray-300 pb-[1px] h-full">
                        <table className="w-full  ">
                            <thead className="font-bold text-gray-600 sticky top-0  z-20">
                                <tr className="bg-gray-100">
                                    <th className="p-2 text-left pl-4">Nombre</th>
                                    <th className="p-2 text-left">Precio</th>
                                    <th className="p-2 text-left">Cantidad</th>
                                    <th className="p-2 text-left"></th>
                                </tr>
                            </thead>
                            <tbody >
                                {productosPaginados.map((producto) => (
                                    <tr key={producto.id} className="group sol cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();  // Evita que el click se propague
                                            openModal("editar", producto)

                                        }}>
                                        <td className=" p-2 flex items-center relative">
                                            <div className="text-transparent group-hover:text-gray-400 absolute left-[-1px]">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis-vertical"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
                                            </div>
                                            <button
                                                className="p-2 rounded-full hover:bg-gray-200 mr-4 text-gray-400/60 group-hover:text-black h-full"
                                                aria-label="Seleccionar"
                                                onClick={(e) => e.stopPropagation()} // Evita que el click se propague
                                            >
                                                <Square size={22} />
                                            </button>

                                            {producto.nombre}
                                        </td>
                                        <td className="p-2">{producto.precio}</td>
                                        <td className="p-2">{producto.cantidad}</td>
                                        <td className="px-4 py-3 text-right relative">
                                            <div className=" flex justify-end items-center  text-gray-900 ">
                                                <div className="absolute flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ">
                                                    {/* {(project.uso === "Fraccionario" && project?.categoria) && <DialogCustomAnimation cajas={project.cajas} producto={project.nombre} />} */}
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

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box className="p-3" sx={style}>
                    <div className="">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">{modoModal === "agregar" ? "Agregar Producto" : "Editar Producto"}</h2>
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
                                value={nuevoProducto.cantidad}
                                onChange={(e) => setNuevoProducto({ ...nuevoProducto, cantidad: parseInt(e.target.value) })}
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

                    <AgregarProducto
                    />
                </Box>

            </Modal>

            {/* <Modal
                open={openAddModal}
                onClose={handleCloseAddModal}
            >
                <Box className="p-3" sx={style} >
                    <div className="flex flex-col space-y-4">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">{modoModal === "agregar" ? "Agregar Producto" : "Editar Producto"}</h2>
                        <div className="flex gap-2 w-full">

                            <div className="">
                                <TextField
                                    type="text"
                                    label="Nombre"
                                    value={nuevoProducto.nombre}
                                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
                                    className="border "
                                />
                            </div>
                            <button className="bg-zinc-900 text-gray-100 rounded px-4">
                                Crear
                            </button>
                        </div>


                        <div className="">
                            <TextField
                                type="number"
                                label="Cantidad"
                                inputMode="numeric"
                                value={nuevoProducto.cantidad}
                                onChange={(e) => setNuevoProducto({ ...nuevoProducto, cantidad: parseInt(e.target.value) })}
                                className="border px-2 py-1 w-64 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                        </div>
                        <div className="">
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
                                onClick={handleCloseAddModal}
                            >
                                Cerrar
                            </Button>
                        </div>
                    </div>
                </Box>
            </Modal> */}
        </div>

    );
}

export default Inventario;