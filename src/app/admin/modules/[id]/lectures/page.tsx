'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import axios from '@/utils/api';
import { useForm, useFieldArray } from 'react-hook-form';
import { ILecture, ILectureFormValues } from '@/types';


const urlPattern = /^[^\s]+:\/\/\S+$/;

const LectureManagementPage = () => {
  const { id: moduleId } = useParams();
  const sp = useSearchParams();
  const courseId = sp?.get('courseId') ?? undefined;

  const [lectures, setLectures] = useState<ILecture[]>([]);
  const [editingLecture, setEditingLecture] = useState<ILecture | null>(null);

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

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ILectureFormValues>({
    defaultValues: {
      lectureNumber: '',
      title: '',
      videoUrl: '',
      pdfNotes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'pdfNotes',
  });

  useEffect(() => {
    if (editingLecture) {
      reset({
        lectureNumber: String(editingLecture.lectureNumber ?? ''),
        title: editingLecture.title ?? '',
        videoUrl: editingLecture.videoUrl ?? '',
        pdfNotes: (editingLecture.pdfNotes || []).map((u) => ({ url: u })),
      });
    } else {
      reset({ lectureNumber: '', title: '', videoUrl: '', pdfNotes: [] });
    }
  }, [editingLecture, reset]);

  const onSubmit = async (values: ILectureFormValues) => {
    const payload = {
      moduleId,
      courseId,
      title: values.title.trim(),
      videoUrl: values.videoUrl.trim(),
      lectureNumber: Number(values.lectureNumber || 0),
      pdfNotes: values.pdfNotes
        .map((p) => p.url.trim())
        .filter((u) => u.length > 0),
    };

    try {
      if (editingLecture) {
        await axios.patch(`/lectures/${editingLecture._id}`, payload);
      } else {
        await axios.post('/lectures', payload);
      }
      await fetchLectures();
      setEditingLecture(null);
      reset({ lectureNumber: '', title: '', videoUrl: '', pdfNotes: [] });
    } catch (err) {
      console.error(editingLecture ? 'Update lecture error:' : 'Add lecture error:', err);
    }
  };

  const startEdit = (lecture: ILecture) => setEditingLecture(lecture);
  const cancelEdit = () => setEditingLecture(null);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{editingLecture ? 'Edit Lecture' : 'Add Lecture'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-6 space-y-3">
        <div>
          <input
            type="text"
            placeholder="Lecture Number"
            className="border px-4 py-2 rounded w-full"
            {...register('lectureNumber', {
              required: 'Lecture number is required',
              validate: (v) =>
                /^\d+$/.test(v) && Number(v) > 0 || 'Enter a positive integer',
            })}
          />
          {errors.lectureNumber && <p className="text-red-600 text-sm">{errors.lectureNumber.message}</p>}
        </div>

        <div>
          <input
            type="text"
            placeholder="Lecture Title"
            className="border px-4 py-2 rounded w-full"
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
        </div>

        <div>
          <input
            type="text"
            placeholder="YouTube Video URL"
            className="border px-4 py-2 rounded w-full"
            {...register('videoUrl', {
              required: 'Video URL is required',
              pattern: { value: urlPattern, message: 'Enter a valid URL' },
            })}
          />
          {errors.videoUrl && <p className="text-red-600 text-sm">{errors.videoUrl.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">PDF Notes</span>
            <button
              type="button"
              onClick={() => append({ url: '' })}
              className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 text-sm"
            >
              + Add PDF
            </button>
          </div>

          {fields.length === 0 && <p className="text-sm text-gray-500">No PDFs added.</p>}

          {fields.map((field, idx) => (
            <div key={field.id} className="flex gap-2">
              <input
                type="text"
                placeholder={`PDF URL #${idx + 1}`}
                className="border px-4 py-2 rounded w-full"
                {...register(`pdfNotes.${idx}.url`, {
                  validate: (v) => (v?.trim() ? urlPattern.test(v) || 'Invalid URL' : true),
                })}
              />
              <button
                type="button"
                onClick={() => remove(idx)}
                className="bg-red-100 text-red-600 px-3 rounded hover:bg-red-200"
              >
                Remove
              </button>
            </div>
          ))}

          {errors.pdfNotes && <p className="text-red-600 text-sm">Please fix invalid PDF URLs.</p>}
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : editingLecture ? 'Update Lecture' : 'Add Lecture'}
          </button>
          {editingLecture && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-6 py-2 rounded border hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {lectures.length === 0 ? (
        <p>No lectures found.</p>
      ) : (
        <ul className="space-y-4">
          {lectures.map((lec) => (
            <li key={lec._id} className="p-4 border rounded">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">#{lec.lectureNumber} — {lec.title}</h3>
                  <p className="text-sm text-blue-600 break-all">{lec.videoUrl}</p>
                  {lec.pdfNotes.length > 0 && (
                    <ul className="list-disc pl-6 text-sm text-gray-700 mt-2">
                      {lec.pdfNotes.map((pdf, i) => (
                        <li key={i}><a className="underline break-all" href={pdf} target="_blank">PDF {i + 1}</a></li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="shrink-0 space-x-2">
                  <button
                    onClick={() => startEdit(lec)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm('Are you sure?')) return;
                      try {
                        await axios.delete(`/lectures/${lec._id}`);
                        fetchLectures();
                      } catch (err) {
                        console.error('Delete error:', err);
                      }
                    }}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LectureManagementPage;