'use client';

import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/api';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { TDecodedToken, TLoginValues } from '@/types';
import { useForm } from 'react-hook-form';


const LoginForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TLoginValues>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: TLoginValues) => {
    try {
      const res = await axiosInstance.post('/auth/login', values);
      const accessToken = res?.data?.data?.accessToken;

      localStorage.setItem('accessToken', accessToken);

      const decoded = jwtDecode<TDecodedToken>(accessToken);
      const role = decoded?.role;

      toast.success('Login successful!');
      if (role === 'admin') router.push('/admin/dashboard');
      else router.push('/user/courses');
    } catch (err) {
      if (isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Invalid credentials');
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  const fillAdminCredentials = () => {
    setValue('email', 'admin@gmail.com', { shouldDirty: true });
    setValue('password', 'Admin123', { shouldDirty: true });
  };

  const fillUserCredentials = () => {
    setValue('email', 'munir@gmail.com', { shouldDirty: true });
    setValue('password', 'Admin123', { shouldDirty: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          type="email"
          placeholder="Email"
          className="w-full border px-4 py-2 rounded"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email',
            },
          })}
        />
        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
      </div>

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
        disabled={isSubmitting}
        className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
