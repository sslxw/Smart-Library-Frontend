import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Heart from '../assets/Heart.svg';
import FilledHeart from "../assets/HeartFilled.svg"

interface BookCardProps {
  title: string;
  author_id: number;
  published_year: number;
  genre: string;
  cover: string;
  average_rating: number;
  fillPercentage: number;
  description: string;
}

const StarSVG: React.FC<{ fillPercentage: number }> = ({ fillPercentage }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="star-svg"
  >
    <defs>
      <linearGradient id="grad1" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset={`${fillPercentage}%`} style={{ stopColor: '#FFE45A', stopOpacity: 1 }} />
        <stop offset={`${fillPercentage}%`} style={{ stopColor: 'gray', stopOpacity: 1 }} />
      </linearGradient>
      <clipPath id="starClip">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.7499 4.5C11.6589 4.5 11.4349 4.525 11.3159 4.763L9.48992 8.414C9.20092 8.991 8.64392 9.392 7.99992 9.484L3.91192 10.073C3.64192 10.112 3.54992 10.312 3.52192 10.396C3.49692 10.477 3.45692 10.683 3.64292 10.861L6.59892 13.701C7.06992 14.154 7.28392 14.807 7.17192 15.446L6.47592 19.456C6.43292 19.707 6.58992 19.853 6.65992 19.903C6.73392 19.959 6.93192 20.07 7.17692 19.942L10.8319 18.047C11.4079 17.75 12.0939 17.75 12.6679 18.047L16.3219 19.941C16.5679 20.068 16.7659 19.957 16.8409 19.903C16.9109 19.853 17.0679 19.707 17.0249 19.456L16.3269 15.446C16.2149 14.807 16.4289 14.154 16.8999 13.701L19.8559 10.861C20.0429 10.683 20.0029 10.476 19.9769 10.396C19.9499 10.312 19.8579 10.112 19.5879 10.073L15.4999 9.484C14.8569 9.392 14.2999 8.991 14.0109 8.413L12.1829 4.763C12.0649 4.525 11.8409 4.5 11.7499 4.5ZM6.94692 21.5C6.53392 21.5 6.12392 21.37 5.77292 21.114C5.16692 20.67 4.86992 19.937 4.99892 19.199L5.69492 15.189C5.72092 15.04 5.66992 14.889 5.55992 14.783L2.60392 11.943C2.05992 11.422 1.86492 10.652 2.09492 9.937C2.32692 9.214 2.94092 8.697 3.69792 8.589L7.78592 8C7.94392 7.978 8.07992 7.881 8.14792 7.743L9.97492 4.091C10.3119 3.418 10.9919 3 11.7499 3C12.5079 3 13.1879 3.418 13.5249 4.091L15.3529 7.742C15.4219 7.881 15.5569 7.978 15.7139 8L19.8019 8.589C20.5589 8.697 21.1729 9.214 21.4049 9.937C21.6349 10.652 21.4389 11.422 20.8949 11.943L17.9389 14.783C17.8289 14.889 17.7789 15.04 17.8049 15.188L18.5019 19.199C18.6299 19.938 18.3329 20.671 17.7259 21.114C17.1109 21.565 16.3099 21.626 15.6309 21.272L11.9779 19.379C11.8349 19.305 11.6639 19.305 11.5209 19.379L7.86792 21.273C7.57592 21.425 7.26092 21.5 6.94692 21.5Z"
        />
      </clipPath>
    </defs>
    <rect x="0" y="0" width="24" height="24" fill="url(#grad1)" clipPath="url(#starClip)" />
  </svg>
);

const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};

const BookCard: React.FC<BookCardProps> = ({ title, author_id, published_year, genre, cover, average_rating, fillPercentage, description }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [authorName, setAuthorName] = useState<string>('');
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const maxDescriptionLength = 550; 
  const maxTitleLength = 22; 
  const maxAuthorNameLength = 20; 

  useEffect(() => {
    const fetchAuthorName = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8001/authors/${author_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setAuthorName(response.data.name);
      } catch (error) {
        console.error('Error fetching author:', error);
      }
    };

    fetchAuthorName();
  }, [author_id]);

  const handleHeartClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevents the card flip
    setIsHeartFilled(!isHeartFilled); // Toggles the heart icon
  };

  return (
    <div className="relative w-64 h-[28rem] m-4" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`absolute w-full h-full transition-transform transform ${isFlipped ? 'rotate-y-180' : ''}`}>
        <div className="absolute w-full h-full backface-hidden bg-[#172242] rounded-lg p-4 flex flex-col justify-between text-white">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-lg font-medium font-['Work Sans']">{truncateText(title, maxTitleLength)}</h2>
              <img
                src={isHeartFilled ? FilledHeart : Heart}
                alt="Heart"
                className="w-6 h-6 cursor-pointer"
                onClick={handleHeartClick}
              />
            </div>
            <div className="mb-2">
              <p className="text-sm font-['Work Sans'] mb-2">{truncateText(authorName, maxAuthorNameLength)} - {published_year}</p>
              <div className="bg-[#445a9a] rounded-lg relative h-72 flex justify-center items-center">
                <img src={cover} alt={title} className="w-full h-full object-cover rounded-lg" />
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm font-['Work Sans'] p-1 rounded">{genre}</span>
            <div className="flex items-center">
              <StarSVG fillPercentage={fillPercentage} />
              <span className="ml-1 text-sm">{average_rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
        <div className="absolute w-full h-full backface-hidden bg-[#172242] rounded-lg p-4 text-white transform rotate-y-180">
          <h2 className="text-lg font-medium font-['Work Sans'] mb-2">{truncateText(title, maxTitleLength)}</h2>
          <p className="text-sm font-['Work Sans']">{truncateText(description, maxDescriptionLength)}</p>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
