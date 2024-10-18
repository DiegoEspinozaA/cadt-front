class Producto {
    constructor(id, nombre, precio, cantidad, categoria, uso) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
        this.categoria = categoria;
        this.uso = uso;
    }

    descontar() {
        this.cantidad -= 1;
    }

    getCantidad() {
        return this.cantidad;
    }

    editar(nuevosDatos) {
        this.id = this.id;
        this.nombre = nuevosDatos.nombre || this.nombre;
        this.precio = nuevosDatos.precio || this.precio;
        this.cantidad = nuevosDatos.cantidad || this.cantidad;
        this.categoria = nuevosDatos.categoria || this.categoria;
        this.uso = nuevosDatos.uso || this.uso;
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
    constructor(id, nombre, precio, cantidad, categoria, uso, cajas){
        super(id, nombre, precio, cantidad, categoria, uso)
        this.cajas = cajas
    }
  
    mostrarInfo() {
        return `Fraccionario`;
    }

}

export { Producto, Unico, Reutilizable, Fraccionario };
