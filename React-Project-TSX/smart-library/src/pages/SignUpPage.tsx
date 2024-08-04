import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
       await axios.post('http://localhost:8001/users/register', {
        username: email,
        password: password,
      });
      setSuccess('User registered successfully');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.detail);
      } else {
        setError('An error occurred during registration');
      }
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center bg-black min-h-screen p-4">
        <div className="relative w-full max-w-lg bg-[#172242] rounded-lg p-6">
          <h2 className="text-center text-white text-xl font-medium font-['Work Sans'] tracking-wide mb-4">Sign Up</h2>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {success && <div className="text-green-500 mb-4">{success}</div>}
          <form onSubmit={handleSignup}>
            <div className="mb-6">
              <label className="block text-[#aeb0b6] text-sm font-medium font-['Work Sans'] leading-tight tracking-wide">Username</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 rounded-lg border border-[#aeb0b6] p-3 mt-2 text-[#61646b] text-base font-normal font-['Work Sans']"
                placeholder="example@pwc.com"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-[#aeb0b6] text-sm font-medium font-['Work Sans'] leading-tight tracking-wide">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 rounded-lg border border-[#aeb0b6] p-3 mt-2 text-[#61646b] text-base font-normal font-['Work Sans']"
                placeholder="Placeholder/Input text"
                required
              />
            </div>
            <div className="text-[#61646b] text-base font-normal font-['Work Sans'] leading-normal mb-4">
              Ensure password has:<br />
              8 characters or more<br />
              At least one number<br />
              No symbols
            </div>
            <button type="submit" className="w-full h-12 bg-[#41d0c8] rounded-lg text-white text-base font-medium font-['Work Sans'] leading-none tracking-wide">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
