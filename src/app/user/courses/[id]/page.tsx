'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/api';
import { isAxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

interface ICourse {
  _id: string;
  title: string;
  thumbnail: string;
  description: string;
  price: number;
}

const CourseDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<ICourse | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes] = await Promise.all([
          axiosInstance.get(`/course/${courseId}`),
        ]);
        setCourse(courseRes.data.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchData();
  }, [courseId]);

  const handleEnroll = async () => {
    try {
      const res = await axiosInstance.post('/enrollments', { courseId });
      console.log('response', res);
      setIsEnrolled(true);
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response?.status === 409) {
          alert(err.response.data.message || 'Already enrolled');
          setIsEnrolled(true);
        } else {
          console.error('Enrollment failed:', err);
          alert('Enrollment failed. Please try again.');
        }
      } else {
        alert('Something went wrong. Please try again.');
      }
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!course) return <div className="p-6">Course not found</div>;

  return (
    <div className="p-6">
      <Image
        src={course.thumbnail}
        alt={course.title}
        width={800}
        height={300}
        className="w-full h-64 object-cover rounded"
      />
      <h1 className="text-3xl font-bold mt-4">{course.title}</h1>
      <p className="text-gray-700 mt-2">{course.description}</p>
      <p className="text-blue-600 font-bold mt-4 text-lg">${course.price}</p>

      <div className="mt-6">
        {isEnrolled ? (
          <button
            onClick={() => router.push('/user/my-classes')}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Continue Learning
          </button>
        ) : (
          <button
            onClick={handleEnroll}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Enroll Now
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;
