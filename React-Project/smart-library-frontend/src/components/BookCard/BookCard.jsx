// BookCard.jsx

import React from 'react';
import './BookCard.css';

const BookCard = ({ books }) => {
    return (
        <div className="book-grid">
            {books.map((book, index) => (
                <div key={index} className="book-card">
                    <div className="book-inner">
                        <div className="book-front">
                            <img src={book.cover} alt={book.title} aria-label={book.title} />
                            <div className="book-title">{book.title}</div>
                            <div className="book-rating">
                                {'★'.repeat(book.average_rating)}
                                {'☆'.repeat(5 - book.average_rating)}
                            </div>
                        </div>
                        <div className="book-back">
                            <div className="book-title">{book.title}</div>
                            <p>{book.description}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BookCard;
