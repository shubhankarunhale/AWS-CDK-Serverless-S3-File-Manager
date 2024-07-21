import React from 'react';
import logo from './logo.svg';
import './App.css';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList'; // Import the FileList component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>File Management App</h1>
        <FileUpload /> {/* File upload component */}
        <FileList /> {/* File list component */}
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
