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

  const toggleChatModal = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSortOrder(''); 
  };

  const handleSort = (order: string) => {
    setSortOrder(order);
    setSearchQuery(''); 
  };

  return (
    <div className="min-h-screen flex flex-col bg-black relative">
      <Header />
      <main className="flex-1 p-4">
        <SearchBar onSearch={handleSearch} onSort={handleSort} />
        <BookList searchQuery={searchQuery} sortOrder={sortOrder} />
      </main>
      <ChatIcon onClick={toggleChatModal} />
      <ChatModal isOpen={isChatOpen} onClose={toggleChatModal} />
    </div>
  );
}

export default BrowsingPage;
