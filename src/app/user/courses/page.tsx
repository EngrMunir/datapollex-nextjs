'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/api';
import Link from 'next/link';
import Image from 'next/image';
import { ICourse } from '@/types';

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
        {courses.map((course) => (
          <Link key={course._id} href={`/user/courses/${course._id}`}>
            <div className="block border rounded p-4 shadow hover:shadow-lg transition bg-white">
              <div className="relative w-full h-48">
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="rounded object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              <h2 className="text-xl font-semibold mt-2">{course.title}</h2>
              <p className="text-gray-600 text-sm">{course.description.slice(0, 100)}...</p>
              <p className="text-blue-600 font-bold mt-2">${course.price.toFixed(2)}</p>

              {/* Static Instructor Info */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Instructor Info</h3>
                <p className="text-gray-700">Instructor: John Doe</p>
                <p className="text-sm text-gray-600">
                  Bio: Experienced educator with a passion for teaching web development. Helps students build solid foundations.
                </p>
              </div>

              {/* Static Reviews */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Reviews</h3>
                <div className="text-gray-600">
                  <p>&quot;This course was amazing! I learned so much about Next.js and it&apos;s practical!&quot;</p>
                  <p>- Jane Smith</p>
                </div>
                <div className="text-gray-600 mt-2">
                  <p>&quot;Great course with clear explanations. Highly recommend it for anyone looking to start with Next.js.&quot;</p>
                  <p>- Bob Lee</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllCoursesPage;
