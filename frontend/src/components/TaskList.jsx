import { useEffect } from 'react';
import axiosInstance from '../axiosConfig';

const TaskList = ({ tasks, setTasks, setEditingTask }) => {
  // Load all complaints
  const load = async () => {
    const { data } = await axiosInstance.get('/api/complaints'); // includes ageDays if Epic 2 backend is in
    setTasks(data);
  };

  useEffect(() => { load(); }, []);

  const onEdit = (item) => setEditingTask(item);

  // US4: Close without resolution (status change handled here only for this action)
  const closeWithoutResolution = async (id) => {
    if (!window.confirm('Close without resolution?')) return;
    const { data } = await axiosInstance.post(`/api/complaints/${id}/close`);
    setTasks(prev => prev.map(x => x._id === data._id ? data : x));
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-xl font-semibold mb-3">Complaints</h2>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Complainant</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Assigned To</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Age (days)</th>{/* Shown if API returns ageDays */}
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((x) => (
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
                <button
                  onClick={() => onEdit(x)}
                  className="px-2 py-1 bg-yellow-200 rounded"
                >
                  Edit
                </button>
                {x.status !== 'Closed - No Resolution' && (
                  <button
                    onClick={() => closeWithoutResolution(x._id)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    Close w/o Res
                  </button>
                )}
              </td>
            </tr>
          ))}
          {tasks.length === 0 && (
            <tr>
              <td colSpan={7} className="p-4 text-center text-gray-500">
                No complaints
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
