import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.svg'; 
import Profile from '../assets/Profile.svg';
import ProfileLoggedIn from '../assets/ProfileLoggedin.svg'; 
import ProfileDropdown from '../components/ProfileDropDown';
import AuthContext from '../handlers/AuthContext';

const Header: React.FC = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="bg-black text-white p-2 flex justify-between items-center">
      <div 
        className="flex items-center cursor-pointer" 
        onClick={handleLogoClick}
      >
        <img 
          src={Logo} 
          alt="Logo" 
          className="w-15 h-6 mr-2 mt-2 ml-2"
        />
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Work Sans, sans-serif' }}>Library</h1>
      </div>
      <div className="relative flex items-center">
        <img 
          className="w-6 h-6 mr-5 cursor-pointer" 
          src={user ? ProfileLoggedIn : Profile}
          alt="Profile Icon"
          onClick={toggleProfileDropdown}
        />
        {isProfileDropdownOpen && (
          <div className={`absolute top-full right-20 mt-2 transition-opacity duration-300 ease-in-out ${isProfileDropdownOpen ? 'opacity-100' : 'opacity-0'}`}>
            <ProfileDropdown />
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
