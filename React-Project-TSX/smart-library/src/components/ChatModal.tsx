import React, { useState } from 'react';
import axios from 'axios';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    "Hello, I am the AI ChatBot! I’m here to help you with anything you’re looking for. Please provide your descriptions below and I’ll show the relative content."
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage = inputValue;
    setMessages((prevMessages) => [...prevMessages, `You: ${userMessage}`]);
    setInputValue('');
    setIsLoading(true);

    try {
      const botResponse = await sendMessageToChatbot(userMessage);
      setMessages((prevMessages) => [...prevMessages, `Bot: ${botResponse}`]);
    } catch (error) {
      setMessages((prevMessages) => [...prevMessages, `Bot: Sorry, something went wrong.`]);
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessageToChatbot = async (message: string) => {
    try {
      const response = await axios.post('http://localhost:8001/chat', { query: message }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
      return 'Error';
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 w-[90vw] max-w-[452px] h-[90vh] max-h-[602px]">
      <div className="w-full h-full bg-black rounded-lg flex flex-col p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-['Work Sans'] text-white">AI Chatbot</h2>
          <button
            onClick={onClose}
            className="text-white"
          >
            Close
          </button>
        </div>
        <div className="flex-grow bg-[#172242] rounded-lg p-4 overflow-auto mb-3">
          {messages.map((message, index) => (
            <div key={index} className="bg-[#445a9a] rounded-lg p-4 mb-4">
              <div className="text-white text-lg font-normal font-['Work Sans'] leading-tight tracking-tight">
                {message}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center items-center h-20">
              <div className="dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="flex-grow bg-[#445a9a] rounded-[20px] text-white p-2"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyUp={handleKeyPress}
            placeholder="Insert text"
          />
          <button
            onClick={handleSendMessage}
            className="bg-[#445a9a] rounded-[20px] text-white p-2"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
