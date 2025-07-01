'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from '@/utils/api';
import Link from 'next/link';

interface IModule {
  _id: string;
  title: string;
  moduleNumber: number;
}

const AdminModulePage = () => {
  const { id: courseId } = useParams();
  const [modules, setModules] = useState<IModule[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchModules = useCallback(async () => {
    try {
      const res = await axios.get(`/modules/${courseId}`);
      setModules(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch modules:', err);
    }
  }, [courseId]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]); 

  const handleAddModule = async () => {
    if (!title) return;
    setLoading(true);
    try {
      await axios.post('/modules', { courseId, title });
      setTitle('');
      fetchModules();
    } catch (err) {
      console.error('Add module error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await axios.delete(`/modules/${id}`);
      fetchModules();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Modules</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Module Title"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          className="border px-4 py-2 rounded w-full mb-2"
        />
        <button
          onClick={handleAddModule}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Module'}
        </button>
      </div>

      {modules.length === 0 ? (
        <p>No modules yet.</p>
      ) : (
        <ul className="space-y-4">
          {modules.map((mod) => (
            <li key={mod._id} className="p-4 border rounded flex justify-between items-center">
              <div>
                <h3 className="font-semibold">
                  Module {mod.moduleNumber}: {mod.title}
                </h3>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/modules/${mod._id}/lectures`}
                  className="text-blue-600 underline"
                >
                  Lectures
                </Link>
                <button onClick={() => handleDelete(mod._id)} className="text-red-500">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminModulePage;
