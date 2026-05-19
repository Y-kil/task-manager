import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { useState } from 'react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setError('');
      try {
        const res = await api.post('/auth/login', values);
        login(res.data.user, res.data.token);
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.message || 'Login failed.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body p-4">
              <h3 className="card-title text-center mb-4">Welcome Back 👋</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                    {...formik.getFieldProps('email')} />
                  {formik.touched.email && formik.errors.email && <div className="invalid-feedback">{formik.errors.email}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input type="password" className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                    {...formik.getFieldProps('password')} />
                  {formik.touched.password && formik.errors.password && <div className="invalid-feedback">{formik.errors.password}</div>}
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={formik.isSubmitting}>
                  {formik.isSubmitting ? 'Logging in...' : 'Login'}
                </button>
              </form>
              <p className="text-center mt-3">Don't have an account? <Link to="/register">Register</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
