import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';

const TaskList = ({ tasks, setTasks, setEditingTask }) => {
  const [statusFilter, setStatusFilter] = useState('All'); // NEW

  // Load all complaints
  const load = async () => {
    const { data } = await axiosInstance.get('/api/complaints');
    setTasks(data);
  };

  useEffect(() => { load(); }, []);

  const onEdit = (item) => setEditingTask(item);

  // Close without resolution
  const closeWithoutResolution = async (id) => {
    if (!window.confirm('Close without resolution?')) return;
    const { data } = await axiosInstance.post(`/api/complaints/${id}/close`);
    setTasks(prev => prev.map(x => x._id === data._id ? data : x));
  };

  // Filtered list (please work!)
  const visible = tasks.filter(t => statusFilter === 'All' || t.status === statusFilter);
  const canClose = (s) => s !== 'Closed - No Resolution' && s !== 'Resolved';

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Complaints</h2>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Filter by status:</label>
          <select
            className="border p-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
            <option>Closed - No Resolution</option>
          </select>
        </div>
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Complainant</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Assigned To</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Age (days)</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((x) => (
            <tr key={x._id}>
              <td className="p-2 border">{x.title}</td>
              <td className="p-2 border">
                {x.complainantName}
                <div className="text-xs text-gray-500">{x.email}</div>
              </td>
              <td className="p-2 border">{x.category}</td>
              <td className="p-2 border">{x.assignedTo}</td>
              <td className="p-2 border">{x.status}</td>
              <td className="p-2 border">{x.ageDays ?? '-'}</td>
              <td className="p-2 border space-x-2">
                <button onClick={() => onEdit(x)} className="px-2 py-1 bg-yellow-200 rounded">
                  Edit
                </button>
                {canClose(x.status) && (
                  <button onClick={() => closeWithoutResolution(x._id)} className="px-2 py-1 bg-gray-200 rounded">
                    Close w/o Res
                  </button>
                )}
              </td>
            </tr>
          ))}
          {visible.length === 0 && (
            <tr>
              <td colSpan={7} className="p-4 text-center text-gray-500">No complaints</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;