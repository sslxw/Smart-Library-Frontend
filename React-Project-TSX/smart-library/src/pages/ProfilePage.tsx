import React, { useContext } from 'react';
import AuthContext from '../handlers/AuthContext';
import Header from '../components/Header';

const ProfilePage: React.FC = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header/>
      <main className="flex-1 p-4 flex flex-col items-center">
        <div className="bg-[#445a9a] p-6 rounded-lg shadow-lg w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Work Sans, sans-serif' }}>User Information</h2>
          <p className="mb-2"><strong>Username:</strong> {user.username}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
