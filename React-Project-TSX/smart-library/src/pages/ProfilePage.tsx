import React, { useContext, useState } from 'react';
import AuthContext from '../handlers/AuthContext';
import Header from '../components/Header';
import axios from 'axios';

const genresList = ["Fiction", "Detective and Mystery Stories", "Science Fiction", "Fantasy", "Romance", "s", "s", "s", "s"];

const ProfilePage: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleGenreClick = (genre: string) => {
    setSelectedGenres((prevSelectedGenres) =>
      prevSelectedGenres.includes(genre)
        ? prevSelectedGenres.filter((g) => g !== genre)
        : [...prevSelectedGenres, genre]
    );
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    try { 
      await axios.post('http://localhost:8001/users/preferences/genres', selectedGenres, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Preferences updated successfully!');
    } catch (error) {
      console.error('Failed to update preferences', error);
      alert('Failed to update preferences');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header/>
      <main className="flex-1 p-4 flex flex-col items-center">
        <div className="bg-[#172242] p-6 rounded-lg shadow-lg w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Work Sans, sans-serif' }}>User Information</h2>
          <p className="mb-2"><strong>Username:</strong> {user.username}</p>
          <p><strong>Role:</strong> {user.role}</p>
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Select your favorite genres:</h3>
            <div className="w-full p-2 rounded-lg bg-[#445a9a] text-white max-h-72 overflow-y-auto">
              {genresList.map((genre) => (
                <div
                  key={genre}
                  onClick={() => handleGenreClick(genre)}
                  className={`p-2 mb-1 rounded cursor-pointer ${selectedGenres.includes(genre) ? 'bg-blue-700' : ''}`}
                  style={{ fontFamily: 'Work Sans, sans-serif' }}
                >
                  {genre}
                </div>
              ))}
            </div>
          </div>
          
          <button onClick={handleSubmit} className="mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded bg-[#445a9a]">
            Save Preferences
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
