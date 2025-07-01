'use client';

import { useState } from 'react';
import axios from '@/utils/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const RegisterForm = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/auth/register', form);
      toast.success('Registration successful!');
      router.push('/login');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
  const message = err?.response?.data?.message || 'Registration failed';
  toast.error(message);
}
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <input
        name="name"
        type="text"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full border px-4 py-2 rounded"
      />
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
      <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full">
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
