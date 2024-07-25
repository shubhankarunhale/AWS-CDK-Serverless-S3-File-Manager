import React from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import './FileUpload.css'

class FileUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            error: null,
            presignedUrl: null,
            uploading: false,
        };
    }

    onFileChange = event => {
        this.setState({ selectedFile: event.target.files[0] });
    };

    onFileUpload = async event => {
        event.preventDefault();
        const { selectedFile } = this.state;
        const { apiUrl, onUploadSuccess } = this.props;

        if (!selectedFile) {
            this.setError('No file selected!');
            return;
        }

        this.setState({ uploading: true });

        try {
            const response = await axios.post(`${apiUrl}getPresignedUrl`, { key: selectedFile.name });

            if (response.status === 200) {
                const { url, fields } = response.data;
                this.setState({ presignedUrl: url });

                const formData = new FormData();
                Object.entries(fields).forEach(([key, value]) => {
                    formData.append(key, value);
                });
                formData.append('file', selectedFile);

                const uploadResponse = await axios.post(url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                });

                this.setState({ uploading: false });
                
                console.log('File uploaded successfully:', uploadResponse.data);

                // Notify parent component to refresh the file list
                if (onUploadSuccess) {
                    onUploadSuccess();
                }
            } else {
                console.error('Unexpected status code:', response.status);
                this.setError(`Unexpected status code: ${response.status}`);
            }
        } catch (error) {
            this.setState({ uploading: false });
            if (error.response) {
                console.error('Server responded with an error status:', error.response.status);
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

    render() {
        const { error, uploading } = this.state;
        return (
            <Container className="file-upload-container mt-5">
                <h3 className="text-center mb-4">Upload a File</h3>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={this.onFileUpload}>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Select file to upload</Form.Label>
                        <Form.Control type="file" onChange={this.onFileChange} />
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={uploading}>
                        {uploading ? <Spinner as="span" animation="border" size="sm" /> : 'Upload'}
                    </Button>
                </Form>
            </Container>
        );
    }
}

export default FileUpload;
