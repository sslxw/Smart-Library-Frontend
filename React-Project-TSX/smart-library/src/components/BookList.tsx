import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import placeholderCover from '../assets/PlaceholderCover.png';

interface Book {
  title: string;
  book_id: number;
  author_id: number;
  published_year: number;
  genre: string;
  average_rating: number;
  cover: string;
  description: string;
  isLiked: boolean;
}

interface BookListProps {
  searchQuery: string;
  sortOrder: string;
  sortType: string;
  fetchLikedBooks: boolean;
  fetchRecommended: boolean;
}

const BookList: React.FC<BookListProps> = ({ searchQuery, sortOrder, sortType, fetchLikedBooks, fetchRecommended }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [likedBooks, setLikedBooks] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLikedBooksLoaded, setIsLikedBooksLoaded] = useState<boolean>(false);
  const [hasMorePages, setHasMorePages] = useState<boolean>(true); 

  const pageSize = 15;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLikedBooksFirst = async () => {
      setIsLoading(true);
      try {
        await fetchAllLikedBooks();
        setIsLikedBooksLoaded(true);
      } catch (error) {
        console.error('Error fetching liked books:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedBooksFirst();
  }, []);

  useEffect(() => {
    if (isLikedBooksLoaded) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          if (fetchLikedBooks) {
            await fetchLikedBooksData();
          } else if (fetchRecommended) {
            await fetchRecommendedBooks(currentPage, pageSize);
          } else {
            await fetchBooks(currentPage, pageSize, searchQuery, sortOrder, sortType);
          }
        } catch (error) {
          console.error('Error fetching books:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [currentPage, searchQuery, sortOrder, sortType, fetchLikedBooks, fetchRecommended, isLikedBooksLoaded]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const fetchAllLikedBooks = async () => {
    try {
      const response = await axios.get('http://localhost:8001/books/likedbooks/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const likedBooksData: Book[] = response.data;
      const likedBooksSet = new Set(likedBooksData.map((book) => book.book_id));
      setLikedBooks(likedBooksSet);
      console.log('Liked books:', likedBooksSet);
    } catch (error) {
      console.error('Error fetching liked books:', error);
    }
  };

  const fetchBooks = async (page: number, pageSize: number, title?: string, order?: string, type?: string) => {
    try {
      const response = await axios.get(getBooksUrl(title, order, type), {
        params: { page, page_size: pageSize },
        headers: { Authorization: `Bearer ${token}` },
      });

      const booksData: Book[] = response.data.books || response.data;
      setBooksWithPagination(booksData);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchLikedBooksData = async () => {
    try {
      const response = await axios.get('http://localhost:8001/books/likedbooks/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const booksData: Book[] = response.data;
      setBooksWithPagination(booksData);
    } catch (error) {
      console.error('Error fetching liked books data:', error);
      alert('Must be logged in');
    }
  };

  const fetchRecommendedBooks = async (page: number, pageSize: number) => {
    try {
      const response = await axios.get('http://localhost:8001/recommendations', {
        params: { page, page_size: pageSize },
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const booksData: Book[] = response.data;
      setBooksWithPagination(booksData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        console.error('Error Data:', errorData);
        alert(`Error fetching recommended books: ${errorData?.detail || 'Unknown error'}`);
      } else if (error instanceof Error) {
        console.error('Error Message:', error.message);
        alert(`Error fetching recommended books: ${error.message}`);
      } else {
        console.error('An unknown error occurred:', error);
        alert('An unknown error occurred.');
      }
    }
  };
  

  const setBooksWithPagination = (booksData: Book[]) => {
    const booksWithLikeStatus = booksData.map((book) => ({
      ...book,
      cover: book.cover === 'No Thumbnail' ? placeholderCover : book.cover,
      isLiked: likedBooks.has(book.book_id),
    }));
    setBooks(booksWithLikeStatus);

    if (booksData.length < pageSize) {
      setHasMorePages(false);  
    } else {
      setHasMorePages(true);  
    }

    console.log('Books fetched with pagination:', booksWithLikeStatus);
  };

  const getBooksUrl = (title?: string, order?: string, type?: string): string => {
    if (title) {
      return `http://localhost:8001/books/title/${title}`;
    } else if (order) {
      return type === 'publish_year'
        ? `http://localhost:8001/books/publish_year/${order}`
        : `http://localhost:8001/books/sorted_by_rating/${order}`;
    }
    return 'http://localhost:8001/books';
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (!hasMorePages && currentPage === 1) return null;  

    const pages = [];
    const maxPageButtons = 5;
    const halfRange = Math.floor(maxPageButtons / 2);
    let startPage = Math.max(1, currentPage - halfRange);
    let endPage = startPage + maxPageButtons - 1;

    if (endPage - startPage < maxPageButtons - 1 && hasMorePages) {
      endPage += 1; 
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`px-3 py-1 mx-1 rounded ${i === currentPage ? 'bg-[#445a9a] text-white' : 'bg-[#172242] text-white'}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center mt-4">
        {pages}
      </div>
    );
  };

  const handleLikeToggle = async (bookId: number) => {
    try {
      if (likedBooks.has(bookId)) {
        await axios.delete(`http://localhost:8001/books/unlike/${bookId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLikedBooks(prev => new Set([...prev].filter(id => id !== bookId)));
      } else {
        await axios.post(`http://localhost:8001/books/like/${bookId}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLikedBooks(prev => new Set(prev).add(bookId));
      }
    } catch (error) {
      console.error('Error toggling like status:', error);
      alert('You need to login to like or unlike a book');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <main className="flex-1 p-4">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div>
            <div className="grid gap-4 p-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {books.map((book, index) => (
                <BookCard key={index} {...book} onLikeToggle={handleLikeToggle} />
              ))}
            </div>
            {renderPagination()}
          </div>
        )}
      </main>
    </div>
  );
};

export default BookList;
