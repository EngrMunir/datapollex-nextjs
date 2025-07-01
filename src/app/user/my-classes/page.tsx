'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ILecture {
  _id: string;
}

interface IModule {
  _id: string;
  lectures: ILecture[];
}

interface ICourse {
  _id: string;
  title: string;
  thumbnail: string;
  modules: IModule[];
}

const MyClassesPage = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const res = await axios.get('/enrollments');
        setCourses(res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch enrolled courses', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Classes</h1>
      {courses.map((course) => {
        const hasLecture = course.modules?.some((mod) => mod.lectures?.length > 0);


        return (
          <div key={course._id} className="mb-6 border rounded-lg p-4 shadow bg-white">
            <div className="flex items-center gap-4">
              <Image
                src={course.thumbnail}
                alt={course.title}
                width={120}
                height={80}
                className="object-cover rounded"
              />
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{course.title}</h2>
              </div>
              <button
                onClick={() => router.push(`/user/learn/${course._id}`)}
                className={`px-4 py-2 rounded text-sm text-white ${
                  hasLecture
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={!hasLecture}
              >
                Continue
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyClassesPage;
