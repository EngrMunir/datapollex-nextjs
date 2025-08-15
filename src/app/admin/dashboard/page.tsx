'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/api';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface IUser {
  _id: string;
  name: string;
  role: string;
  enrolledCourses?: string[];
}

interface ICourse {
  _id: string;
  title: string;
}

interface IEnrollment {
  userId: string;
  courseIds: string[]; // <-- fixed
}

const AdminDashboardPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<IEnrollment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: usersResponse } = await axios.get('/user');
        const usersData: IUser[] = usersResponse.data || [];

        const { data: coursesResponse } = await axios.get('/course');
        const coursesData: ICourse[] = coursesResponse.data || [];

        const { data: enrollmentsResponse } = await axios.get('/enrollments/enrolledCourse');
        const enrollmentsData: IEnrollment[] = enrollmentsResponse.data || [];

        setUsers(usersData);
        setCourses(coursesData);
        setEnrolledCourses(enrollmentsData)
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchData();
  }, []);

  const normalUsers = users.filter(u => u.role !== 'admin');

  const totalUsers = normalUsers.length;
  const totalCourses = courses.length;
  const totalEnrolledCourses = enrolledCourses.length;

  const data = {
    labels: ['Total Users', 'Total Courses', 'Total Enrolled Courses'],
    datasets: [
      {
        label: 'Dashboard Overview',
        data: [totalUsers, totalCourses, totalEnrolledCourses],
        backgroundColor: ['#0dd053', '#3b82f6', '#facc15'],
        borderColor: ['#fff', '#fff', '#fff'],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="p-6">
      <div className="max-w-md mx-auto bg-white shadow rounded p-6">
        <Pie data={data} />
      </div>

      <div className="mt-6 text-center text-gray-700">
        <p>Total Users: {totalUsers}</p>
        <p>Total Courses: {totalCourses}</p>
        <p>Total Enrolled Courses: {totalEnrolledCourses}</p>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
