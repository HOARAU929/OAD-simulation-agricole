import { create } from 'zustand'
import { cultureAPI, simulationAPI } from './api'

const useCultureStore = create((set, get) => ({
  cultures: [],
  selectedCulture: null,
  loading: false,
  error: null,

  fetchCultures: async () => {
    set({ loading: true, error: null })
    try {
      const response = await cultureAPI.getAll()
      set({ cultures: response.data })
    } catch (error) {
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  },

  selectCulture: (culture) => {
    set({ selectedCulture: culture })
  },

  createCulture: async (data) => {
    try {
      const response = await cultureAPI.create(data)
      set((state) => ({
        cultures: [...state.cultures, response.data],
      }))
      return response.data
    } catch (error) {
      set({ error: error.response?.data?.detail || error.message })
      throw error
    }
  },

  updateCulture: async (id, data) => {
    try {
      const response = await cultureAPI.update(id, data)
      set((state) => ({
        cultures: state.cultures.map((c) => (c.id === id ? response.data : c)),
      }))
      return response.data
    } catch (error) {
      set({ error: error.response?.data?.detail || error.message })
      throw error
    }
  },

  deleteCulture: async (id) => {
    try {
      await cultureAPI.delete(id)
      set((state) => ({
        cultures: state.cultures.filter((c) => c.id !== id),
      }))
    } catch (error) {
      set({ error: error.response?.data?.detail || error.message })
      throw error
    }
  },
}))

export default useCultureStore
