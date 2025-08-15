'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from '@/utils/api';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import type { ReactPlayerProps } from 'react-player';
import { ICourseDetail, ILecture, IModule } from '@/types';

const ReactPlayer = dynamic(
  () =>
    import('react-player/lazy') as unknown as Promise<{
      default: React.FC<ReactPlayerProps>;
    }>,
  { ssr: false }
);

const CoursePlayerPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<ICourseDetail | null>(null);
  const [currentLecture, setCurrentLecture] = useState<ILecture | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [unlockedLectures, setUnlockedLectures] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/course/${courseId}`);
        setCourse(data.data);

        const firstLecture = data.data.modules?.[0]?.lectures?.[0];
        if (firstLecture) setCurrentLecture(firstLecture);

        const firstLectures = data.data.modules
          .map((module: IModule) => module.lectures[0]?._id)
          .filter(Boolean) as string[];
        setUnlockedLectures(firstLectures);
      } catch (error) {
        console.error('Error fetching course data:', error);
        toast.error('Failed to load course data');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchData();
  }, [courseId]);

  const toggleModule = (id: string) => {
    setExpandedModules(prev =>
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  const handleLectureClick = (lecture: ILecture) => {
    setCurrentLecture(lecture);
    if (!unlockedLectures.includes(lecture._id)) {
      setUnlockedLectures(prev => [...prev, lecture._id]);
    }
  };

  const handleNextLecture = () => {
    if (currentLecture && course) {
      const currentModule = course.modules.find(module =>
        module.lectures.some(lec => lec._id === currentLecture._id)
      );
      if (!currentModule) return;

      const currentLectureIndex = currentModule.lectures.findIndex(
        lec => lec._id === currentLecture._id
      );
      if (currentLectureIndex < currentModule.lectures.length - 1) {
        const nextLecture = currentModule.lectures[currentLectureIndex + 1];
        setCurrentLecture(nextLecture);
        if (!unlockedLectures.includes(nextLecture._id))
          setUnlockedLectures(prev => [...prev, nextLecture._id]);
      }
    }
  };

  const handlePreviousLecture = () => {
    if (currentLecture && course) {
      const currentModule = course.modules.find(module =>
        module.lectures.some(lec => lec._id === currentLecture._id)
      );
      if (!currentModule) return;

      const currentLectureIndex = currentModule.lectures.findIndex(
        lec => lec._id === currentLecture._id
      );
      if (currentLectureIndex > 0) {
        const previousLecture = currentModule.lectures[currentLectureIndex - 1];
        setCurrentLecture(previousLecture);
      }
    }
  };

  const handleDownloadPDF = () => {
    console.log('current lecture',currentLecture)
    if (!currentLecture?.pdfNotes || currentLecture.pdfNotes.length === 0) {
      toast.error('No PDF available for this lecture');
      return;
    }

    const pdfUrl = currentLecture.pdfNotes[0]; // first PDF
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.target = '_blank';
    link.download = `${currentLecture.title}.pdf`;
    link.click();
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!course) return <div>Course not found</div>;

  // ===== Module Progress Calculation =====
  const runningModule = currentLecture
    ? course.modules.find(module =>
        module.lectures.some(lec => lec._id === currentLecture._id)
      )
    : null;

  const currentLectureIndex = runningModule
    ? runningModule.lectures.findIndex(lec => lec._id === currentLecture!._id) + 1
    : 0;

  const totalLectures = runningModule ? runningModule.lectures.length : 0;
  const progressPercent = totalLectures
    ? (currentLectureIndex / totalLectures) * 100
    : 0;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left: Video Player */}
      <div className="md:w-2/3 bg-[#010313] p-4 overflow-y-auto">
        {currentLecture ? (
          <>
            {/* Module number - Lecture number + title */}
            {runningModule && (
              <div className="text-white font-semibold mb-2 text-lg">
                Module {runningModule.moduleNumber} - {currentLectureIndex} |{' '}
                {currentLecture.title}
              </div>
            )}

            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
              <ReactPlayer
                url={currentLecture.videoUrl}
                controls
                width="100%"
                height="100%"
                style={{ position: 'absolute', top: 0, left: 0 }}
                config={{
                  youtube: {
                    playerVars: {
                      modestbranding: 1,
                      rel: 0,
                      showinfo: 0,
                      autoplay: 1,
                    },
                  },
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handleDownloadPDF}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
              >
                Download PDF
              </button>
              <div className="flex gap-4">
                <button
                  onClick={handlePreviousLecture}
                  className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextLecture}
                  className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-white">No lecture selected</p>
        )}
      </div>

      {/* Right: Module List + Progress */}
      <div className="md:w-1/3 bg-gray-100 p-4 overflow-y-auto max-h-screen pb-4">
        {/* Progress Bar */}
        {runningModule && (
          <div className="mb-4">
            <div className="flex justify-between mb-1 text-gray-800 font-medium">
              <span>Running Module: {runningModule.moduleNumber}</span>
              <span>
                {currentLectureIndex}/{totalLectures}
              </span>
            </div>
            <div className="w-full h-3 bg-gray-300 rounded">
              <div
                className="h-3 bg-[#0dd053] rounded"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}

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
                  module.lectures.map(lecture => (
                    <button
                      key={lecture._id}
                      className={`flex justify-between items-center w-full px-3 py-2 my-1 rounded text-left ${
                        unlockedLectures.includes(lecture._id)
                          ? 'bg-green-100 hover:bg-green-200'
                          : 'bg-gray-300 cursor-not-allowed'
                      }`}
                      onClick={() => handleLectureClick(lecture)}
                      disabled={!unlockedLectures.includes(lecture._id)}
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
