export default function CardSolicitud ()  {
    return (
        <Card className={`w-full max-w-2xl mx-auto border bg-white shadow-lg rounded-lg overflow-hidden ${sol.vista === false ? 'border-gray-600' : 'border-gray-300'}`}>
        <div className={`${getHeaderStyles(sol.estado)} text-white p-6`}>
            {sol.estado !== 'Pendiente' && (
                <div className="flex items-center rounded text-sm  gap-2 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class=" lucide lucide-check-check"><path d="M18 6 7 17l-5-5" /><path d="m22 10-7.5 7.5L13 16" /></svg>
                    <span className="">Verificada el {sol.fecha_revision}</span>
                </div>
            )}
            <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">Solicitud #{sol.id}</div>

            </div>
            <p className="text-sm opacity-80">Emision: {sol.fecha}</p>
        </div>
        <div className="p-6 ">
            <div className="flex flex-col gap-4 mb-4">
                <div>
                    <h3 className="font-semibold text-gray-600">Responsable</h3>
                    <p>{sol.responsable}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-600">Unidad</h3>
                    <p>{sol.unidad}</p>
                </div>
            </div>
            <div className="max-h-24 overflow-hidden">
                <h3 className="font-semibold text-gray-600">Descripción</h3>
                <p className="text-sm line-clamp-2">
                    {sol.descripcion}
                </p>
            </div>

        </div>
        <div className="bg-gray-50 p-6 flex gap-2 justify-center text-sm">
            <button
                variant="outline"
                className="flex items-center border border-zinc-200 p-2 rounded-lg gap-1 hover:bg-slate-100 hover:border-zinc-400 transition-all duration-100"
                onClick={() => handleAbrirSolicitud(sol)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                Revisar
            </button>
            {sol.estado === 'Pendiente' && (

                <>
                    <button variant="outline" className="flex items-center border border-zinc-200 p-2 rounded-lg gap-1 hover:bg-slate-100 hover:border-zinc-400 transition-all duration-100" onClick={() => console.log('Rejected')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
                        Rechazar
                    </button>
                    <button className="bg-green-500 hover:bg-green-600 text-white flex items-center p-2 rounded-lg gap-1 transition-all hover:border-zinc-400 duration-100"
                    onClick={() => handleAprobar(sol.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check-big"><path d="M21.801 10A10 10 0 1 1 17 3.335" /><path d="m9 11 3 3L22 4" /></svg>
                        Aprobar
                    </button>
                </>
            )}

        </div>
    </Card>
    );
}