'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/api';
import Link from 'next/link';
import Image from 'next/image';

interface ICourse {
  _id: string;
  title: string;
  thumbnail: string;
  description: string;
  price: number;
}

const AllCoursesPage = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('/course');
        setCourses(res.data.data || []);
      } catch (err) {
        console.error('Failed to load courses', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <Link key={course._id} href={`/user/courses/${course._id}`}>
            <div className="border rounded p-4 shadow hover:shadow-lg transition bg-white">
              <Image
                src={course.thumbnail}
                alt={course.title}
                width={400}
                height={200}
                className="rounded w-full h-48 object-cover"
              />
              <h2 className="text-xl font-semibold mt-2">{course.title}</h2>
              <p className="text-gray-600 text-sm">{course.description.slice(0, 100)}...</p>
              <p className="text-blue-600 font-bold mt-2">${course.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllCoursesPage;
