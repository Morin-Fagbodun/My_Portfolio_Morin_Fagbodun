import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const api = useApi();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login(username, password);
      login(res.data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-dark)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={8} md={5} lg={4}>
            <div style={{
              background: 'white',
              borderRadius: 'var(--radius)',
              padding: '2.5rem',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}>
              <div className="text-center mb-4">
                <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>
                  Admin Access
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-light)' }}>
                  Portfolio management panel
                </p>
              </div>

              {error && <Alert color="danger" className="py-2">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="username" style={{ fontWeight: 500, fontSize: '0.9rem' }}>Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    required
                    style={{ borderRadius: '0.5rem' }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="password" style={{ fontWeight: 500, fontSize: '0.9rem' }}>Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{ borderRadius: '0.5rem' }}
                  />
                </FormGroup>
                <Button
                  type="submit"
                  block
                  disabled={loading}
                  style={{
                    background: 'var(--color-dark)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                    fontWeight: 600,
                    marginTop: '0.5rem',
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <a
                  href="/"
                  style={{ fontSize: '0.85rem', color: 'var(--color-light)' }}
                >
                  ← Back to portfolio
                </a>
              </div>
            </div>

            <p className="text-center mt-3" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
              Default password: <code style={{ color: 'rgba(255,255,255,0.5)' }}>password</code>
              <br />Change it after first login.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
