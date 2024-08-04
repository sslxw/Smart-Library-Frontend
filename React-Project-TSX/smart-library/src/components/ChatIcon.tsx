import React from 'react';
import ChatSvg from '../assets/Chat.svg'; 

interface ChatIconProps {
    onClick: () => void;
  }

const ChatIcon: React.FC<ChatIconProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <img 
        src={ChatSvg} 
        alt="Chat Icon" 
        className="w-12 h-12 cursor-pointer" 
        onClick={onClick} 
      />
    </div>
  );
};

export default ChatIcon;