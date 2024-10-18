import Navbar from '../components/Navbar';  // Asegúrate de tener el componente Navbar

import { Outlet } from 'react-router-dom';

const Layout = ({ children }) => {

    return (
        <div className='flex flex-col h-screen p-6 bg-gray-100'>
            <Navbar />
            <div className="flex h-screen mt-6 relative">
                <main className="flex-1 bg-transparent  rounded ">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;