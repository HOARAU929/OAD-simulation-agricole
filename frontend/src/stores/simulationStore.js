import { create } from 'zustand'
import { simulationAPI } from '../api'

const useSimulationStore = create((set, get) => ({
  simulations: [],
  currentSimulation: null,
  simulationResults: null,
  loading: false,
  error: null,

  fetchSimulations: async (cultureId) => {
    set({ loading: true, error: null })
    try {
      const response = await simulationAPI.getAll(cultureId)
      set({ simulations: response.data })
    } catch (error) {
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  },

  runSimulation: async (cultureId, inputs) => {
    set({ loading: true, error: null })
    try {
      const response = await simulationAPI.runSimulation(cultureId, inputs)
      set({ simulationResults: response.data })
      return response.data
    } catch (error) {
      set({ error: error.response?.data?.detail || error.message })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  createSimulation: async (data) => {
    set({ loading: true, error: null })
    try {
      const response = await simulationAPI.create(data)
      set((state) => ({
        simulations: [...state.simulations, response.data],
      }))
      return response.data
    } catch (error) {
      set({ error: error.response?.data?.detail || error.message })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  deleteSimulation: async (id) => {
    try {
      await simulationAPI.delete(id)
      set((state) => ({
        simulations: state.simulations.filter((s) => s.id !== id),
      }))
    } catch (error) {
      set({ error: error.response?.data?.detail || error.message })
      throw error
    }
  },
}))

export default useSimulationStore
