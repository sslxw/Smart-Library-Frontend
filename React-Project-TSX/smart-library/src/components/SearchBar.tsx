import React, { useState } from 'react';
import SearchImage from '../assets/Search.svg';
import Utils from '../assets/Group.svg';
import Heart from '../assets/HeartSearch.svg';
import FilledHeart from '../assets/HeartFilled.svg';
import DropdownMenu from '../components/DropDownMenu';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSort: (order: string, type: string) => void; 
  onGetLikedBooks: (showLiked: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onSort, onGetLikedBooks }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHeartFilled, setIsHeartFilled] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSort = (order: string, type: string) => {
    onSort(order, type);
    setIsDropdownOpen(false);
  };

  const handleHeartClick = async () => {
    {
      const newHeartState = !isHeartFilled;
      setIsHeartFilled(newHeartState);
      onGetLikedBooks(newHeartState);
    } 
  };

  return (
    <div className="relative w-full px-4 my-4">
      <div className="flex items-center h-10 border border-[#172242] rounded-lg bg-[#172242] relative">
        <div className="bg-[#172242] h-full flex items-center justify-center px-3 rounded-l-lg">
          <img className="w-5 h-5" src={SearchImage} alt="Search icon" />
        </div>
        <div className="flex-1 h-full bg-[#445a9a] flex items-center pl-3 rounded-xl">
          <input
            type="text"
            placeholder="Type book title/genre/name of author"
            className="w-full h-full bg-transparent text-[#aeb0b6] text-base font-normal outline-none rounded-r-lg"
            style={{ fontFamily: 'Work Sans, sans-serif' }}
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="relative bg-[#172242] flex items-center justify-center px-3 cursor-pointer" onClick={toggleDropdown}>
          <img className="w-5 h-5" src={Utils} alt="Utils icon" />
          {isDropdownOpen && (
            <div className="absolute top-full right-40 mt-2">
              <DropdownMenu onSort={handleSort} />
            </div>
          )}
        </div>
        <div className="bg-[#172242] flex items-center justify-center px-3 cursor-pointer" onClick={handleHeartClick}>
          <img className="w-5 h-5" src={isHeartFilled ? FilledHeart : Heart} alt="Heart icon" />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
