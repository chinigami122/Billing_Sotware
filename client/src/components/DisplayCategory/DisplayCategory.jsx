import './DisplayCategory.css';
import React from 'react';

const DisplayCategory = ({ categories, selectedCategory, setSelectedCategory }) => {
    return (
        <div className="category-pill-bar">
            <div 
                className={`category-pill ${selectedCategory === null ? 'active' : ''}`}
                onClick={() => setSelectedCategory(null)}
            >
                <span className="category-pill-name">All Categories</span>
            </div>
            {categories.map((category) => (
                <div
                    key={category.categoryId}
                    className={`category-pill ${selectedCategory === category.categoryId ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.categoryId)}
                >
                    <img src={category.imgUrl} alt={category.name} className="category-pill-icon" />
                    <span className="category-pill-name">{category.name}</span>
                </div>
            ))}
        </div>
    );
};

export default DisplayCategory;