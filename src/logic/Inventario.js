import {Unico, Reutilizable, Fraccionario } from './producto';

class Inventario {
    constructor(data) {
        this.productos = [];
        this.formatearProductos(data);
    }


    formatearProductos(data) {
        this.productos = data.map(item => {
            if (item.uso === "Unico") {
                return new Unico(item.id, item.nombre, item.precio, item.cantidad, item.categoria, item.uso, item.area, item.bodega);
            }
            else if (item.uso === 'Reutilizable') {
                return new Reutilizable(item.id, item.nombre, item.precio, item.cantidad, item.categoria, item.uso, item.area, item.bodega);
            }
            return new Fraccionario(item.id, item.nombre, item.precio, item.cantidad, item.categoria, item.uso,item.area, item.bodega, item.cajas);
        });
    }

    eliminar(producto) {
        const index = this.productos.findIndex(p => p.id === producto.id);
        if (index !== -1) {
            this.productos.splice(index, 1);
        }
        // this.eliminarDeApi();
        //await fetch(`/api/productos/${this.nombre}`, { method: 'DELETE' });
    }

    agregarProducto(producto) {
        const { uso } = producto;

        let nuevoProducto;
        switch (uso) {
            case "Unico":
                nuevoProducto = new Unico(producto.id || Date.now(), producto.nombre, producto.precio, producto.cantidad, producto.categoria, producto.area, producto.bodega, uso);
                break;
            case "Reutilizable":
                nuevoProducto = new Reutilizable(producto.id || Date.now(), producto.nombre, producto.precio, producto.cantidad, producto.categoria, producto.area, producto.bodega, uso);
                break;
            case "Fraccionario":
                nuevoProducto = new Fraccionario(producto.id || Date.now(), producto.nombre, producto.precio, producto.cantidad, producto.categoria, producto.area, producto.bodega, uso, producto.cajas || []);
                break;
            default:
                console.error("Uso de producto no válido");
                return;
        }

        // Agregar el nuevo producto a la lista
        this.productos.push(nuevoProducto);
        //agregarlo a la BD con la API
    }

    editarProducto(index, nuevosDatos){
        let id = this.productos[index].id;

        if(nuevosDatos.uso === "Fraccionario"){
            let cambioDeTipo = new Fraccionario(id, nuevosDatos.nombre, nuevosDatos.precio, nuevosDatos.cantidad, nuevosDatos.categoria, nuevosDatos.uso, nuevosDatos.area, nuevosDatos.bodega, []);
            this.productos[index] = cambioDeTipo;
        }
        this.productos[index].editar(nuevosDatos);
    }


    obtenerListaProductos() {
        return this.productos;
    }

    descontarProducto(producto) {
        if (producto.getCantidad() <= 1) {
            this.eliminar(producto)
        }
        else {
            producto.descontar();
        }
    }
}

export default Inventario;
