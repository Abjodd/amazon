import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
    const [socialMediaUrl, setSocialMediaUrl] = useState('');
    const [postsData, setPostsData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUrlSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/social-media/extract', {
                url: socialMediaUrl,
            });
            console.log('Received posts data:', response.data); // Log the received data
            setPostsData(response.data);
            setError(null);
        } catch (error) {
            setError('Error extracting posts: ' + (error.response?.data?.message || error.message));
            setPostsData([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard">
            <h1>Extract Social Media Posts</h1>
            <form onSubmit={handleUrlSubmit}>
                <label>
                    Social Media URL:
                    <input
                        type="text"
                        value={socialMediaUrl}
                        onChange={(e) => setSocialMediaUrl(e.target.value)}
                    />
                </label>
                <button type="submit" disabled={loading}>
                    {loading ? 'Extracting...' : 'Extract'}
                </button>
            </form>

            {error && <p className="error">{error}</p>}

            {postsData.length > 0 && (
                <div className="posts-data">
                    <h2>Posts Data:</h2>
                    {postsData.map((post, index) => (
                        <div key={index} className="post-data">
                            <img src={`http://localhost:5000/api/proxy?url=${encodeURIComponent(post.imageUrl)}`} alt="Post" />
                            <p>{post.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;