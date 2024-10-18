import React, { useState } from "react";
import { Dialog, Progress, Input, Button, Tabs, TabsHeader, Tab } from "@material-tailwind/react";


export function DialogCustomAnimation({ producto, cajas }) {

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(!open);

        if (!open) {
            // Solo reinicia las configuraciones si se está abriendo
            setCantidadSearchValue('');
            setFilterType('Exacto');
        }
    };

    const totalCajas = cajas.length
    const pastillasDisponibles = cajas.length === 0 ? 0 : cajas.reduce((sum, caja) => sum + caja.cantidadActual, 0)

    const [cantidadSearchValue, setCantidadSearchValue] = useState(null)
    const [filterType, setFilterType] = useState('Exacto');

    const filteredCajas = cajas
        .filter((caja) => {
            const cantidad = parseInt(cantidadSearchValue);
            if (isNaN(cantidad) || cantidadSearchValue === '') {
                return true; // Muestra todas las cajas si no hay valor de búsqueda
            }

            // Filtrado según el tipo seleccionado en los tabs
            if (filterType === 'Exacto') {
                return caja.cantidadActual === cantidad; // Filtro por igualdad
            } else if (filterType === 'MayorIgual') {
                return caja.cantidadActual >= cantidad; // Filtro por mayor o igual
            }

            return false; // En caso de que no coincida con ningún tipo (opcional)
        })
        .sort((a, b) =>
            Math.abs(a.cantidadActual - parseInt(cantidadSearchValue)) -
            Math.abs(b.cantidadActual - parseInt(cantidadSearchValue))
        );

    return (
        <>
            <button
                onClick={handleOpen}
                className="px-2 py-1 rounded mr-2 hover:bg-gray-300 transition-all duration-150"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
            </button>

            <Dialog
                open={open}
                handler={handleOpen}
                animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: -100 },
                }}
                className="p-3"
            >


                <div className="container mx-auto p-4 text-gray-900 ">
                    <h1 className="text-2xl font-bold mb-4">Stock de {producto} parciales</h1>
                    <div className="bar mb-6 mt-2 flex justify-between">
                        <div className="flex gap-2">

                            <Input
                                disabled={totalCajas === 0 ? true : false}
                                type="number"
                                label="Cantidad de pastillas"
                                value={cantidadSearchValue}
                                onChange={(e) => setCantidadSearchValue(e.target.value)}
                                className="border px-2 py-1 w-full"
                                containerProps={{
                                    className: "w-[180px]",
                                }}
                            >
                            </Input>

                            <Tabs
                                value={filterType} className="w-full">
                                <TabsHeader>
                                    <Tab
                                        disabled={totalCajas === 0 ? true : false}

                                        value={"Exacto"} onClick={() => setFilterType("Exacto")}>
                                        Exacto
                                    </Tab>
                                    <Tab
                                        disabled={totalCajas === 0 ? true : false}
                                        value={"MayorIgual"}
                                        onClick={() => setFilterType("MayorIgual")}
                                        className=""
                                    >
                                        <div className="flex items-center gap-1">
                                            <span>Mayor </span>
                                            <span>igual</span>
                                        </div>
                                    </Tab>
                                </TabsHeader>
                            </Tabs>
                        </div>

                        <Button
                            disabled={totalCajas === 0 ? true : false}
                            size="sm"
                            variant="outlined"
                        >
                            Reinciar filtros
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 max-h-[800px] overflow-y-auto">
                        {filteredCajas.map((caja) => (
                            <div key={caja.id} className="border border-gray-300 rounded-lg shadow-md">
                                <div className="p-4">
                                    <h1 className="text-lg">Caja #{caja.id}</h1>
                                </div>
                                <div className="p-4 text">
                                    <span>Quedan {caja.cantidadActual} de {caja.capacidadTotal}</span>
                                    <Progress value={(caja.cantidadActual / caja.capacidadTotal) * 100} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <div>
                            <p>Total de cajas parciales: {totalCajas}</p>
                            <p>Pastillas disponibles: {pastillasDisponibles}</p>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
}