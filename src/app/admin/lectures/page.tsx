'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from '@/utils/api';

type RefOrPopulated = string | { _id: string; title: string };

interface ILecture {
  _id: string;
  title: string;
  videoUrl: string;
  // Backend returns ids or populated objects
  courseId: RefOrPopulated;
  moduleId: RefOrPopulated;
}

interface ICourse { _id: string; title: string; }
interface IModule { _id: string; title: string; }

const AdminLectureList = () => {
  const [lectures, setLectures] = useState<ILecture[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [modules, setModules] = useState<IModule[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const getTitle = (val: RefOrPopulated) =>
    typeof val === 'object' && val?.title ? val.title : String(val ?? '');

  // Initial: fetch all courses and (optionally) all modules
  useEffect(() => {
    (async () => {
      try {
        const [{ data: c }, { data: m }] = await Promise.all([
          axios.get('/course'),
          axios.get('/modules'),
        ]);
        setCourses(c?.data ?? []);
        setModules(m?.data ?? []);
      } catch (err) {
        console.error('Error fetching courses/modules:', err);
      }
    })();
  }, []);

  // When course changes: reset module & fetch modules for that course from server
  useEffect(() => {
    (async () => {
      setSelectedModule('');
      try {
        if (!selectedCourse) {
          const { data } = await axios.get('/modules');
          setModules(data?.data ?? []);
          return;
        }
        const { data } = await axios.get('/modules', { params: { courseId: selectedCourse } });
        setModules(data?.data ?? []);
      } catch (err) {
        console.error('Error fetching modules by course:', err);
      }
    })();
  }, [selectedCourse]);

  // Fetch lectures from server with filters (NO client-side filtering)
  const fetchLectures = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (selectedCourse) params.courseId = selectedCourse;
      if (selectedModule) params.moduleId = selectedModule;

      const { data } = await axios.get('/lectures', { params });
      setLectures(data?.data ?? []);
    } catch (err) {
      console.error('Error fetching lectures:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCourse, selectedModule]);

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

          {/* Module Filter (data comes from server for the selected course) */}
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="border px-4 py-2 rounded w-full"
            disabled={!selectedCourse || modules.length === 0}
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
              <th className="border-b px-4 py-2 text-left">Lecture Title</th>
              <th className="border-b px-4 py-2 text-left">Course</th>
              <th className="border-b px-4 py-2 text-left">Module</th>
              <th className="border-b px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lectures.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4">No lectures found.</td>
              </tr>
            ) : (
              lectures.map((lecture) => (
                <tr key={lecture._id}>
                  <td className="border-b px-4 py-2">{lecture.title}</td>
                  <td className="border-b px-4 py-2">{getTitle(lecture.courseId)}</td>
                  <td className="border-b px-4 py-2">{getTitle(lecture.moduleId)}</td>
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
