'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from '@/utils/api';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';

// Lazy-load ReactPlayer to avoid SSR issues
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
  const [expandedModules, setExpandedModules] = useState<string[]>([]); // Modules that are expanded
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch course details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/course/${courseId}`);
        console.log('single course data', data.data);
        setCourse(data.data);

        // Set the first lecture as the current lecture if available
        const firstLecture = data.data.modules?.[0]?.lectures?.[0];
        if (firstLecture) setCurrentLecture(firstLecture);
      } catch (error) {
        console.error('Error fetching course data:', error);
        toast.error('Failed to load course data');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchData();
  }, [courseId]);

  // Toggle module expansion
  const toggleModule = (id: string) => {
    setExpandedModules(prev =>
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  // Handle lecture click to update the current lecture and video
  const handleLectureClick = (lecture: ILecture) => {
    setCurrentLecture(lecture);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  if (!course) return <div>Course not found</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 min-h-screen">
      {/* Left: Video Player */}
      <div className="md:col-span-2 bg-black p-4">
        {currentLecture ? (
          <>
            <h2 className="text-white mb-2 text-lg">{currentLecture.title}</h2>
            <div className="relative pb-[56.25%]"> {/* 16:9 Aspect Ratio */}
              <ReactPlayer
                url={currentLecture.videoUrl}
                controls
                width="100%"  // Ensure the player takes 100% width of the container
                height="100%" // Set height to 100% to maintain aspect ratio
                style={{ position: 'absolute', top: 0, left: 0 }}
                config={{
                  youtube: {
                    playerVars: {
                      modestbranding: 1,
                      rel: 0,
                      showinfo: 0,
                      autoplay: 1,
                      origin: 'http://localhost:3000',
                    },
                  },
                }}
              />
            </div>
          </>
        ) : (
          <p className="text-white">No lecture selected</p>
        )}
      </div>

      {/* Right: Modules */}
      <div className="bg-gray-100 p-4 overflow-y-auto">
        <h3 className="font-bold text-xl mb-4">Modules</h3>
        {course.modules.map(module => (
          <div key={module._id} className="mb-4 border rounded bg-white">
            <div
              onClick={() => toggleModule(module._id)}
              className="cursor-pointer px-4 py-2 bg-gray-200 font-medium"
            >
              Module {module.moduleNumber}: {module.title}
            </div>
            {expandedModules.includes(module._id) && (
              <div className="p-2">
                {module.lectures.length > 0 ? (
                  module.lectures.map((lecture) => (
                    <button
                      key={lecture._id}
                      className="flex justify-between items-center w-full px-3 py-2 my-1 rounded text-left bg-green-100 hover:bg-green-200"
                      onClick={() => handleLectureClick(lecture)}  // Update the current lecture
                    >
                      <span>{lecture.title}</span>
                    </button>
                  ))
                ) : (
                  <p>No lectures available</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursePlayerPage;
