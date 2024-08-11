import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Heart from '../assets/Heart.svg';
import FilledHeart from '../assets/HeartFilled.svg';
import Rating5 from '../assets/FullFilledStar.svg';
import Rating4 from '../assets/AlmostFullStar.svg';
import Rating3 from '../assets/AlmostFullStar.svg';
import Rating2 from '../assets/QuarterFilledStar.svg';
import Rating0 from '../assets/Star.svg';

interface BookCardProps {
  title: string;
  book_id: number;
  author_id: number;
  published_year: number;
  genre: string;
  cover: string;
  average_rating: number;
  description: string;
  isLiked: boolean;
  onLikeToggle: (bookId: number) => void; 
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};

const BookCard: React.FC<BookCardProps> = ({ title, book_id, author_id, published_year, genre, cover, average_rating, description, isLiked, onLikeToggle }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [authorName, setAuthorName] = useState<string>('');
  const [isHeartFilled, setIsHeartFilled] = useState(isLiked); 
  const maxDescriptionLength = 550;
  const maxTitleLength = 22;
  const maxAuthorNameLength = 20;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAuthorName = async () => {
      try {
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
  }, [author_id, token]);

  const handleHeartClick = async (event: React.MouseEvent) => {
    event.stopPropagation(); // prevents the card flip
    try {
      await onLikeToggle(book_id);
      setIsHeartFilled(!isHeartFilled);
    } catch (error) {
      window.alert("You need to login to like a book");
    }
  };

  const getRatingImage = (rating: number) => {
    if (rating >= 5) return Rating5;
    if (rating >= 3.9) return Rating4;
    if (rating >= 3.2) return Rating3;
    if (rating >= 2.8) return Rating2;
    if (rating >= 2) return Rating2;
    return Rating0;
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
              <img src={getRatingImage(average_rating)} alt="Rating" className="w-6 h-6" />
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
