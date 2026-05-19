import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({ status: '', priority: '', search: '' });
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      if (filter.priority) params.append('priority', filter.priority);
      if (filter.search) params.append('search', filter.search);
      const res = await api.get(`/tasks?${params}`);
      setTasks(res.data);
    } catch {
      setError('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, [filter]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: editTask?.title || '',
      description: editTask?.description || '',
      status: editTask?.status || 'pending',
      priority: editTask?.priority || 'medium',
      due_date: editTask?.due_date?.slice(0, 10) || '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        if (editTask) {
          await api.put(`/tasks/${editTask.id}`, values);
        } else {
          await api.post('/tasks', values);
        }
        resetForm();
        setShowForm(false);
        setEditTask(null);
        fetchTasks();
      } catch {
        setError('Failed to save task.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch { setError('Failed to delete task.'); }
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
  };

  const priorityBadge = { low: 'success', medium: 'warning', high: 'danger' };
  const statusBadge = { pending: 'secondary', in_progress: 'primary', completed: 'success' };

  return (
    <div className="container mt-4">
      <h4 className="mb-1">Welcome, {user?.name} 👋</h4>
      <p className="text-muted mb-4">Here's your task overview</p>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[['Total', stats.total, 'primary'], ['Completed', stats.completed, 'success'],
          ['In Progress', stats.inProgress, 'warning'], ['Pending', stats.pending, 'secondary']].map(([label, val, color]) => (
          <div className="col-6 col-md-3" key={label}>
            <div className={`card border-${color} text-center p-3`}>
              <h2 className={`text-${color} mb-0`}>{val}</h2>
              <small className="text-muted">{label}</small>
            </div>
          </div>
        ))}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filters */}
      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <input className="form-control" placeholder="🔍 Search tasks..." value={filter.search}
            onChange={e => setFilter(f => ({ ...f, search: e.target.value }))} />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={filter.priority} onChange={e => setFilter(f => ({ ...f, priority: e.target.value }))}>
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={() => { setShowForm(true); setEditTask(null); }}>+ Add Task</button>
        </div>
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <div className="card mb-4 border-primary">
          <div className="card-body">
            <h5>{editTask ? 'Edit Task' : 'New Task'}</h5>
            <form onSubmit={formik.handleSubmit}>
              <div className="row g-2">
                <div className="col-md-6">
                  <input className={`form-control ${formik.touched.title && formik.errors.title ? 'is-invalid' : ''}`}
                    placeholder="Task title *" {...formik.getFieldProps('title')} />
                  {formik.touched.title && formik.errors.title && <div className="invalid-feedback">{formik.errors.title}</div>}
                </div>
                <div className="col-md-6">
                  <input type="date" className="form-control" {...formik.getFieldProps('due_date')} />
                </div>
                <div className="col-12">
                  <textarea className="form-control" rows={2} placeholder="Description..." {...formik.getFieldProps('description')} />
                </div>
                <div className="col-md-4">
                  <select className="form-select" {...formik.getFieldProps('status')}>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <select className="form-select" {...formik.getFieldProps('priority')}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="col-md-4 d-flex gap-2">
                  <button type="submit" className="btn btn-success flex-fill" disabled={formik.isSubmitting}>
                    {formik.isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                  <button type="button" className="btn btn-secondary flex-fill" onClick={() => { setShowForm(false); setEditTask(null); }}>Cancel</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tasks List */}
      {loading ? <p>Loading tasks...</p> : tasks.length === 0 ? (
        <div className="text-center text-muted py-5">No tasks found. Add your first task!</div>
      ) : (
        <div className="row g-3">
          {tasks.map(task => (
            <div className="col-md-6 col-lg-4" key={task.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="card-title mb-0">{task.title}</h6>
                    <span className={`badge bg-${priorityBadge[task.priority]}`}>{task.priority}</span>
                  </div>
                  {task.description && <p className="card-text text-muted small">{task.description}</p>}
                  <span className={`badge bg-${statusBadge[task.status]}`}>{task.status.replace('_', ' ')}</span>
                  {task.due_date && <small className="text-muted ms-2">Due: {task.due_date.slice(0, 10)}</small>}
                </div>
                <div className="card-footer d-flex gap-2">
                  <button className="btn btn-sm btn-outline-primary flex-fill" onClick={() => { setEditTask(task); setShowForm(true); }}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger flex-fill" onClick={() => handleDelete(task.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
