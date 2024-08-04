import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../handlers/AuthContext';

const ProfileDropdown: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  const handleAdminPageClick = () => {
    navigate('/admin');
  };

  if (!user) {
    return (
      <div className="absolute w-32 md:w-20 sm:w-24 bg-[#172242] rounded-lg flex flex-col justify-start items-start gap-2 z-10 shadow-lg font-['Work Sans']">
        <div className="flex flex-col w-full bg-[#172242] border border-[#172242] rounded-lg">
          <div className="w-full px-3 py-2" onClick={handleLoginClick}>
            <div className="text-white text-sm font-normal leading-tight tracking-tight cursor-pointer">Log In</div>
          </div>
          <div className="w-full px-3 py-2" onClick={handleSignupClick}>
            <div className="text-white text-sm font-normal leading-tight tracking-tight cursor-pointer">Sign Up</div>
          </div>
        </div>
      </div>
    );
  }

  if (user.role === 'admin') {
    return (
      <div className="absolute w-32 md:w-20 sm:w-15 bg-[#172242] rounded-lg flex flex-col justify-start items-start gap-2 z-10 shadow-lg font-['Work Sans']">
        <div className="flex flex-col w-full bg-[#172242] border border-[#172242] rounded-lg">
          <div className="w-full px-3 py-2" onClick={handleAdminPageClick}>
            <div className="text-white text-sm font-normal leading-tight tracking-tight cursor-pointer">Admin</div>
          </div>
          <div className="w-full px-3 py-2" onClick={handleLogoutClick}>
            <div className="text-red-500 text-sm font-normal leading-tight tracking-tight cursor-pointer">Sign Out</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute w-32 md:w-20 sm:w-24 bg-[#172242] rounded-lg flex flex-col justify-start items-start gap-2 z-10 shadow-lg font-['Work Sans']">
      <div className="flex flex-col w-full bg-[#172242] border border-[#172242] rounded-lg">
        <div className="w-full px-3 py-2" onClick={handleLogoutClick}>
          <div className="text-red-500 text-sm font-normal leading-tight tracking-tight cursor-pointer">Sign Out</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;
