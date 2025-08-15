'use client';

import axios from '@/utils/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { TRegisterValues } from '@/types';


const RegisterForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TRegisterValues>({
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (values: TRegisterValues) => {
    try {
      await axios.post('/auth/register', values);
      toast.success('Registration successful!');
      router.push('/login');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Registration failed';
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div>
        <input
          type="text"
          placeholder="Full Name"
          className="w-full border px-4 py-2 rounded"
          {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'At least 2 characters' } })}
        />
        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <input
          type="email"
          placeholder="Email"
          className="w-full border px-4 py-2 rounded"
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
          })}
        />
        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <input
          type="password"
          placeholder="Password"
          className="w-full border px-4 py-2 rounded"
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'At least 6 characters' },
          })}
        />
        {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

export default RegisterForm;
