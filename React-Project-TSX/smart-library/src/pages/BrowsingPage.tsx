import React, { useState } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import BookList from '../components/BookList';
import ChatIcon from '../components/ChatIcon';
import ChatModal from '../components/ChatModal';

const BrowsingPage: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');
  const [sortType, setSortType] = useState<string>(''); // Add this state
  const [fetchLikedBooks, setFetchLikedBooks] = useState<boolean>(false);

  const toggleChatModal = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSortOrder('');
    setSortType('');
    setFetchLikedBooks(false);
  };

  const handleSort = (order: string, type: string) => {
    setSortOrder(order);
    setSortType(type);
    setSearchQuery('');
    setFetchLikedBooks(false);
  };

  const handleGetLikedBooks = (showLiked: boolean) => {
    setFetchLikedBooks(showLiked);
    if (!showLiked) {
      setSearchQuery('');
      setSortOrder('');
      setSortType('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black relative">
      <Header />
      <main className="flex-1 p-4">
        <SearchBar
          onSearch={handleSearch}
          onSort={handleSort}
          onGetLikedBooks={handleGetLikedBooks}
        />
        <BookList searchQuery={searchQuery} sortOrder={sortOrder} sortType={sortType} fetchLikedBooks={fetchLikedBooks} />
      </main>
      <ChatIcon onClick={toggleChatModal} />
      <ChatModal isOpen={isChatOpen} onClose={toggleChatModal} />
    </div>
  );
};

export default BrowsingPage;
