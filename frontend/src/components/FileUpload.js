import React from 'react';
import axios from 'axios';

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

                //Headers were diffrent when requesting the presigned url
                //uploading causing the access denied error for upload
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
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Server responded with an error status:', error.response.status);
                console.error('Error details:', error.response.data);
                this.setError(`Error: ${error.response.status} - ${error.response.data}`);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
                this.setError('No response received from server. Please check your network connection.');
            } else {
                // Something happened in setting up the request that triggered an Error
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
            <div>
                <h3>File Upload using React!</h3>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                {presignedUrl && (
                    <div>
                        <p>Presigned URL: {presignedUrl}</p>
                    </div>
                )}

                <form onSubmit={this.onFileUpload}>
                    <label>
                        Text input:
                        <input type="text" name="textInput" />
                    </label>
                    <div>
                        <label>
                            File Input:
                            <input type="file" onChange={this.onFileChange} />
                        </label>
                    </div>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

export default FileUpload;
