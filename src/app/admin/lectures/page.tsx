'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from '@/utils/api';

interface ILecture {
  _id: string;
  title: string;
  videoUrl: string;
  course: string;
  module: string;
}

interface ICourse {
  _id: string;
  title: string;
}

interface IModule {
  _id: string;
  title: string;
}

// -------------------- Component --------------------
const AdminLectureList = () => {
  const [lectures, setLectures] = useState<ILecture[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [modules, setModules] = useState<IModule[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch available courses and modules
  const fetchCoursesAndModules = async () => {
    try {
      const { data: courseData } = await axios.get('/course');
      setCourses(courseData.data || []);

      const { data: moduleData } = await axios.get('/modules');
      setModules(moduleData.data || []);
    } catch (err) {
      console.error('Error fetching courses/modules:', err);
    }
  };

  // Fetch lectures based on selected filters
  const fetchLectures = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (selectedCourse) params.course = selectedCourse;
      if (selectedModule) params.module = selectedModule;

      const { data } = await axios.get('/lectures', { params });
      setLectures(data.data || []);
    } catch (err) {
      console.error('Error fetching lectures:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCourse, selectedModule]);

  // Initial fetch of courses/modules
  useEffect(() => {
    fetchCoursesAndModules();
  }, []);

  // Fetch lectures when filter changes
  useEffect(() => {
    fetchLectures();
  }, [fetchLectures]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Lecture List</h1>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          {/* Course Filter */}
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="border px-4 py-2 rounded w-full"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>

          {/* Module Filter */}
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="border px-4 py-2 rounded w-full"
          >
            <option value="">All Modules</option>
            {modules.map((module) => (
              <option key={module._id} value={module._id}>
                {module.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-4">Loading lectures...</div>
      ) : (
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="border-b px-4 py-2">Lecture Title</th>
              <th className="border-b px-4 py-2">Course</th>
              <th className="border-b px-4 py-2">Module</th>
              <th className="border-b px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lectures.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No lectures found.
                </td>
              </tr>
            ) : (
              lectures.map((lecture) => (
                <tr key={lecture._id}>
                  <td className="border-b px-4 py-2">{lecture.title}</td>
                  <td className="border-b px-4 py-2">{lecture.course}</td>
                  <td className="border-b px-4 py-2">{lecture.module}</td>
                  <td className="border-b px-4 py-2">
                    <button className="text-blue-500 hover:underline">Edit</button>
                    <button className="text-red-500 hover:underline ml-4">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminLectureList;
