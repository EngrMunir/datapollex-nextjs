'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/api';
import Image from 'next/image';
import CourseFormModal from '@/components/CourseFormModal';
import { FaEdit, FaTrash, FaPlus, FaCogs } from 'react-icons/fa';
import Link from 'next/link';

interface ICourse {
  _id: string;
  title: string;
  thumbnail: string;
  price: number;
  description: string;
}

const AdminCourseListPage = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/course');
      setCourses(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEdit = (course: ICourse) => {
    setSelectedCourse(course);
    setOpenModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await axios.delete(`/course/${id}`);
      fetchCourses();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">All Courses</h1>
        <button
          onClick={() => {
            setSelectedCourse(null);
            setOpenModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <FaPlus /> Add Course
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="border rounded-md p-4 shadow hover:shadow-lg transition"
            >
              <Image
                src={course.thumbnail}
                alt={course.title}
                width={400}
                height={200}
                className="h-40 w-full object-cover rounded mb-3"
              />
              <h2 className="font-semibold text-lg">{course.title}</h2>
              <p className="text-sm text-gray-500 line-clamp-3">{course.description}</p>
              <p className="text-blue-600 font-bold mt-2">${course.price}</p>

              <div className="flex justify-between items-center mt-4">
                <Link
                  href={`/admin/courses/${course._id}/modules`}
                  className="text-sm text-blue-600 underline flex items-center gap-1"
                >
                  <FaCogs /> Manage Modules
                </Link>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(course)}
                    className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {openModal && (
        <CourseFormModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          initialData={selectedCourse ?? undefined}
          onSuccess={() => {
            fetchCourses();
            setOpenModal(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminCourseListPage;
