import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './App.css'; // Import custom CSS

function App() {
  return (
    <Container fluid className="App">
      <header className="App-header py-3">
        <h1>File Management App</h1>
      </header>
      <main className="py-3">
        <Row>
          <Col md={6} className="mb-4">
            <FileUpload />
          </Col>
          <Col md={6}>
            <FileList />
          </Col>
        </Row>
      </main>
    </Container>
  );
}

export default App;
