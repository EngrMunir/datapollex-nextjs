'use client';

import { useEffect, useState } from 'react';
import Modal from './Modal';
import axiosInstance from '@/utils/api';
import { isAxiosError } from 'axios';

interface ICourse {
  _id?: string;
  title: string;
  thumbnail: string;
  price: number;
  description: string;
}

interface ICourseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: ICourse;
}

const CourseFormModal = ({ isOpen, onClose, onSuccess, initialData }: ICourseFormProps) => {
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditMode = Boolean(initialData?._id);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setThumbnail(initialData.thumbnail || '');
      setPrice(initialData.price ?? '');
      setDescription(initialData.description || '');
    } else {
      setTitle('');
      setThumbnail('');
      setPrice('');
      setDescription('');
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (!title || !thumbnail || !description || price === '') {
      alert('All fields are required');
      return;
    }

    setLoading(true);

    try {
      const payload: ICourse = {
        title,
        thumbnail,
        price: Number(price),
        description,
      };

      if (isEditMode && initialData?._id) {
        await axiosInstance.patch(`/course/${initialData._id}`, payload);
      } else {
        await axiosInstance.post('/course', payload);
      }

      onSuccess();
      onClose();
    } catch (error) {
      if (isAxiosError(error)) {
        console.error('Failed to submit course:', error);
        alert(error.response?.data?.message || 'Something went wrong');
      } else {
        alert('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Edit Course' : 'Add New Course'}>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Thumbnail URL"
          value={thumbnail}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setThumbnail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPrice(e.target.value === '' ? '' : Number(e.target.value))
          }
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
          className="w-full p-2 border rounded resize-none"
          rows={4}
          required
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Submitting...' : isEditMode ? 'Update Course' : 'Create Course'}
        </button>
      </div>
    </Modal>
  );
};

export default CourseFormModal;
