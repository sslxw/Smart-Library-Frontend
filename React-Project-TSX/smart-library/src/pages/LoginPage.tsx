import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Header from '../components/Header';
import AuthContext from '../handlers/AuthContext';

const LoginSignupPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(username, password);
    if (result.success) {
      navigate('/');
    } else {
      alert(result.message);
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center bg-black min-h-screen p-4">
        <div className="relative w-full max-w-lg bg-[#172242] rounded-lg p-6">
          <h2 className="text-center text-white text-xl font-medium font-['Work Sans'] tracking-wide mb-4">Log In</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-[#aeb0b6] text-sm font-medium font-['Work Sans'] leading-tight tracking-wide">Username</label>
              <input
                type="text"
                className="w-full h-12 rounded-lg border border-[#aeb0b6] p-3 mt-2 text-[#61646b] text-base font-normal font-['Work Sans']"
                placeholder="example@pwc.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-[#aeb0b6] text-sm font-medium font-['Work Sans'] leading-tight tracking-wide">Password</label>
              <input
                type="password"
                className="w-full h-12 rounded-lg border border-[#aeb0b6] p-3 mt-2 text-[#61646b] text-base font-normal font-['Work Sans']"
                placeholder="Placeholder/Input text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full h-12 bg-[#41d0c8] rounded-lg text-white text-base font-medium font-['Work Sans'] leading-none tracking-wide"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginSignupPage;
