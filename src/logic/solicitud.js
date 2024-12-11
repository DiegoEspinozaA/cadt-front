
class Solicitud {
    constructor(data){
        this.id = data.id
        this.fecha = data.fecha
        this.estado = data.estado
        this.responsable = data.responsable
        this.unidad = data.unidad
        this.descripcion = data.descripcion
        this.productos = data.productos
        this.fecha_revision = null;
        this.vista = false;
        this.eliminada = false
    }
    
    
     asignarFechaRevision() {
        this.fecha_revision = new Date().toLocaleString();
        console.log("fecha revision: " + this.fecha_revision);
    }


    revisar() {
        this.estado = 'Revisada';
        this.asignarFechaRevision();
    }


    aprobar() {
        this.estado = 'Aprobada';
        this.asignarFechaRevision();
    }

    rechazar(){
        this.estado = 'Rechazada';
        this.asignarFechaRevision();
    }

    mostrarListaProductos() {
        let text = '\nLista de productos\n';
        for (let i = 0; i < this.productos.length; i++) {
          text +=
            this.productos[i].id +
            ' - ' +
            this.productos[i].nombre +
            ' ' +
            this.productos[i].cantidad_solicitada +
            ' ' +
            this.productos[i].cantidad_entregada +
            '\n';
        }
        return text;
      }
    
      mostrarInfo() {
        return `ID solicitud: ${this.id}\nFecha emision: ${
          this.fecha
        }\nResponsable: ${this.responsable}\nUnidad: ${this.unidad}\nDescripción: ${
          this.descripcion
        } ${this.mostrarListaProductos()}`;
      }
}

export default Solicitud