import React, { useState } from 'react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    "Bot: Hello, I am the AI ChatBot! I’m here to help you with anything you’re looking for. Please provide your descriptions below and I’ll show the relative content."
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage = inputValue;
    setMessages((prevMessages) => [...prevMessages, `You: ${userMessage}`, "Bot: "]);
    setInputValue('');
    setIsLoading(true);

    const eventSource = new EventSource(`http://localhost:8001/chat?query=${encodeURIComponent(userMessage)}`);

    eventSource.onmessage = (event) => {
      const chunk = event.data;
      console.log("Received chunk:", chunk);

      if (chunk && chunk !== 'end') {
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1] += chunk;
          return newMessages;
        });
      } else if (chunk === 'end') {
        setIsLoading(false);
        eventSource.close();  
      }
    };

    eventSource.onerror = (event) => {
      console.error('EventSource error:', event);
      setIsLoading(false);
      setMessages((prevMessages) => [...prevMessages, 'Bot: Sorry, there was an error processing your request.']);
      eventSource.close();  
    };

    eventSource.addEventListener('close', () => {
      setIsLoading(false);
      eventSource.close();
    });
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
              <div className="text-white text-lg font-normal font-['Work Sans'] leading-tight tracking-tight whitespace-pre-wrap break-words">
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
