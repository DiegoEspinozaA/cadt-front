import React, { useState } from "react";
import { Typography, Button, Input, Select, Option, Dialog, IconButton } from "@material-tailwind/react";
import categorias from "../data/categories.json"
import usos from "../data/usos.json"
import Inventario from "../logic/Inventario";
import productosData from "../data/products.json"
import { Producto } from "../logic/producto";
import { DialogCustomAnimation } from "./DialogCustomAnimation";
import toast from 'react-hot-toast';
import { Search, ChartBarStacked, ChevronDown, Square, MoreVertical, ArrowLeft, ArrowRight, CircleX, CheckCircle, Pencil } from 'lucide-react'

const inventario = new Inventario(productosData);

export default function InventarioSidebar() {

  const [productos, setProductos] = useState(inventario.obtenerListaProductos());

  const [categoriaActiva, setCategoriaActiva] = useState(categorias[0].nombre);
  const [productoEditando, setProductoEditando] = useState(null);

  const [nuevoProducto, setNuevoProducto] = useState(() => {
    return new Producto(0, "", 0, 0, "", "");
  });


  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  const [modoModal, setModoModal] = useState("agregar"); // "agregar" o "editar"

  const handleAddProduct = () => {
    const newProduct = {
      id: Date.now(),
      ...nuevoProducto,
    };

    inventario.agregarProducto(newProduct);
    actualizarInventario();
    setNuevoProducto(new Producto(0, "", 0, 0, "", ""));
  };


  const editarProducto = () => {
    if (productoEditando !== null) {
      setProductoEditando(nuevoProducto)
      const { id } = productoEditando; // ID del producto que se va a editar
      const index = productos.findIndex((p) => p.id === id);

      inventario.editarProducto(index, nuevoProducto);
      actualizarInventario();
      toast('Producto actualizado', {
        icon: (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>),
      });
    }
  };

  const handleEliminar = (producto) => {
    // Eliminamos el producto del array de manera inmutable
    const nuevosProductos = productos.filter((p) => p.id !== producto.id);
    setProductos(nuevosProductos);
    inventario.eliminar(producto);
    toast('Producto eliminado correctamente', {
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5" /></svg>)
    });
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




  const actualizarInventario = () => {
    setProductos(inventario.obtenerListaProductos());
  };


  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 50;

  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const productosFiltrados = productos.filter(
    (producto) => producto.categoria === categoriaActiva
  );
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


  const handleChangeActiveCategory = (e) => {
    setCategoriaActiva(e.target.value);
    setActivePage(1);
  };

  return (
    <>
      <div className="flex h-screen relative">
        <aside className="w-64 bg-white border rounded-lg border-gray-300">
          <nav className="p-4 space-y-2 flex flex-col">
            {/* {categorias.map((categoria) => (
              <button
                key={categoria.id}
                className={`flex gap-2 w-full text-left py-2 px-3 transition-all duration-200 cursor-pointer ${categoria.nombre === categoriaActiva ? 'bg-gray-300 rounded font-bold text-blue-gray-900' : 'bg-white hover:bg-gray-200 text-gray-600'}`}
                onClick={() => setCategoriaActiva(categoria.nombre)}
              >
                {categoria.icon}
                {categoria.nombre}
              </button>
            ))} */}
            <button className="flex gap-2 w-full text-left py-2 px-3 transition-all duration-200 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              Lista de productos
            </button>

            <button className="flex gap-2 w-full text-left py-2 px-3 transition-all duration-200 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" /><path d="M12 22V12" /><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7" /><path d="m7.5 4.27 9 5.15" /></svg>
              Agregar producto
            </button>
            <br />
            <br />
            <span className="font-bold ">Creacion</span>
            <button className="flex gap-2 w-full text-left py-2 px-3 transition-all duration-200 cursor-pointer bg-gray-700 text-white rounded hover:bg-gray-800 text-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
              </svg>

              Crear categoria
            </button>

            <button className="flex gap-2 w-full text-left py-2 px-3 transition-all duration-200 cursor-pointer bg-gray-700 text-white rounded hover:bg-gray-800 text-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>

              Crear producto
            </button>

          </nav>
        </aside>

        <div className="flex-1  bg-white ml-6 border border-gray-300 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6 ">
            <div className="filters flex gap-6">
              <div className="relative w-full custom-select">
                <select
                  value={categoriaActiva}
                  onChange={handleChangeActiveCategory}
                  className="w-full appearance-none bg-white border border-gray-300 py-1 px-12 rounded focus:outline-none focus:ring-0 hover:border-gray-400 transition-all duration-100 "
                >
                  {categorias.map((categoria) => (
                    <option
                      key={categoria.id}
                      value={categoria.nombre}
                    >
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown size={18} />
                </div>

                <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center px-2 text-gray-700">
                  <ChartBarStacked size={18} />
                </div>

              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  // value={busqueda}
                  // onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-8 pr-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 absolute left-2 top-2 h-4 w-4 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
            </div>

            {/* Componente de paginación */}
            <div className="flex items-center justify-between  bg-white shadow-sm mt-6">
              <div className="flex items-center">
                <button className="ml-2">
                  <Square className="text-gray-400 " size={22}
                  />
                </button>
                <button className="ml-5">
                  <MoreVertical className="text-gray-400" size={22} />
                </button>
              </div>
              <div className="flex items-center text-sm text-gray-500">
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


          </div>
          <div className="bg-white rounded-lg max-h-[1000px] overflow-auto">
            <table className="min-w-full table-fixed shadow-md border ">
              <thead className="sticky top-0 border">
                <tr className="bg-gray-100 text-left text-gray-500 border-t border-gray-300 border-b">
                  <th className="w-1/3 px-4 py-2">Nombre</th>
                  <th className="w-1/8 px-4 py-2">Precio</th>
                  <th className="w-1/8 px-4 py-2">Stock</th>
                  <th className="w-1/8 px-4 py-2">Categoria</th>
                  <th className="w-1/8 px-4 py-2">Tipo de uso</th>
                  <th className="w-1/12 px-4 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosPaginados.map((producto) => (
                  <tr
                    key={producto.id}
                    className="group hover:bg-gray-100 cursor-default transition-all duration-100"
                  >
                    <td className="border-b px-4 py-3 truncate max-w-[10px]">
                      <span className="block truncate">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {producto.nombre}
                        </Typography>
                      </span>
                    </td>
                    <td className="border-b px-4 py-3">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {producto.precio}
                      </Typography>
                    </td>
                    <td className="border-b px-4 py-3">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {producto.cantidad}
                      </Typography>
                    </td>
                    <td className="border-b px-4 py-3">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {producto.categoria.substring(0, producto.categoria.length - 1)}
                      </Typography>
                    </td>
                    <td className="border-b px-4 py-3">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {producto.uso}
                      </Typography>
                    </td>
                    <td className="border-b px-4 py-3 text-right relative">
                      <div className=" flex justify-end items-center  text-gray-900 ">
                        <div className="absolute flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ">
                          {(producto.uso === "Fraccionario" && producto?.categoria) && <DialogCustomAnimation cajas={producto.cajas} producto={producto.nombre} />}

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


          <Dialog
            open={open}
            handler={handleOpen}
            animate={{
              mount: { scale: 1, y: 0 },
              unmount: { scale: 0.9, y: -100 },
            }}
            className="p-3"
          >

            <div className="p-3">
              <div className="">
                <h2 className="text-xl font-bold mb-4 text-gray-900">{modoModal === "agregar" ? "Agregar Producto" : "Editar Producto"}</h2>
                <div className="mb-4">
                  <Input
                    type="text"
                    label="Nombre"
                    value={nuevoProducto.nombre}
                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
                    className="border px-2 py-1 w-full"
                  />
                </div>
                <div className="mb-4">
                  <Input
                    type="number"
                    label="Cantidad"
                    inputMode="numeric"
                    value={nuevoProducto.cantidad}
                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, cantidad: parseInt(e.target.value) })}
                    className="border px-2 py-1 w-64 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
                <div className="mb-4">
                  <Select
                    label="Categoria"
                    value={nuevoProducto.categoria}
                    onChange={handleChangeSelect}
                  >
                    {categorias.map((c) => (
                      <Option key={c.id} value={c.nombre}>
                        {c.nombre}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div className="mb-4">
                  <Select
                    label="Tipo de uso"
                    value={nuevoProducto.uso}
                    onChange={handleChangeUsoSelect}
                  >
                    {usos.map((u) => (
                      <Option key={u.id} value={u.nombre}>
                        {u.nombre}
                      </Option>
                    ))}
                  </Select>
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
            </div>
          </Dialog>
        </div>
      </div>
    </>

  );
}
