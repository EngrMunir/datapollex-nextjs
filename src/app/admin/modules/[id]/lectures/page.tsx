'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import axios from '@/utils/api';

interface ILecture {
  _id: string;
  title: string;
  videoUrl: string;
  lectureNumber: number;
  pdfNotes: string[];
}

const LectureManagementPage = () => {
  const { id: moduleId } = useParams();
  const sp = useSearchParams();
  const courseId = sp?.get('courseId');
  console.log('course id', courseId);
  
  const [lectures, setLectures] = useState<ILecture[]>([]);
  const [lectureNumber, setLectureNumber] = useState('');
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [pdfNotes, setPdfNotes] = useState<string[]>([]);
  const [pdfNoteInput, setPdfNoteInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [editingLecture, setEditingLecture] = useState<ILecture | null>(null); // State for editing lecture
  
  const fetchLectures = useCallback(async () => {
    try {
      const res = await axios.get(`/lectures/${moduleId}`);
      setLectures(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch lectures:', err);
    }
  }, [moduleId]);

  useEffect(() => {
    fetchLectures();
  }, [fetchLectures]);

  // Handle adding new lecture
  const handleAddLecture = async () => {
    if (!title || !videoUrl) return;
    setLoading(true);
    try {
      await axios.post('/lectures', {
        moduleId,
        courseId,
        title,
        videoUrl,
        lectureNumber: Number(lectureNumber),
        pdfNotes,
      });
      setTitle('');
      setVideoUrl('');
      setPdfNotes([]);
      setLectureNumber('');
      fetchLectures();
    } catch (err) {
      console.error('Add lecture error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle updating an existing lecture
  const handleUpdateLecture = async () => {
    if (!editingLecture || !title || !videoUrl) return;
    setLoading(true);
    try {
      await axios.patch(`/lectures/${editingLecture._id}`, {
        title,
        videoUrl,
        lectureNumber: Number(lectureNumber),
        pdfNotes,
      });
      setEditingLecture(null); // Reset after successful update
      setTitle('');
      setVideoUrl('');
      setPdfNotes([]);
      setLectureNumber('');
      fetchLectures();
    } catch (err) {
      console.error('Update lecture error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete action
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await axios.delete(`/lectures/${id}`);
      fetchLectures();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const addPdfNote = () => {
    if (pdfNoteInput.trim()) {
      setPdfNotes([...pdfNotes, pdfNoteInput.trim()]);
      setPdfNoteInput('');
    }
  };

  // Handle editing a lecture
  const handleEditLecture = (lecture: ILecture) => {
    setEditingLecture(lecture);
    setTitle(lecture.title);
    setVideoUrl(lecture.videoUrl);
    setLectureNumber(String(lecture.lectureNumber));
    setPdfNotes(lecture.pdfNotes);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{editingLecture ? 'Edit Lecture' : 'Add Lecture'}</h1>

      <div className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Lecture Number"
          value={lectureNumber}
          onChange={(e) => setLectureNumber(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Lecture Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="YouTube Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="PDF Note Link"
            value={pdfNoteInput}
            onChange={(e) => setPdfNoteInput(e.target.value)}
            className="border px-4 py-2 rounded w-full"
          />
          <button
            onClick={addPdfNote}
            className="bg-gray-300 px-4 rounded hover:bg-gray-400"
          >
            Add PDF
          </button>
        </div>

        {pdfNotes.length > 0 && (
          <ul className="list-disc pl-6 text-sm text-gray-700">
            {pdfNotes.map((pdf, i) => (
              <li key={i}>{pdf}</li>
            ))}
          </ul>
        )}

        <button
          onClick={editingLecture ? handleUpdateLecture : handleAddLecture}
          disabled={loading}
          className="mt-2 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : editingLecture ? 'Update Lecture' : 'Add Lecture'}
        </button>
      </div>

      {lectures.length === 0 ? (
        <p>No lectures found.</p>
      ) : (
        <ul className="space-y-4">
          {lectures.map((lec) => (
            <li key={lec._id} className="p-4 border rounded">
              <h3 className="font-semibold text-lg">{lec.title}</h3>
              <p className="text-sm text-blue-600">{lec.videoUrl}</p>
              <ul className="list-disc pl-6 text-sm text-gray-600 mt-1">
                {lec.pdfNotes.map((pdf, i) => (
                  <li key={i}>
                    <a href={pdf} target="_blank" className="underline">
                      PDF {i + 1}
                    </a>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleDelete(lec._id)}
                className="mt-2 text-red-500"
              >
                Delete
              </button>
              <button
                onClick={() => handleEditLecture(lec)}
                className="mt-2 text-blue-500 ml-2"
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LectureManagementPage;
