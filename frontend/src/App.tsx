import React from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>File Management App</h1>
      </header>
      <main>
        <FileUpload /> {/* File upload component */}
        <FileList /> {/* File list component */}
      </main>
    </div>
  );
}

export default App;
