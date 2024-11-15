// frontend/src/components/ListingCard.jsx
import React from 'react';

const ListingCard = ({ post }) => (
    <div className="card">
        <img src={post.image} alt={post.title} />
        <h2>{post.title}</h2>
        <p>{post.description}</p>
    </div>
);

export default ListingCard;
