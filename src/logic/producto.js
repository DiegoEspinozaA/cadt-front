class Producto {
    constructor(id, nombre, precio, stock, categoria, imagen, area, bodega) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
        this.categoria = categoria;
        this.imagen = imagen;
        this.area = area;
        this.bodega = bodega;
    }

    descontar() {
        this.stock -= 1;
    }

    getCantidad() {
        return this.stock;
    }

    editar(nuevosDatos) {
        this.id = this.id;
        this.nombre = nuevosDatos.nombre || this.nombre;
        this.precio = nuevosDatos.precio || this.precio;
        this.stock = nuevosDatos.stock || this.stock;
        this.categoria = nuevosDatos.categoria || this.categoria;
        this.imagen = nuevosDatos.imagen || this.imagen;
        this.area = nuevosDatos.area || this.area;
        this.bodega = nuevosDatos.bodega || this.bodega;
    }

    mostrarInfo() {
        return `Producto: ${this.nombre}, Precio: ${this.precio}`;
    }

}


class Unico extends Producto {
    mostrarInfo() {
        return `Unico`;
    }
}


class Reutilizable extends Producto {
    mostrarInfo() {
        return `Reutilizable`;
    }
}

class Fraccionario extends Producto {
    constructor(id, nombre, precio, stock, categoria, imagen, cajas){
        super(id, nombre, precio, stock, categoria, imagen)
        this.cajas = cajas
    }
  
    mostrarInfo() {
        return `Fraccionario`;
    }

}

export { Producto, Unico, Reutilizable, Fraccionario };
