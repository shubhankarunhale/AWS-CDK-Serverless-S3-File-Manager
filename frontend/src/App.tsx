import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import './App.css';  

const App = () => {
    const [files, setFiles] = useState([]);
    const [loadingFiles, setLoadingFiles] = useState(false);
    const apiUrl = process.env.REACT_APP_API_GATEWAY_URL;

    const fetchFiles = useCallback(async () => {
        setLoadingFiles(true);
        try {
            const response = await axios.get(`${apiUrl}listFiles`);
            if (response.status === 200) {
                setFiles(response.data);
            } else {
                console.error('Unexpected status code:', response.status);
            }
        } catch (error) {
            console.error('Error fetching files:', error);
        } finally {
            setLoadingFiles(false);
        }
    }, [apiUrl]);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    const handleFileUploadSuccess = () => {
        fetchFiles();  // Reload the file list
    };

    return (
        <Container className="App">
            
            <Row className="mb-4">
                <Col>
                    <img src="/logo.gif" alt="Animated Logo" className="App-logo" />
                </Col>
                
            </Row>
            <Row className="mb-4">
                
                <Col>
                    <FileUpload apiUrl={apiUrl} onUploadSuccess={handleFileUploadSuccess} />
                </Col>
            </Row>
            <Row>
                <Col>
                    {loadingFiles ? (
                        <div className="text-center">
                            <Spinner animation="border" />
                            <p>Loading files...</p>
                        </div>
                    ) : (
                        <FileList files={files} apiUrl={apiUrl} />
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default App;
