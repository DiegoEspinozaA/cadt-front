import Categoria from "../components/Categoria";
import { Clock, CheckCircle, XCircle, Square, CircleX, Layers, Info, MoreVertical, ArrowRight, ArrowLeft, Search, Trash2, User} from 'lucide-react'

const categories = [
    {categoria: "Inventario",            redirect: "inventario",     icono: (<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" strokeLinejoin="round" class="lucide lucide-briefcase-medical"><path d="M12 11v4"/><path d="M14 13h-4"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M18 6v14"/><path d="M6 6v14"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>) },
    {categoria: "Solicitudes",           redirect: "solicitudes",        icono: (<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" strokeLinejoin="round" class="lucide lucide-file-input"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M2 15h10"/><path d="m9 18 3-3-3-3"/></svg>) },
    {categoria: "Configuracion",   redirect: "admin", icono: (<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" strokeLinejoin="round" class="lucide lucide-cog"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 22v-2"/><path d="m17 20.66-1-1.73"/><path d="M11 10.27 7 3.34"/><path d="m20.66 17-1.73-1"/><path d="m3.34 7 1.73 1"/><path d="M14 12h8"/><path d="M2 12h2"/><path d="m20.66 7-1.73 1"/><path d="m3.34 17 1.73-1"/><path d="m17 3.34-1 1.73"/><path d="m11 13.73-4 6.93"/></svg>)},
    {categoria: "Empleado",               redirect: "empleado",     icono: (<User size={50} />) },
];

const Home = () => {
    return (
        <div className="h-screen grid grid-cols-4 grid-rows-4 place-items-center gap-12 p-16 md:p-24 text-md sm:text-xl md:text-2xl">
            {categories.map((cat, index) => (
                <Categoria
                    key={index}
                    categoria={cat.categoria}
                    redirect={cat.redirect}
                    icono={cat.icono}
                />
            ))}
        </div>
    );
  };
  
  export default Home;
  