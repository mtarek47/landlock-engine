import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Request interceptor: attach Bearer token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('landlock_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: on 401 clear token and redirect (unless on public pages)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('landlock_token')
      localStorage.removeItem('landlock_user')
      if (
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/' &&
        window.location.pathname !== '/citizen'
      ) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient

// Auth APIs
export const authApi = {
  login: (username, password) => apiClient.post('/auth/login', { username, password }),
  me: () => apiClient.get('/auth/me'),
}

// Parcel APIs
export const parcelApi = {
  search: (params) => apiClient.get('/parcels/search', { params }),
  getById: (id) => apiClient.get(`/parcels/${id}`),
  publicStatus: (id) => apiClient.get(`/parcels/${id}/public-status`),
  create: (data) => apiClient.post('/parcels', data),
}

// Registry APIs
export const registryApi = {
  check: (data) => apiClient.post('/registry/checks', data),
  getCheck: (id) => apiClient.get(`/registry/checks/${id}`),
}

// Case APIs
export const caseApi = {
  getById: (id) => apiClient.get(`/cases/${id}`),
  create: (data) => apiClient.post('/cases', data),
  addParcel: (id, data) => apiClient.post(`/cases/${id}/parcels`, data),
  addOrder: (id, data) => apiClient.post(`/cases/${id}/orders`, data),
}

// Order APIs
export const orderApi = {
  getById: (id) => apiClient.get(`/orders/${id}`),
  submit: (id) => apiClient.post(`/orders/${id}/submit`),
  approve: (id, reason) => apiClient.post(`/orders/${id}/approve`, { reason }),
  reject: (id, reason) => apiClient.post(`/orders/${id}/reject`, { reason }),
}

// Restriction APIs
export const restrictionApi = {
  getByParcel: (parcelId) => apiClient.get(`/restrictions/parcel/${parcelId}`),
  getById: (id) => apiClient.get(`/restrictions/${id}`),
  create: (data) => apiClient.post('/restrictions', data),
  release: (id, reason) => apiClient.post(`/restrictions/${id}/release`, { reason }),
}

// Mortgage APIs
export const mortgageApi = {
  verify: (parcelId) => apiClient.post('/mortgages/verify', { parcelId }),
  getById: (id) => apiClient.get(`/mortgages/${id}`),
  create: (data) => apiClient.post('/mortgages', data),
  release: (id, releaseReference) => apiClient.post(`/mortgages/${id}/release`, { releaseReference }),
}

// Audit APIs
export const auditApi = {
  getEvents: (params) => apiClient.get('/audit/events', { params }),
  getByEntity: (entityType, entityId) => apiClient.get(`/audit/events/entity/${entityType}/${entityId}`),
}
