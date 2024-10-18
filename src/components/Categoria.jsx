import { Link } from 'react-router-dom';

export default function Categoria({ categoria, redirect, icono }) {
    return (
        <Link to={redirect || "/categoria"} className="bg-white text-3xl w-full border-2 h-full flex justify-center items-center transition-all duration-200 rounded-xl  text-gray-800   hover:border-gray-300 shadow-lg">
            <div className='items-center  flex flex-col gap-4 '>
                    {icono}
                <h1 className=''>{categoria}</h1>
            </div>
        </Link>
    );
}
