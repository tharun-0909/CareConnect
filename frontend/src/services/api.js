const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function apiRequest(path, options = {}) {
  const token = sessionStorage.getItem('careconnect_token');
  const response = await fetch(`${API_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && path !== '/auth/login' && path !== '/auth/register') {
      sessionStorage.removeItem('careconnect_token');
      sessionStorage.removeItem('careconnect_user');
      window.dispatchEvent(new Event('careconnect:session-expired'));
    }
    throw new Error(body.message || 'Request failed');
  }
  return body;
}
export const authApi = { login: credentials => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }), register: details => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(details) }), googleAuth: credential => apiRequest('/auth/google', { method: 'POST', body: JSON.stringify({ credential }) }), emailExists: email => apiRequest(`/auth/email-exists?email=${encodeURIComponent(email)}`), me: () => apiRequest('/auth/me') };
export const requestApi = { list: () => apiRequest('/requests'), create: details => apiRequest('/requests', { method: 'POST', body: JSON.stringify(details) }), assign: (id, providerId) => apiRequest(`/requests/${id}/provider`, { method: 'PATCH', body: JSON.stringify({ providerId }) }), complete: id => apiRequest(`/requests/${id}/complete`, { method: 'PATCH' }), updateStatus: (id, status) => apiRequest(`/requests/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }) };
export const notificationApi = { list: () => apiRequest('/notifications'), accept: id => apiRequest(`/notifications/${id}/accept`, { method: 'PATCH' }), reject: id => apiRequest(`/notifications/${id}/reject`, { method: 'PATCH' }) };
export const providerApi = { list: query => apiRequest(`/providers${query ? `?skill=${encodeURIComponent(query)}` : ''}`), me: () => apiRequest('/providers/me'), updateActivity: (isActive) => apiRequest('/providers/me/activity', { method: 'PATCH', body: JSON.stringify({ isActive }) }), updateLocation: (lat, lng) => apiRequest('/providers/me/location', { method: 'PATCH', body: JSON.stringify({ lat, lng }) }) };
export const reviewApi = { list: providerId => apiRequest(`/reviews${providerId ? `?provider=${encodeURIComponent(providerId)}` : ''}`), create: details => apiRequest('/reviews', { method: 'POST', body: JSON.stringify(details) }) };
