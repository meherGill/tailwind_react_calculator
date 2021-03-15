import React from 'react';
import "./tailwind.output.css"
import Calculator from './components/Calculator/Calculator'

function App() {
  return (
    <div className="App">
      <div className="h-screen bg-gray-300 flex items-center justify-center">
        <div className="container h-100 sm:p-5 md:w-100 md:p-0">
          <Calculator />
        </div>
      </div>
    </div>
  );
}

export default App;
