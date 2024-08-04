import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Book {
  title: string;
  author_id: number;
  published_year: number;
  genre: string;
  cover: string;
  average_rating: number;
  fillPercentage: number;
  description: string;
}

interface HeartedBooksContextType {
  heartedBooks: Book[];
  toggleHeart: (book: Book) => void;
}

const HeartedBooksContext = createContext<HeartedBooksContextType | undefined>(undefined);

export const HeartedBooksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [heartedBooks, setHeartedBooks] = useState<Book[]>([]);

  const toggleHeart = (book: Book) => {
    setHeartedBooks((prevHeartedBooks) => {
      const isHearted = prevHeartedBooks.some((b) => b.title === book.title);
      if (isHearted) {
        return prevHeartedBooks.filter((b) => b.title !== book.title);
      } else {
        return [...prevHeartedBooks, book];
      }
    });
  };

  return (
    <HeartedBooksContext.Provider value={{ heartedBooks, toggleHeart }}>
      {children}
    </HeartedBooksContext.Provider>
  );
};

export const useHeartedBooks = (): HeartedBooksContextType => {
  const context = useContext(HeartedBooksContext);
  if (!context) {
    throw new Error('useHeartedBooks must be used within a HeartedBooksProvider');
  }
  return context;
};
