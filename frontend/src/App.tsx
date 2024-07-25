import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import { Container } from 'react-bootstrap';

const App = () => {
    const [files, setFiles] = useState([]);
    const [loadingFiles, setLoadingFiles] = useState(false);
    const apiUrl = process.env.REACT_APP_API_GATEWAY_URL;

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
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
    };

    const handleFileUploadSuccess = () => {
        fetchFiles();  // Reload the file list
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">File Management App</h1>
            <FileUpload apiUrl={apiUrl} onUploadSuccess={handleFileUploadSuccess} />
            {loadingFiles ? (
                <p>Loading files...</p>
            ) : (
                <FileList files={files} apiUrl={apiUrl} />
            )}
        </Container>
    );
};

export default App;
