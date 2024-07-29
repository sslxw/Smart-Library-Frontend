import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import SearchBar from '../../components/SearchBar/SearchBar';
import BookCard from '../../components/BookCard/BookCard';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './BrowsingPage.css';

const BrowsingPage = () => {
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isEndOfList, setIsEndOfList] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const pageSize = 8;

    useEffect(() => {
        fetchBooks(currentPage, pageSize, searchQuery);
    }, [currentPage, searchQuery]);

    const fetchBooks = async (page, pageSize, query) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/books`, {
                params: {
                    page: page,
                    page_size: pageSize,
                    query: query
                }
            });
            const books = response.data;
            setIsEndOfList(books.length < pageSize);
            setBooks(books);
        } catch (error) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (query) => {
        setCurrentPage(1);
        setSearchQuery(query);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="browsing-page">
            <Navbar />
            <div className="divider"></div>
            <div className="content">
                <h1 className='searchTitle'>Smart Library</h1>
                <SearchBar onSearch={handleSearch} />
                {isLoading ? <LoadingSpinner /> : <BookCard books={books} />}
                <div className="pagination">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={isEndOfList}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default BrowsingPage;
