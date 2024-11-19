import  Solicitud from "../logic/solicitud";
class Solicitudes {
    constructor() {
        this.solicitudes = []
        
    }

    inicializarLista(listaSolicitudes){
        this.formatearSolicitudes(listaSolicitudes);
    }


    aceptarSolicitud(id) {
        const indexOfSol = this.solicitudes.findIndex(s => s.id === id);
        if(indexOfSol !== -1) {
            this.solicitudes[indexOfSol].aprobar();
        }
    }

    actualizarLista(lista){
        this.solicitudes = lista;
    }

    formatearSolicitudes(data) {
        this.solicitudes = data.map(item => {
            return new Solicitud(item);
        });

        console.log(this.solicitudes)
    }

    getListaSolicitudes() {
        return this.solicitudes;
    }

    getSolicitud(id){
        return this.solicitudes.find(s => s.id === id);
    }

    fueVista(solId) {
        console.log(this.solicitudes)
        const indexOfSol = this.solicitudes.findIndex(s => s.id === solId);
        console.log("Cambiando vista:", this.solicitudes[indexOfSol])

        if(indexOfSol !== -1) {
            this.solicitudes[indexOfSol].vista = true;
        }
    }
    editarCantidadProducto(solId, idProducto, cantidadEntregada) {
        
        const indexOfSol = this.solicitudes.findIndex(s => s.id === solId);
        if(indexOfSol !== -1) {
            this.solicitudes[indexOfSol].productos.find(p => p.id === idProducto).cantidad_entregada = cantidadEntregada;
        }
    }

    agregarSolicitud(solicitud) {
        this.solicitudes.push(solicitud);
    }
}

export default Solicitudes;