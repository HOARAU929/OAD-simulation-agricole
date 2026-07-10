import axios from 'axios'

const API_URL = 'http://localhost:8000/api/v1'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const cultureAPI = {
  getAll: () => api.get('/cultures/'),
  getById: (id) => api.get(`/cultures/${id}`),
  create: (data) => api.post('/cultures/', data),
  update: (id, data) => api.put(`/cultures/${id}`, data),
  delete: (id) => api.delete(`/cultures/${id}`),
}

export const simulationAPI = {
  runSimulation: (cultureId, inputs) => api.post(`/simulations/run/${cultureId}`, inputs),
  getAll: (cultureId) => api.get('/simulations/', { params: { culture_id: cultureId } }),
  getById: (id) => api.get(`/simulations/${id}`),
  create: (data) => api.post('/simulations/', data),
  update: (id, data) => api.put(`/simulations/${id}`, data),
  delete: (id) => api.delete(`/simulations/${id}`),
}

export const healthAPI = {
  check: () => api.get('/health'),
}

export default api
