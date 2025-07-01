'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from '@/utils/api';
import toast from 'react-hot-toast';

interface ILecture {
  _id: string;
  title: string;
  videoUrl: string;
  pdfNotes: string[];
}

const LecturePage = () => {
  const params = useParams();
  const lectureId = params?.id as string;

  const [lecture, setLecture] = useState<ILecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!lectureId) return;

    const fetchLecture = async () => {
      try {
        const res = await axios.get(`/lectures/${lectureId}`);
        setLecture(res.data.data);
      } catch (err) {
        console.error('Failed to fetch lecture:', err);
      } finally {
        setLoading(false);
      }
    };

    const checkProgress = async () => {
      try {
        const res = await axios.post('/progress/list', {
          lectureIds: [lectureId],
        });
        if (res.data.data?.includes(lectureId)) {
          setCompleted(true);
        }
      } catch (err) {
        console.error('Failed to check lecture progress:', err);
      }
    };

    fetchLecture();
    checkProgress();
  }, [lectureId]);

  const handleMarkComplete = async () => {
    try {
      await axios.post('/progress/complete', { lectureId });
      setCompleted(true);
      toast.success('Lecture marked as completed!');
    } catch (err) {
      console.error('Failed to mark lecture complete:', err);
      toast.error('Something went wrong!');
    }
  };

  if (!lectureId) return <div className="p-6 text-red-500">Invalid lecture ID</div>;
  if (loading) return <div className="p-6">Loading...</div>;
  if (!lecture) return <div className="p-6">Lecture not found</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{lecture.title}</h1>

      <div className="aspect-video mb-6">
        <iframe
          src={lecture.videoUrl}
          title="Lecture Video"
          className="w-full h-full rounded border"
          allowFullScreen
          aria-label="Lecture video player"
        ></iframe>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-2">PDF Notes</h2>
        {lecture.pdfNotes.length === 0 ? (
          <p>No notes available.</p>
        ) : (
          <ul className="list-disc pl-5">
            {lecture.pdfNotes.map((note, index) => (
              <li key={index}>
                <a
                  href={note}
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Note {index + 1}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleMarkComplete}
        className={`px-6 py-2 font-semibold rounded ${
          completed
            ? 'bg-green-600 text-white cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
        disabled={completed}
      >
        {completed ? 'Lecture Completed' : 'Mark as Completed'}
      </button>
    </div>
  );
};

export default LecturePage;
