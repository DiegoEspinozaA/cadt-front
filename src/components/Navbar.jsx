import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
export default function Navbar() {
    return (
        <div  className="bg-white border border-gray-300 px-2 flex  rounded-xl shadow-sm">
            <div className="flex gap-3 w-full px-3 py-4">
                <Link to="/">
                    <button className="p-3 bg-gray-800 rounded-lg text-gray-200 hover:shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-left"><path d="M6 8L2 12L6 16" /><path d="M2 12H22" /></svg>

                    </button>
                </Link>
                <Link to="/"
                >
                    <button className="p-3 bg-gray-800 rounded-lg text-gray-200 hover:shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
                    </button>
                </Link>
            </div>
        </div >
    );
}