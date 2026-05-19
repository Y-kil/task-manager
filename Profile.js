import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const Profile = () => {
  const { user, login } = useAuth();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { name: user?.name || '', email: user?.email || '', profile_picture: user?.profile_picture || '' },
    validationSchema: Yup.object({
      name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setError(''); setSuccess('');
      try {
        await api.put('/users/profile', { name: values.name, profile_picture: values.profile_picture });
        login({ ...user, name: values.name, profile_picture: values.profile_picture }, localStorage.getItem('token'));
        setSuccess('Profile updated successfully!');
      } catch {
        setError('Failed to update profile.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <img src={user?.profile_picture || `https://ui-avatars.com/api/?name=${user?.name}&background=0d6efd&color=fff&size=80`}
                  alt="avatar" className="rounded-circle mb-2" width={80} height={80} />
                <h5>{user?.name}</h5>
                <small className="text-muted">{user?.email}</small>
              </div>
              {success && <div className="alert alert-success">{success}</div>}
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input type="text" className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                    {...formik.getFieldProps('name')} />
                  {formik.touched.name && formik.errors.name && <div className="invalid-feedback">{formik.errors.name}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Email <span className="text-muted">(read-only)</span></label>
                  <input type="email" className="form-control" value={formik.values.email} readOnly disabled />
                </div>
                <div className="mb-3">
                  <label className="form-label">Profile Picture URL</label>
                  <input type="text" className="form-control" placeholder="https://..." {...formik.getFieldProps('profile_picture')} />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={formik.isSubmitting}>
                  {formik.isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
