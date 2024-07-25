import React from 'react';
import axios from 'axios';

class FileList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            apiUrl: process.env.REACT_APP_API_GATEWAY_URL,
            error: null,
            noFilesMessage: null,
        };
    }

    componentDidMount() {
        this.fetchFiles();
    }

    fetchFiles = async () => {
        const { apiUrl } = this.state;

        try {
            const response = await axios.get(`${apiUrl}listFiles`);

            if (response.status === 200) {
                const files = response.data;

                if (files.length === 0) {
                    this.setState({ noFilesMessage: 'No files present.' });
                } else {
                    this.setState({ files, noFilesMessage: null });
                }
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

    handleDelete = async (fileName) => {
        const { apiUrl } = this.state;
    
        try {
            const response = await axios.delete(`${apiUrl}deleteFile`, {
                params: { key: fileName },
            });
    
            if (response.status === 200) {
                // Remove the file from the state
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
        const { files, error, noFilesMessage } = this.state;

        return (
            <div>
                <h3>File List</h3>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                {noFilesMessage && <div style={{ color: 'gray' }}>{noFilesMessage}</div>}
                {files.length > 0 && (
                    <ul>
                        {files.map((file, index) => (
                            <li key={index}>
                                {file.key}
                                <button onClick={() => this.handleDelete(file.key)}>Delete</button>
                                <button onClick={() => this.handleDownload(file.key)}>Download</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }
}

export default FileList;
