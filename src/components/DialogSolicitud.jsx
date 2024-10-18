import React, { useState } from "react";
import { Dialog, Progress, Input, Button, Tabs, TabsHeader, Tab } from "@material-tailwind/react";


export default function DialogSolicitud({}) {

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(!open);
    };

    return (
        <>
            <tr
                onClick={handleOpen}
                className="px-2 py-1 rounded mr-2 hover:bg-gray-300 transition-all duration-150"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
            </tr>

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
                    co
                </div>
            </Dialog>
        </>
    );
}