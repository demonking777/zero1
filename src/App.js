import React, { useState } from 'react';
import { Canvas } from './Canvas';
import Toolbar from './Toolbar';

export default function App() {
  const [tool, setTool] = useState('brush');
  const [options, setOptions] = useState({ color: '#3b82f6', size: 5 });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">Interactive Image Annotation Platform</h1>
      </header>
      <main className="flex-grow p-6 flex flex-col items-center">
        <Toolbar tool={tool} setTool={setTool} options={options} setOptions={setOptions} />
        <div className="flex flex-wrap gap-4 mt-4">
          <Canvas tool={tool} options={options} />
          <Canvas tool={tool} options={options} />
        </div>
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>© 2025 Image Annotation Platform</p>
      </footer>
    </div>
  );
}