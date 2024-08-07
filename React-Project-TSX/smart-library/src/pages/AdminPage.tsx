import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import DeleteIcon from '../assets/Delete.svg';
import ProfileIcon from '../assets/Profile.svg';
import SearchImage from '../assets/Search.svg';
import EditIcon from '../assets/Edit.svg';
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
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  const [editBook, setEditBook] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchBooks(currentBookPage, booksPageSize, searchQuery);
  }, [currentBookPage, searchQuery]);

  useEffect(() => {
    fetchUsers(currentUserPage, usersPageSize);
  }, [currentUserPage]);

  const fetchBooks = async (page: number, pageSize: number, title?: string) => {
    setIsBookLoading(true);
    try {
      let response;
      if (title) {
        response = await axios.get(`http://localhost:8001/books/title/${title}`, {
          params: { page, page_size: pageSize },
        });
      } else {
        response = await axios.get('http://localhost:8001/books', {
          params: { page, page_size: pageSize },
        });
      }
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
        params: { page, page_size: pageSize },
        headers: { Authorization: `Bearer ${token}` },
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
    const confirmDelete = window.confirm('Are you sure you want to delete this book?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');

      if (user) {
        await axios.delete(`http://localhost:8001/books/${bookId}`, {
          headers: { Authorization: `Bearer ${token}` },
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

  const handleDeleteUserIconClick = async (username: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');

      if (user) {
        await axios.delete(`http://localhost:8001/admin/users/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(users.filter(u => u.username !== username));
        console.log('User deleted successfully');
      } else {
        console.error('User not authenticated');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
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
      const token = localStorage.getItem('token');
      const bookPayload = {
        title: newBook.title,
        author_id: parseInt(newBook.authorId, 10),
        genre: newBook.genre,
        description: newBook.description,
        average_rating: parseFloat(newBook.average_rating),
        published_year: parseInt(newBook.published_year, 10),
        cover: newBook.cover,
      };

      if (user) {
        const response = await axios.post(
          'http://localhost:8001/books',
          bookPayload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBooks([...books, response.data]);
        setNewBook({
          title: '',
          authorId: '',
          genre: '',
          average_rating: '',
          published_year: '',
          description: '',
          cover: ''
        });
        console.log('Book added successfully');
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

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setCurrentBookPage(1);
      fetchBooks(1, booksPageSize, searchQuery);
    }
  };

  const handleEditBookIconClick = (book: any) => {
    setEditBook(book);
  };

  const handleEditInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setEditBook((prevState: any) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleUpdateBook = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editBook) return;

    try {
      const token = localStorage.getItem('token');
      const bookPayload = {
        title: editBook.title,
        author_id: parseInt(editBook.authorId, 10),
        genre: editBook.genre,
        description: editBook.description,
        average_rating: parseFloat(editBook.average_rating),
        published_year: parseInt(editBook.published_year, 10),
        cover: editBook.cover,
      };

      if (user) {
        await axios.put(`http://localhost:8001/books/${editBook.book_id}`, bookPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooks(books.map(book => (book.book_id === editBook.book_id ? editBook : book)));
        setEditBook(null);
        console.log('Book updated successfully');
      } else {
        console.error('User not authenticated');
      }
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleCloseEditForm = () => {
    setEditBook(null);
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
                <div className="w-full px-4 mb-4">
                  <div className="flex items-center h-10 border border-[#172242] rounded-lg bg-[#172242] relative">
                    <div className="bg-[#172242] h-full flex items-center justify-center px-3 rounded-l-lg">
                      <img className="w-5 h-5" src={SearchImage} alt="Search icon" />
                    </div>
                    <div className="flex-1 h-full bg-[#445a9a] flex items-center pl-3 rounded-xl">
                      <input
                        type="text"
                        placeholder="Type book title"
                        className="w-full h-full bg-transparent text-[#aeb0b6] text-base font-normal outline-none rounded-r-lg"
                        style={{ fontFamily: 'Work Sans, sans-serif' }}
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        onKeyDown={handleSearchKeyDown}
                      />
                    </div>
                  </div>
                </div>
                {isBookLoading ? (
                  <div className="text-center text-white">Loading...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-[#445a9a] border border-[#aeb0b6] rounded-lg">
                      <thead>
                        <tr>
                          <th className="p-2 border border-[#aeb0b6] text-white text-sm font-medium font-['Work Sans'] leading-tight tracking-wide">Delete</th>
                          <th className="p-2 border border-[#aeb0b6] text-white text-sm font-medium font-['Work Sans'] leading-tight tracking-wide">Edit</th>
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
                          <>
                            <tr key={index} className="hover:bg-[#343f67]">
                              <td className="p-2 border border-[#aeb0b6] text-white text-sm font-normal font-['Work Sans'] leading-tight tracking-tight">
                                <button onClick={() => handleDeleteBookIconClick(book.book_id)}>
                                  <img src={DeleteIcon} alt="Delete Icon" className="w-9 h-10 ml-1" />
                                </button>
                              </td>
                              <td className="p-2 border border-[#aeb0b6] text-white text-sm font-normal font-['Work Sans'] leading-tight tracking-tight">
                                <button onClick={() => handleEditBookIconClick(book)}>
                                  <img src={EditIcon} alt="Edit Icon" className="w-10 h-10" />
                                </button>
                              </td>
                              <td className="p-2 border border-[#aeb0b6] text-white text-sm font-normal font-['Work Sans'] leading-tight tracking-tight">{book.title}</td>
                              <td className="p-2 border border-[#aeb0b6] text-white text-sm font-normal font-['Work Sans'] leading-tight tracking-tight">{book.author_id}</td>
                              <td className="p-2 border border-[#aeb0b6] text-white text-sm font-normal font-['Work Sans'] leading-tight tracking-tight">{book.published_year}</td>
                              <td className="p-2 border border-[#aeb0b6] text-white text-sm font-normal font-['Work Sans'] leading-tight tracking-tight">{truncateDescription(book.description, 150)}</td>
                              <td className="p-2 border border-[#aeb0b6] text-white text-sm font-normal font-['Work Sans'] leading-tight tracking-tight">{book.genre}</td>
                              <td className="p-2 border border-[#aeb0b6] text-white text-sm font-normal font-['Work Sans'] leading-tight tracking-tight">{book.average_rating}</td>
                            </tr>
                            {editBook && editBook.book_id === book.book_id && (
                              <tr key={`edit-${index}`} className="bg-[#343f67]">
                                <td colSpan={8} className="p-4 border border-[#aeb0b6]">
                                  <form onSubmit={handleUpdateBook} className="space-y-4">
                                    <div className="flex justify-between">
                                      <div className="text-center text-white text-xl font-medium font-['Work Sans'] tracking-wide mb-4">Edit Book</div>
                                      <button type="button" onClick={handleCloseEditForm} className="text-white">Close</button>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-4">
                                      <input
                                        type="text"
                                        name="title"
                                        value={editBook.title}
                                        onChange={handleEditInputChange}
                                        placeholder="Title"
                                        className="flex-1 p-2 bg-[#445a9a] text-white rounded-lg"
                                        required
                                      />
                                      <input
                                        type="number"
                                        name="authorId"
                                        value={editBook.authorId}
                                        onChange={handleEditInputChange}
                                        placeholder="Author ID"
                                        className="flex-1 p-2 bg-[#445a9a] text-white rounded-lg"
                                        required
                                      />
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-4">
                                      <input
                                        type="text"
                                        name="genre"
                                        value={editBook.genre}
                                        onChange={handleEditInputChange}
                                        placeholder="Genre"
                                        className="flex-1 p-2 bg-[#445a9a] text-white rounded-lg"
                                        required
                                      />
                                      <input
                                        type="number"
                                        name="average_rating"
                                        value={editBook.average_rating}
                                        onChange={handleEditInputChange}
                                        placeholder="Rating"
                                        step="0.1"
                                        max="5"
                                        min="0"
                                        className="flex-1 p-2 bg-[#445a9a] text-white rounded-lg"
                                        required
                                      />
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-4">
                                      <input
                                        type="number"
                                        name="published_year"
                                        value={editBook.published_year}
                                        onChange={handleEditInputChange}
                                        placeholder="Published Year"
                                        className="flex-1 p-2 bg-[#445a9a] text-white rounded-lg"
                                        required
                                      />
                                      <input
                                        type="text"
                                        name="cover"
                                        value={editBook.cover}
                                        onChange={handleEditInputChange}
                                        placeholder="Cover Link"
                                        className="flex-1 p-2 bg-[#445a9a] text-white rounded-lg"
                                        required
                                      />
                                    </div>
                                    <textarea
                                      name="description"
                                      value={editBook.description}
                                      onChange={handleEditInputChange}
                                      placeholder="Description"
                                      className="w-full p-2 bg-[#445a9a] text-white rounded-lg h-32"
                                      required
                                    />
                                    <button type="submit" className="w-full p-2 bg-[#445a9a] text-white rounded-lg">Update Book</button>
                                  </form>
                                </td>
                              </tr>
                            )}
                          </>
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
                        <div key={index} className="flex justify-between items-center bg-[#445a9a] border border-[#aeb0b6] rounded-lg p-4 hover:bg-[#343f67]">
                          <button onClick={() => handleDeleteUserIconClick(user.username)}>
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
