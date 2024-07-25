import React from 'react';
import axios from 'axios';
import './FileUpload.css'; // Create a CSS file for custom styling

class FileUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            apiUrl: process.env.REACT_APP_API_GATEWAY_URL,
            error: null,
            presignedUrl: null
        };
    }

    onFileChange = event => {
        this.setState({ selectedFile: event.target.files[0] });
    };

    onFileUpload = async event => {
        event.preventDefault();
        const { selectedFile, apiUrl } = this.state;

        if (!selectedFile) {
            alert('No file selected!');
            return;
        }

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

                alert('File uploaded successfully!');
                console.log('File uploaded successfully:', uploadResponse.data);
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

    setError = errorMessage => {
        this.setState({ error: errorMessage });
    };

    render() {
        const { error, presignedUrl } = this.state;
        return (
            <div className="file-upload-container">
                <h3>File Upload</h3>
                {error && <div className="error-message">{error}</div>}
                {presignedUrl && (
                    <div className="presigned-url">
                        <p>Presigned URL: {presignedUrl}</p>
                    </div>
                )}

                <form onSubmit={this.onFileUpload}>
                    <div className="file-input-container">
                        <input type="file" onChange={this.onFileChange} />
                    </div>
                    <button type="submit">Upload</button>
                </form>
            </div>
        );
    }
}

export default FileUpload;
