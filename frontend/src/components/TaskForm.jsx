import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';

const TaskForm = ({ tasks, setTasks, editingTask, setEditingTask }) => {
  const [formData, setFormData] = useState({
    complainantName: '',
    email: '',
    phoneNumber: '',
    title: '',
    description: '',
    category: 'Low',
    assignedTo: ''
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        complainantName: editingTask.complainantName || '',
        email: editingTask.email || '',
        phoneNumber: editingTask.phoneNumber || '',
        title: editingTask.title || '',
        description: editingTask.description || '',
        category: editingTask.category || 'Low',
        assignedTo: editingTask.assignedTo || ''
      });
    } else {
      setFormData({
        complainantName: '',
        email: '',
        phoneNumber: '',
        title: '',
        description: '',
        category: 'Low',
        assignedTo: ''
      });
    }
  }, [editingTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingTask) {
      // US3: Update complaint details
      const { data } = await axiosInstance.patch(`/api/complaints/${editingTask._id}`, formData);
      setTasks((prev) => prev.map((x) => (x._id === data._id ? data : x)));
      setEditingTask(null);
    } else {
      // US1: Register complaint
      const { data } = await axiosInstance.post('/api/complaints', formData);
      setTasks((prev) => [data, ...prev]);
    }
    // reset
    setFormData({
      complainantName: '',
      email: '',
      phoneNumber: '',
      title: '',
      description: '',
      category: 'Low',
      assignedTo: ''
    });
  };

  const cancelEdit = () => setEditingTask(null);

  return (
    <div className="max-w-xl mx-auto mb-6">
      <h2 className="text-xl font-semibold mb-3">
        {editingTask ? 'Edit Complaint' : 'Register Complaint'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-2">
        <input className="border p-2 w-full" name="complainantName" placeholder="Complainant Name"
               value={formData.complainantName} onChange={handleChange} required />
        <input className="border p-2 w-full" name="email" type="email" placeholder="Email Address"
               value={formData.email} onChange={handleChange} required />
        <input className="border p-2 w-full" name="phoneNumber" placeholder="Phone Number"
               value={formData.phoneNumber} onChange={handleChange} required />

        <input className="border p-2 w-full" name="title" placeholder="Title for the Complaint"
               value={formData.title} onChange={handleChange} required />
        <textarea className="border p-2 w-full" name="description" placeholder="Description"
                  rows={3} value={formData.description} onChange={handleChange} />

        <select className="border p-2 w-full" name="category" value={formData.category} onChange={handleChange}>
          <option>Low</option>
          <option>Moderate</option>
          <option>High</option>
        </select>

        <input className="border p-2 w-full" name="assignedTo" placeholder="Assigned To"
               value={formData.assignedTo} onChange={handleChange} required />

        <div className="flex items-center gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
            {editingTask ? 'Save Changes' : 'Submit'}
          </button>
          {editingTask && (
            <button type="button" onClick={cancelEdit} className="px-4 py-2 rounded border">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
