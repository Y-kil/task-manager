import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { useState } from 'react';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', confirmPassword: '' },
    validationSchema: Yup.object({
      name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setError('');
      try {
        const res = await api.post('/auth/register', {
          name: values.name,
          email: values.email,
          password: values.password,
        });
        login(res.data.user, res.data.token);
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed.');
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
              <h3 className="card-title text-center mb-4">Create Account</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input type="text" className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                    {...formik.getFieldProps('name')} />
                  {formik.touched.name && formik.errors.name && <div className="invalid-feedback">{formik.errors.name}</div>}
                </div>
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
                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input type="password" className={`form-control ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'is-invalid' : ''}`}
                    {...formik.getFieldProps('confirmPassword')} />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && <div className="invalid-feedback">{formik.errors.confirmPassword}</div>}
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={formik.isSubmitting}>
                  {formik.isSubmitting ? 'Registering...' : 'Register'}
                </button>
              </form>
              <p className="text-center mt-3">Already have an account? <Link to="/login">Login</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
