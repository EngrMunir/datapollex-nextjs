'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/api';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

type DecodedToken = {
  email: string;
  role: 'admin' | 'user';
  iat?: number;
  exp?: number;
};

const LoginForm = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosInstance.post('/auth/login', form);
      const accessToken = res.data.data.accessToken;

      localStorage.setItem('accessToken', accessToken);

      const decoded = jwtDecode<DecodedToken>(accessToken);
      const role = decoded?.role;

      toast.success('Login successful!');

      if (role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/user/courses');
      }
    } catch (err) {
      if (isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Invalid credentials');
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setForm({ email: 'admin@gmail.com', password: 'Admin123' });
  };

  const fillUserCredentials = () => {
    setForm({ email: 'user@gmail.com', password: 'Admin123' });
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        className="w-full border px-4 py-2 rounded"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
        className="w-full border px-4 py-2 rounded"
      />

      <div className="flex justify-between gap-4">
        <button
          type="button"
          onClick={fillAdminCredentials}
          className="w-full bg-gray-200 text-sm px-3 py-2 rounded hover:bg-gray-300"
        >
          Use Admin Credentials
        </button>
        <button
          type="button"
          onClick={fillUserCredentials}
          className="w-full bg-gray-200 text-sm px-3 py-2 rounded hover:bg-gray-300"
        >
          Use User Credentials
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
