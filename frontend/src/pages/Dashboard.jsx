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
            <div className="dashboard-container">
                <h1 className="dashboard-title">Extract Social Media Posts</h1>
                <form onSubmit={handleUrlSubmit} className="dashboard-form">
                    <label className="form-label">
                        Social Media URL:
                        <input
                            type="text"
                            className="form-input"
                            value={socialMediaUrl}
                            onChange={(e) => setSocialMediaUrl(e.target.value)}
                            placeholder="Enter the social media URL"
                        />
                    </label>
                    <button type="submit" className="form-button" disabled={loading}>
                        {loading ? 'Extracting...' : 'Extract'}
                    </button>
                </form>

                {error && <p className="error-message">{error}</p>}

                {postsData.length > 0 && (
                    <div className="posts-container">
                        <h2 className="posts-title">Posts Data:</h2>
                        <div className="posts-grid">
                            {postsData.map((post, index) => (
                                <div key={index} className="post-card">
                                    <img
                                        src={`http://localhost:5000/api/proxy?url=${encodeURIComponent(post.imageUrl)}`}
                                        alt="Post"
                                        className="post-image"
                                    />
                                    <p className="post-description">{post.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
