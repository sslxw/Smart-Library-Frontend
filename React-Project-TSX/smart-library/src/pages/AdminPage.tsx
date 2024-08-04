import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import DeleteIcon from '../assets/Delete.svg'; 
import ProfileIcon from '../assets/Profile.svg'; 
import AuthContext from '../handlers/AuthContext';

const AdminPage: React.FC = () => {
  const { user } = useContext(AuthContext); 
  const [books, setBooks] = useState<any[]>([]);
  const [currentBookPage, setCurrentBookPage] = useState<number>(1);
  const [isBookLoading, setIsBookLoading] = useState<boolean>(false);
  const [isBookEndOfList, setIsBookEndOfList] = useState<boolean>(false);
  const [currentUserPage, setCurrentUserPage] = useState<number>(1);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(false);
  const [isUserEndOfList, setIsUserEndOfList] = useState<boolean>(false);

  const booksPageSize = 10;
  const usersPageSize = 12;

  const [newBook, setNewBook] = useState({
    title: '',
    authorId: '',
    genre: '',
    average_rating: '',
    published_year: '',
    description: '',
    cover: ''
  });

  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchBooks(currentBookPage, booksPageSize);
  }, [currentBookPage]);

  useEffect(() => {
    fetchUsers(currentUserPage, usersPageSize);
  }, [currentUserPage]);

  const fetchBooks = async (page: number, pageSize: number) => {
    setIsBookLoading(true);
    try {
      const response = await axios.get('http://localhost:8001/books', {
        params: {
          page: page,
          page_size: pageSize,
        },
      });
      const booksData = response.data.books || response.data;
      setIsBookEndOfList(booksData.length < pageSize);
      setBooks(booksData);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setIsBookLoading(false);
    }
  };

  const fetchUsers = async (page: number, pageSize: number) => {
    setIsUserLoading(true);
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('http://localhost:8001/admin/users', {
            params: {
              page: page,
              page_size: pageSize
            },
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
      const usersData = response.data;
      setIsUserEndOfList(usersData.length < pageSize);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsUserLoading(false);
    }
  };

  const handleBookPageChange = (page: number) => {
    if (!isBookEndOfList || page < currentBookPage) {
      setCurrentBookPage(page);
    }
  };

  const handleUserPageChange = (page: number) => {
    if (!isUserEndOfList || page < currentUserPage) {
      setCurrentUserPage(page);
    }
  };

  const renderBookPagination = () => {
    const pages = [];
    const maxPageButtons = 5;
    const startPage = Math.max(1, currentBookPage - Math.floor(maxPageButtons / 2));
    const endPage = startPage + maxPageButtons - 1;

    for (let i = startPage; i <= endPage; i++) {
      if (i > 0 && (i < currentBookPage || !isBookEndOfList)) {
        pages.push(
          <button
            key={i}
            className={`px-3 py-1 mx-1 rounded ${i === currentBookPage ? 'bg-[#445a9a] text-white' : 'bg-[#172242] text-white'}`}
            onClick={() => handleBookPageChange(i)}
          >
            {i}
          </button>
        );
      }
    }
    return pages;
  };

  const renderUserPagination = () => {
    const pages = [];
    const maxPageButtons = 5;
    const startPage = Math.max(1, currentUserPage - Math.floor(maxPageButtons / 2));
    const endPage = startPage + maxPageButtons - 1;

    for (let i = startPage; i <= endPage; i++) {
      if (i > 0 && (i < currentUserPage || !isUserEndOfList)) {
        pages.push(
          <button
            key={i}
            className={`px-3 py-1 mx-1 rounded ${i === currentUserPage ? 'bg-[#445a9a] text-white' : 'bg-[#172242] text-white'}`}
            onClick={() => handleUserPageChange(i)}
          >
            {i}
          </button>
        );
      }
    }
    return pages;
  };

  const handleDeleteBookIconClick = async (bookId: number) => {
    try {
      const token = localStorage.getItem('token'); 

      if (user) {
        await axios.delete(`http://localhost:8001/books/${bookId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBooks(books.filter(book => book.book_id !== bookId));
        console.log('Book deleted successfully');
      } else {
        console.error('User not authenticated');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleDeleteUserIconClick = (user: any) => {
    console.log('Delete icon clicked for user:', user);
    // will implement it later
  };

  const truncateDescription = (description: string, maxLength: number) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + '...';
    }
    return description;
  };

  const handleAddBook = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
      const bookPayload = {
        title: newBook.title,
        author_id: parseInt(newBook.authorId, 10),
        genre: newBook.genre,
        description: newBook.description,
        average_rating: parseFloat(newBook.average_rating),
        published_year: parseInt(newBook.published_year, 10),
        cover: newBook.cover,
      };
      console.log('Payload:', bookPayload);

      if (user) {
        const response = await axios.post(
          'http://localhost:8001/books',
          bookPayload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBooks([...books]);
        setNewBook({
          title: '',
          authorId: '',
          genre: '',
          average_rating: '',
          published_year: '',
          description: '',
          cover: ''
        });
        console.log('Book added successfully' + response.data);
      } else {
        console.error('User not authenticated');
      }
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setNewBook(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <>
      <Header />
      <div className="relative min-h-screen bg-black flex flex-col items-center py-8">
        <div className="w-full max-w-[1274px] h-full flex flex-col md:flex-row gap-4 bg-black">
          <div className="flex-1">
            <div className="w-full text-center text-white text-xl font-medium font-['Work Sans'] tracking-wide mb-4">Admin Panel</div>
            <div className="flex flex-col md:flex-row mt-8 gap-4">
              <div className="w-full md:w-[783px] bg-[#172242] rounded-lg p-4">
                <div className="text-center text-white text-xl font-medium font-['Work Sans'] tracking-wide mb-4">Books</div>
                {isBookLoading ? (
                  <div className="text-center text-white">Loading...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-[#445a9a] border border-[#aeb0b6] rounded-lg">
                      <thead>
                        <tr>
                          <th className="p-2 border border-[#aeb0b6] text-white text-sm font-medium font-['Work Sans'] leading-tight tracking-wide">Delete</th>
                          <th className="p-2 border border-[#aeb0b6] text-white text-sm font-medium font-['Work Sans'] leading-tight tracking-wide">Title</th>
                          <th className="p-2 border border-[#aeb0b6] text-white text-sm font-medium font-['Work Sans'] leading-tight tracking-wide">Author</th>
                          <th className="p-2 border border-[#aeb0b6] text-white text-sm font-medium font-['Work Sans'] leading-tight tracking-wide">Publish Year</th>
                          <th className="p-2 border border-[#aeb0b6] text-white text-sm font-medium font-['Work Sans'] leading-tight tracking-wide">Description</th>
                          <th className="p-2 border border-[#aeb0b6] text-white text-sm font-medium font-['Work Sans'] leading-tight tracking-wide">Genre</th>
                          <th className="p-2 border border-[#aeb0b6] text-white text-sm font-medium font-['Work Sans'] leading-tight tracking-wide">Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {books.map((book, index) => (
                          <tr key={index} className="hover:bg-[#343f67]">
                            <td className="p-2 border border-[#aeb0b6] text-white text-sm font-normal font-['Work Sans'] leading-tight tracking-tight">
                              <button onClick={() => handleDeleteBookIconClick(book.book_id)}>
                                <img src={DeleteIcon} alt="Icon" className="w-12 h-10" />
                              </button>
                            </td>
                            <td className="p-2 border border-[#aeb0b6] text-white text-sm font-normal font-['Work Sans'] leading-tight tracking-tight">{book.title}</td>
                            <td className="p-2 border border-[#aeb0b6] text-white text-sm font-normal font-['Work Sans'] leading-tight tracking-tight">{book.author_id}</td>
                            <td className="p-2 border border-[#aeb0b6] text-white text-sm font-normal font-['Work Sans'] leading-tight tracking-tight">{book.published_year}</td>
                            <td className="p-2 border border-[#aeb0b6] text-white text-sm font-normal font-['Work Sans'] leading-tight tracking-tight">{truncateDescription(book.description, 150)}</td>
                            <td className="p-2 border border-[#aeb0b6] text-white text-sm font-normal font-['Work Sans'] leading-tight tracking-tight">{book.genre}</td>
                            <td className="p-2 border border-[#aeb0b6] text-white text-sm font-normal font-['Work Sans'] leading-tight tracking-tight">{book.average_rating}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex justify-center mt-4">
                      {renderBookPagination()}
                    </div>
                  </div>
                )}
              </div>
              <div className="w-full md:w-[391px] bg-[#172242] rounded-lg p-4 flex flex-col gap-2">
                <div className="text-center text-white text-xl font-medium font-['Work Sans'] tracking-wide mb-4">Users</div>
                {isUserLoading ? (
                  <div className="text-center text-white">Loading...</div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {users.map((user, index) => (
                        <div key={index} className="flex justify-between items-center bg-[#445a9a] border border-[#aeb0b6] rounded-lg p-4">
                          <button onClick={() => handleDeleteUserIconClick(user)}>
                            <img src={DeleteIcon} alt="Delete Icon" className="w-6 h-6" />
                          </button>
                          <img src={ProfileIcon} alt="Profile Icon" className="w-6 h-6" />
                          <div className="text-white text-sm font-normal font-['Work Sans'] leading-tight tracking-tight">{user.username}</div>
                          <div className="text-white text-sm font-normal font-['Work Sans'] leading-tight tracking-tight">{user.role}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center mt-4">
                      {renderUserPagination()}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="w-full bg-[#172242] rounded-lg p-4 mt-8">
              <div className="text-center text-white text-xl font-medium font-['Work Sans'] tracking-wide mb-4">Add Book</div>
              <form onSubmit={handleAddBook} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    name="title"
                    value={newBook.title}
                    onChange={handleInputChange}
                    placeholder="Title"
                    className="flex-1 p-2 bg-[#445a9a] text-white rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    name="authorName"
                    placeholder="Author Name"
                    className="flex-1 p-2 bg-[#445a9a] text-white rounded-lg"
                    required
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="number"
                    name="authorId"
                    value={newBook.authorId}
                    onChange={handleInputChange}
                    placeholder="Author ID"
                    className="flex-1 p-2 bg-[#445a9a] text-white rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    name="genre"
                    value={newBook.genre}
                    onChange={handleInputChange}
                    placeholder="Genre"
                    className="flex-1 p-2 bg-[#445a9a] text-white rounded-lg"
                    required
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="number"
                    name="average_rating"
                    value={newBook.average_rating}
                    onChange={handleInputChange}
                    placeholder="Rating"
                    step="0.1"
                    max="5"
                    min="0"
                    className="flex-1 p-2 bg-[#445a9a] text-white rounded-lg"
                    required
                  />
                  <input
                    type="number"
                    name="published_year"
                    value={newBook.published_year}
                    onChange={handleInputChange}
                    placeholder="Published Year"
                    className="flex-1 p-2 bg-[#445a9a] text-white rounded-lg"
                    required
                  />
                </div>
                <textarea
                  name="description"
                  value={newBook.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  className="w-full p-2 bg-[#445a9a] text-white rounded-lg h-32"
                  required
                />
                <input
                  type="text"
                  name="cover"
                  value={newBook.cover}
                  onChange={handleInputChange}
                  placeholder="Cover Link"
                  className="w-full p-2 bg-[#445a9a] text-white rounded-lg"
                  required
                />
                <button type="submit" className="w-full p-2 bg-[#445a9a] text-white rounded-lg">Add Book</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
