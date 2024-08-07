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
}

const BookList: React.FC<BookListProps> = ({ searchQuery, sortOrder, sortType, fetchLikedBooks }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [likedBooks, setLikedBooks] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLikedBooksLoaded, setIsLikedBooksLoaded] = useState<boolean>(false);

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
  }, [currentPage, searchQuery, sortOrder, sortType, fetchLikedBooks, isLikedBooksLoaded]);

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
      console.log('Liked books:', likedBooksSet); // logged liked books to debug
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const fetchBooks = async (page: number, pageSize: number, title?: string, order?: string, type?: string) => {
    try {
      const response = await axios.get(getBooksUrl(title, order, type), {
        params: { page, page_size: pageSize },
        headers: { Authorization: `Bearer ${token}` },
      });

      const booksData: Book[] = response.data.books || response.data;
      const booksWithLikeStatus = booksData.map((book) => ({
        ...book,
        cover: book.cover === 'No Thumbnail' ? placeholderCover : book.cover,
        isLiked: likedBooks.has(book.book_id),
      }));
      setBooks(booksWithLikeStatus);
      console.log('Books fetched:', booksWithLikeStatus);
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const fetchLikedBooksData = async () => {
    try {
      const response = await axios.get('http://localhost:8001/books/likedbooks/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const booksData: Book[] = response.data;
      const booksWithLikeStatus = booksData.map((book) => ({
        ...book,
        cover: book.cover === 'No Thumbnail' ? placeholderCover : book.cover,
        isLiked: true,
      }));
      setBooks(booksWithLikeStatus);
      console.log('Liked Books fetched:', booksWithLikeStatus);
    } catch (error) {
      handleAxiosError(error);
      alert('Must be logged in');
    }
  };

  const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data.message || error.message);
    } else {
      console.error((error as Error).message);
    }
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
    const pages = [];
    const maxPageButtons = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = startPage + maxPageButtons - 1;

    for (let i = startPage; i <= endPage; i++) {
      if (i > 0) {
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
    }
    console.log('Rendered pages:', pages);
    return pages;
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
                <BookCard key={index} {...book} />
              ))}
            </div>
            <div className="flex justify-center mt-4">{renderPagination()}</div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BookList;
