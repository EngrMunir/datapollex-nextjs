'use client';

import { useEffect } from 'react';
import Modal from './Modal';
import axiosInstance from '@/utils/api';
import { isAxiosError } from 'axios';
import { ICourse, ICourseFormProps } from '@/types';
import { useForm } from 'react-hook-form';


const CourseFormModal = ({ isOpen, onClose, onSuccess, initialData }: ICourseFormProps) => {
  const isEditMode = Boolean(initialData?._id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ICourse>({
    defaultValues: {
      title: '',
      thumbnail: '',
      price: 0,
      description: '',
    },
  });

  // Prefill form on edit
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title ?? '',
        thumbnail: initialData.thumbnail ?? '',
        price: Number(initialData.price ?? 0),
        description: initialData.description ?? '',
      });
    } else {
      reset({
        title: '',
        thumbnail: '',
        price: 0,
        description: '',
      });
    }
  }, [initialData, reset, isOpen]);

  const onSubmit = async (values: ICourse) => {
    try {
      const payload: ICourse = {
        title: values.title,
        thumbnail: values.thumbnail,
        price: Number(values.price),
        description: values.description,
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
        alert(error.response?.data?.message || 'Something went wrong');
      } else {
        alert('Something went wrong');
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Edit Course' : 'Add New Course'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Course Title"
            className="w-full p-2 border rounded"
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
        </div>

        <div>
          <input
            type="text"
            placeholder="Thumbnail URL"
            className="w-full p-2 border rounded"
            {...register('thumbnail', { required: 'Thumbnail is required' })}
          />
          {errors.thumbnail && <p className="text-red-600 text-sm">{errors.thumbnail.message}</p>}
        </div>

        <div>
          <input
            type="number"
            placeholder="Price"
            className="w-full p-2 border rounded"
            {...register('price', {
              required: 'Price is required',
              valueAsNumber: true,
              min: { value: 0, message: 'Price cannot be negative' },
            })}
          />
          {errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}
        </div>

        <div>
          <textarea
            placeholder="Description"
            rows={4}
            className="w-full p-2 border rounded resize-none"
            {...register('description', { required: 'Description is required' })}
          />
          {errors.description && (
            <p className="text-red-600 text-sm">{errors.description.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {isSubmitting ? 'Submitting...' : isEditMode ? 'Update Course' : 'Create Course'}
        </button>
      </form>
    </Modal>
  );
};

export default CourseFormModal;
