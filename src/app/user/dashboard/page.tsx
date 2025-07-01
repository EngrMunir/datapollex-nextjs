'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/api';
import Link from 'next/link';
import Image from 'next/image';

interface ICourse {
  _id: string;
  title: string;
  thumbnail: string;
  price: number;
  description: string;
}

const UserDashboard = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('/courses');
        setCourses(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h1>

      {loading ? (
        <p>Loading courses...</p>
      ) : courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course._id}
              href={`/user/courses/${course._id}`}
              className="border rounded-md p-4 shadow hover:shadow-lg transition block"
            >
              <Image
                src={course.thumbnail}
                alt={course.title}
                className="h-40 w-full object-cover rounded mb-3"
                width={400}
                height={200}
              />
              <h2 className="font-semibold text-lg">{course.title}</h2>
              <p className="text-sm text-gray-500">{course.description}</p>
              <p className="text-blue-600 font-bold mt-2">${course.price}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
