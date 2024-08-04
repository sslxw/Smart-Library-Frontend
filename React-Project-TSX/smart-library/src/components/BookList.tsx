import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import placeholderCover from '../assets/PlaceholderCover.png';

interface Book {
  title: string;
  author: string;
  published_year: number;
  genre: string;
  average_rating: number;
  cover: string;
  description: string;
}

interface BookListProps {
  searchQuery: string;
  sortOrder: string;
}

const BookList: React.FC<BookListProps> = ({ searchQuery, sortOrder }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEndOfList, setIsEndOfList] = useState<boolean>(false);

  const pageSize = 15;
  const token = localStorage.getItem('token'); 

  useEffect(() => {
    fetchBooks(currentPage, pageSize, searchQuery, sortOrder);
  }, [currentPage, searchQuery, sortOrder]);

  const fetchBooks = async (page: number, pageSize: number, title?: string, order?: string) => {
    setIsLoading(true);
    try {
      const response = title
        ? await axios.get(`http://localhost:8001/books/title/${title}`, {
            params: { page, page_size: pageSize },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        : order
        ? await axios.get(`http://localhost:8001/books/sorted_by_rating/${order}`, {
            params: { page, page_size: pageSize },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        : await axios.get('http://localhost:8001/books', {
            params: { page, page_size: pageSize },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

      const booksData: Book[] = response.data.books || response.data;
      const books = booksData.map(book => ({
        ...book,
        rating: book.average_rating || 0,
        fillPercentage: (book.average_rating / 5) * 100,
        cover: book.cover === 'No Thumbnail' ? placeholderCover : book.cover,
      }));
      setIsEndOfList(books.length < pageSize);
      setBooks(books);
      console.log('Books fetched:', books);
      console.log('Is end of list:', isEndOfList);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data.message || error.message);
      } else {
        alert((error as Error).message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (!isEndOfList || page < currentPage) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxPageButtons = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = startPage + maxPageButtons - 1;

    for (let i = startPage; i <= endPage; i++) {
      if (i > 0 && (i < currentPage || !isEndOfList)) {
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
                <BookCard author_id={0} fillPercentage={0} key={index} {...book} />
              ))}
            </div>
            <div className="flex justify-center mt-4">
              {renderPagination()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BookList;
