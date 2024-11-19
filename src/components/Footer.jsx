import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => (
  <footer className="bg-black bg-opacity-30 p-2 text-center ">
    <div className="flex justify-center space-x-4 mb-2">
      <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-300 transition-colors">
        <Github size={24} />
      </a>
      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-300 transition-colors">
        <Linkedin size={24} />
      </a>
      <a href="mailto:john@example.com" className="text-white hover:text-yellow-300 transition-colors">
        <Mail size={24} />
      </a>
    </div>
    <p>&copy; 2024 John Doe. All rights reserved.</p>
  </footer>
);

export default Footer;