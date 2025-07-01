'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from '@/utils/api';
import dynamic from 'next/dynamic';
import { FaLock, FaUnlock } from 'react-icons/fa';
import toast from 'react-hot-toast';

// Lazy-load ReactPlayer to avoid SSR issues, and fix types manually
import type { ReactPlayerProps } from 'react-player';

const ReactPlayer = dynamic(() => import('react-player/lazy') as unknown as Promise<{ default: React.FC<ReactPlayerProps> }>, {
  ssr: false,
});

interface ILecture {
  _id: string;
  title: string;
  videoUrl: string;
}

interface IModule {
  _id: string;
  title: string;
  moduleNumber: number;
  lectures: ILecture[];
}

interface ICourseDetail {
  _id: string;
  title: string;
  thumbnail: string;
  modules: IModule[];
}

const CoursePlayerPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<ICourseDetail | null>(null);
  const [currentLecture, setCurrentLecture] = useState<ILecture | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/course/detail/${courseId}`);
        setCourse(data.data);

        const allLectureIds = data.data.modules.flatMap((mod: IModule) =>
          mod.lectures.map((lec: ILecture) => lec._id)
        );

        const res = await axios.post('/progress/list', {
          lectureIds: allLectureIds,
        });
        setCompleted(res.data.data || []);

        const firstLecture = data.data.modules?.[0]?.lectures?.[0];
        if (firstLecture) setCurrentLecture(firstLecture);
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    if (courseId) fetchData();
  }, [courseId]);

  const isUnlocked = (lectureId: string) => {
    if (!course) return false;

    const allLectures = course.modules.flatMap(mod => mod.lectures);
    const index = allLectures.findIndex(l => l._id === lectureId);

    if (completed.length === 0) {
      return index === 0; // Unlock only first lecture
    }

    const completedCount = allLectures.findIndex(
      l => l._id === completed[completed.length - 1]
    );

    return index <= completedCount + 1;
  };

  const handleComplete = async (lectureId: string) => {
    try {
      await axios.post('/progress/complete', { lectureId });
      setCompleted(prev => [...prev, lectureId]);
      toast.success('Marked as completed');
    } catch (err) {
      console.error('Error marking as completed:', err);
      toast.error('Failed to mark as completed');
    }
  };

  const toggleModule = (id: string) => {
    setExpandedModules(prev =>
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 min-h-screen">
      {/* Left: Video Player */}
      <div className="md:col-span-2 bg-black p-4">
        {currentLecture ? (
          <>
            <h2 className="text-white mb-2 text-lg">{currentLecture.title}</h2>
            <div className="aspect-w-16 aspect-h-9">
              <ReactPlayer
                src={currentLecture.videoUrl}
                controls
                width="100%"
                height="100%"
              />
            </div>
            <button
              onClick={() => handleComplete(currentLecture._id)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Mark as Completed
            </button>
          </>
        ) : (
          <p className="text-white">No lecture selected</p>
        )}
      </div>

      {/* Right: Modules */}
      <div className="bg-gray-100 p-4 overflow-y-auto">
        <h3 className="font-bold text-xl mb-4">Modules</h3>
        {course?.modules.map(module => (
          <div key={module._id} className="mb-4 border rounded bg-white">
            <div
              onClick={() => toggleModule(module._id)}
              className="cursor-pointer px-4 py-2 bg-gray-200 font-medium"
            >
              Module {module.moduleNumber}: {module.title}
            </div>
            {expandedModules.includes(module._id) && (
              <div className="p-2">
                {module.lectures.map(lecture => {
                  const unlocked = isUnlocked(lecture._id);
                  return (
                    <button
                      key={lecture._id}
                      className={`flex justify-between items-center w-full px-3 py-2 my-1 rounded text-left ${
                        unlocked
                          ? 'bg-green-100 hover:bg-green-200'
                          : 'bg-gray-200 cursor-not-allowed opacity-60'
                      }`}
                      onClick={() => unlocked && setCurrentLecture(lecture)}
                      disabled={!unlocked}
                    >
                      <span>{lecture.title}</span>
                      <span>{unlocked ? <FaUnlock /> : <FaLock />}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursePlayerPage;
