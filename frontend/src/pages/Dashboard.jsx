import React, { useEffect } from 'react'
import useCultureStore from '../stores/cultureStore'
import useSimulationStore from '../stores/simulationStore'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Loading from '../components/Loading'
import './Dashboard.css'

function Dashboard() {
  const cultures = useCultureStore((state) => state.cultures)
  const fetchCultures = useCultureStore((state) => state.fetchCultures)
  const simulations = useSimulationStore((state) => state.simulations)
  const loading = useCultureStore((state) => state.loading)

  useEffect(() => {
    fetchCultures()
  }, [])

  if (loading) return <Loading message="Chargement du tableau de bord..." />

  const chartData = cultures.map((culture) => ({
    name: culture.name.substring(0, 10),
    yield: culture.default_yield,
    price: culture.default_price * 10,
  }))

  return (
    <div className="dashboard">
      <h1 className="page-title">Tableau de bord</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Cultures</div>
          <div className="stat-value">{cultures.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Simulations</div>
          <div className="stat-value">{simulations.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Rendement moyen</div>
          <div className="stat-value">
            {cultures.length > 0
              ? (cultures.reduce((sum, c) => sum + c.default_yield, 0) / cultures.length).toFixed(1)
              : 0}
            t/ha
          </div>
        </div>
      </div>

      <div className="chart-container card">
        <h2>Cultures par rendement</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="yield" fill="#10b981" name="Rendement (t/ha)" />
              <Bar dataKey="price" fill="#3b82f6" name="Prix (EUR/kg x10)" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="no-data">Aucune culture disponible</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard
