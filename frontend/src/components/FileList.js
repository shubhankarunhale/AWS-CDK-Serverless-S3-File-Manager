import React from 'react';
import axios from 'axios';
import { Container, ListGroup, Button, Alert, Spinner } from 'react-bootstrap';
import './FileList.css'
import 'bootstrap/dist/css/bootstrap.min.css'; 

class FileList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            apiUrl: process.env.REACT_APP_API_GATEWAY_URL,
            error: null,
            noFilesMessage: null,
            loading: false,
        };
    }

    componentDidMount() {
        this.fetchFiles();
    }

    fetchFiles = async () => {
        const { apiUrl } = this.state;
        this.setState({ loading: true });

        try {
            const response = await axios.get(`${apiUrl}listFiles`);

            if (response.status === 200) {
                const files = response.data;

                if (files.length === 0) {
                    this.setState({ noFilesMessage: 'No files present.', files: [], loading: false });
                } else {
                    this.setState({ files, noFilesMessage: null, loading: false });
                }
            } else {
                console.error('Unexpected status code:', response.status);
                this.setError(`Unexpected status code: ${response.status}`);
            }
        } catch (error) {
            this.setState({ loading: false });
            if (error.response) {
                console.error('Server responded with an error status:', error.response.status);
                console.error('Error details:', error.response.data);
                this.setError(`Error: ${error.response.status} - ${error.response.data}`);
            } else if (error.request) {
                console.error('No response received:', error.request);
                this.setError('No response received from server. Please check your network connection.');
            } else {
                console.error('Request setup error:', error.message);
                this.setError(`Request setup error: ${error.message}`);
            }
        }
    };

    setError = errorMessage => {
        this.setState({ error: errorMessage });
    };

    handleDelete = async (fileName) => {
        const { apiUrl } = this.state;
    
        try {
            const response = await axios.delete(`${apiUrl}deleteFile`, {
                params: { key: fileName },
            });
    
            if (response.status === 200) {
                this.setState(prevState => ({
                    files: prevState.files.filter(file => file.key !== fileName),
                    noFilesMessage: prevState.files.length === 1 ? 'No files present.' : prevState.noFilesMessage
                }));
            } else {
                console.error('Unexpected status code:', response.status);
                this.setError(`Unexpected status code: ${response.status}`);
            }
        } catch (error) {
            if (error.response) {
                console.error('Server responded with an error status:', error.response.status);
                console.error('Error details:', error.response.data);
                this.setError(`Error: ${error.response.status} - ${error.response.data}`);
            } else if (error.request) {
                console.error('No response received:', error.request);
                this.setError('No response received from server. Please check your network connection.');
            } else {
                console.error('Request setup error:', error.message);
                this.setError(`Request setup error: ${error.message}`);
            }
        }
    };
    
    handleDownload = async (fileName) => {
        const { apiUrl } = this.state;

        try {
            const response = await axios.get(`${apiUrl}getDownloadUrl`, {
                params: { key: fileName }
            });

            if (response.status === 200) {
                const { url } = response.data;
                
                // Open the presigned URL in the same window
                window.location.href = url;
            } else {
                console.error('Unexpected status code:', response.status);
                this.setError(`Unexpected status code: ${response.status}`);
            }
        } catch (error) {
            if (error.response) {
                console.error('Server responded with an error status:', error.response.status);
                console.error('Error details:', error.response.data);
                this.setError(`Error: ${error.response.status} - ${error.response.data}`);
            } else if (error.request) {
                console.error('No response received:', error.request);
                this.setError('No response received from server. Please check your network connection.');
            } else {
                console.error('Request setup error:', error.message);
                this.setError(`Request setup error: ${error.message}`);
            }
        }
    };

    render() {
        const { files, error, noFilesMessage, loading } = this.state;

        return (
            <Container className="mt-5">
                <h3 className="text-center mb-4">Your Files</h3>
                {loading && <Spinner animation="border" variant="primary" />}
                {error && <Alert variant="danger">{error}</Alert>}
                {noFilesMessage && <Alert variant="secondary">{noFilesMessage}</Alert>}
                {files.length > 0 && (
                    <ListGroup>
                        {files.map((file, index) => (
                            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                                {file.key}
                                <div>
                                    <Button class="danger" onClick={() => this.handleDelete(file.key)} className="delete-button">
                                        Delete
                                    </Button>
                                    <Button variant="primary" onClick={() => this.handleDownload(file.key)} className="download-button">
                                        Download
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Container>
        );
    }
}

export default FileList;
