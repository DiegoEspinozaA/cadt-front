import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => (
  <div className="h-screen flex flex-col p-2 bg-[#f6f9fd]">
    <Navbar />
    <div className="flex-grow flex overflow-hidden">
      <main className="flex-grow  mt-4 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
      {/* <Footer /> */}
  </div>
);

export default Layout;