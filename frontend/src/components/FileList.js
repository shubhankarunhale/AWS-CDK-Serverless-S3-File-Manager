import React from 'react';
import axios from 'axios';

class FileList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            apiUrl: process.env.REACT_APP_API_GATEWAY_URL,
            error: null,
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
                this.setState({ files: response.data });
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
                    files: prevState.files.filter(file => file.key !== fileName)
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
        const { files, error } = this.state;

        return (
            <div>
                <h3>File List</h3>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <ul>
                    {files.map((file, index) => (
                        <li key={index}>
                            {file.key}
                            <button onClick={() => this.handleDelete(file.key)}>Delete</button>
                            <button onClick={() => this.handleDownload(file.key)}>Download</button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default FileList;
