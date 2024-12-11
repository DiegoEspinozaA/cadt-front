import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => (
  <div className="h-screen flex flex-col p-2 bg-[#ebedf0] pl-4 pr-4 pb-4">
    <Navbar />
    <div className="flex-grow flex overflow-hidden">
      <main className="flex-grow  mt-4 flex flex-col overflow-hidden ">
        {children}
      </main>
    </div>
  </div>
);

export default Layout;