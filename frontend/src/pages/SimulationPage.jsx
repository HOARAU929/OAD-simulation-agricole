import React, { useState, useEffect } from 'react'
import useCultureStore from '../stores/cultureStore'
import useSimulationStore from '../stores/simulationStore'
import Modal from '../components/Modal'
import Loading from '../components/Loading'
import { FaPlay, FaSave, FaTrash } from 'react-icons/fa'
import './SimulationPage.css'

function SimulationPage() {
  const cultures = useCultureStore((state) => state.cultures)
  const fetchCultures = useCultureStore((state) => state.fetchCultures)
  const simulations = useSimulationStore((state) => state.simulations)
  const simulationResults = useSimulationStore((state) => state.simulationResults)
  const runSimulation = useSimulationStore((state) => state.runSimulation)
  const createSimulation = useSimulationStore((state) => state.createSimulation)
  const deleteSimulation = useSimulationStore((state) => state.deleteSimulation)
  const loading = useSimulationStore((state) => state.loading)
  const error = useSimulationStore((state) => state.error)

  const [selectedCulture, setSelectedCulture] = useState(null)
  const [isResultsOpen, setIsResultsOpen] = useState(false)
  const [simulationInputs, setSimulationInputs] = useState({
    yield_variation: 0,
    bioagressor_impact: 0,
    price_variation: 0,
    scenario_name: '',
    user_notes: '',
  })

  useEffect(() => {
    fetchCultures()
  }, [])

  useEffect(() => {
    if (selectedCulture) {
      const fetchSimulationsForCulture = async () => {
        // Fetch simulations for selected culture
      }
      fetchSimulationsForCulture()
    }
  }, [selectedCulture])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSimulationInputs({
      ...simulationInputs,
      [name]: isNaN(value) ? value : parseFloat(value),
    })
  }

  const handleRunSimulation = async () => {
    if (!selectedCulture) {
      alert('Selectionnez une culture')
      return
    }
    try {
      await runSimulation(selectedCulture.id, simulationInputs)
      setIsResultsOpen(true)
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  const handleSaveSimulation = async () => {
    if (!selectedCulture) return
    try {
      await createSimulation({
        culture_id: selectedCulture.id,
        name: `Simulation_${selectedCulture.name}_${new Date().getTime()}`,
        yield_variation: simulationInputs.yield_variation,
        bioagressor_impact: simulationInputs.bioagressor_impact,
        price_variation: simulationInputs.price_variation,
        scenario_name: simulationInputs.scenario_name,
        user_notes: simulationInputs.user_notes,
      })
      alert('Simulation sauvegardee!')
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Confirmer la suppression?')) {
      try {
        await deleteSimulation(id)
      } catch (err) {
        console.error('Erreur:', err)
      }
    }
  }

  return (
    <div className="simulation-page">
      <h1 className="page-title">Simulations</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="simulation-grid">
        <div className="card input-section">
          <h2>Parametres de simulation</h2>

          <div className="form-group">
            <label className="form-label">Culture</label>
            <select
              value={selectedCulture?.id || ''}
              onChange={(e) => {
                const culture = cultures.find((c) => c.id === parseInt(e.target.value))
                setSelectedCulture(culture)
              }}
              className="input-field"
            >
              <option value="">-- Selectionnez une culture --</option>
              {cultures.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCulture && (
            <>
              <div className="culture-info">
                <div className="info-row">
                  <span>Rendement base:</span>
                  <strong>{selectedCulture.default_yield} t/ha</strong>
                </div>
                <div className="info-row">
                  <span>Prix base:</span>
                  <strong>{selectedCulture.default_price} EUR/kg</strong>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Variation rendement (%)</label>
                <input
                  type="number"
                  name="yield_variation"
                  value={simulationInputs.yield_variation}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.1"
                />
                <small>Negatif = baisse, Positif = hausse</small>
              </div>

              <div className="form-group">
                <label className="form-label">Impact bioagresseurs (%)</label>
                <input
                  type="number"
                  name="bioagressor_impact"
                  value={simulationInputs.bioagressor_impact}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.1"
                />
                <small>Perte de rendement due aux bioagresseurs</small>
              </div>

              <div className="form-group">
                <label className="form-label">Variation prix (%)</label>
                <input
                  type="number"
                  name="price_variation"
                  value={simulationInputs.price_variation}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.1"
                />
                <small>Negatif = baisse, Positif = hausse</small>
              </div>

              <div className="form-group">
                <label className="form-label">Nom du scenario</label>
                <input
                  type="text"
                  name="scenario_name"
                  value={simulationInputs.scenario_name}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="ex: Secheresse + Ravageurs"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  name="user_notes"
                  value={simulationInputs.user_notes}
                  onChange={handleInputChange}
                  className="input-field"
                  rows="3"
                  placeholder="Notes additionnelles..."
                ></textarea>
              </div>

              <div className="button-group">
                <button className="btn btn-primary" onClick={handleRunSimulation} disabled={loading}>
                  <FaPlay /> Executer simulation
                </button>
                <button className="btn btn-secondary" onClick={handleSaveSimulation} disabled={loading}>
                  <FaSave /> Sauvegarder
                </button>
              </div>
            </>
          )}
        </div>

        {simulationResults && (
          <div className="card results-section">
            <h2>Resultats</h2>
            <div className="results-grid">
              <div className="result-item">
                <span className="result-label">Rendement final</span>
                <span className="result-value">{simulationResults.yield_value.toFixed(2)} t/ha</span>
              </div>
              <div className="result-item">
                <span className="result-label">Prix final</span>
                <span className="result-value">{simulationResults.price_value.toFixed(2)} EUR/kg</span>
              </div>
              <div className="result-item">
                <span className="result-label">Produits bruts</span>
                <span className="result-value">{simulationResults.gross_products.toFixed(0)} EUR</span>
              </div>
              <div className="result-item">
                <span className="result-label">Marge brute</span>
                <span className="result-value">{simulationResults.gross_margin.toFixed(0)} EUR</span>
              </div>
              <div className="result-item">
                <span className="result-label">Marge nette</span>
                <span
                  className={`result-value ${
                    simulationResults.net_margin >= 0 ? 'positive' : 'negative'
                  }`}
                >
                  {simulationResults.net_margin.toFixed(0)} EUR
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">Cout /100kg</span>
                <span className="result-value">{simulationResults.cost_per_100kg.toFixed(2)} EUR</span>
              </div>
            </div>

            <div className="charges-breakdown">
              <h3>Charges</h3>
              <div className="charge-item">
                <span>Operationnelles:</span>
                <span>{simulationResults.total_operational_charges.toFixed(0)} EUR</span>
              </div>
              <div className="charge-item">
                <span>Structure:</span>
                <span>{simulationResults.total_structure_charges.toFixed(0)} EUR</span>
              </div>
              <div className="charge-item">
                <span>Supletives:</span>
                <span>{simulationResults.total_suppletive_charges.toFixed(0)} EUR</span>
              </div>
            </div>

            <div className="impact-section">
              <h3>Impacts du scenario</h3>
              <div className="impact-item">
                <span>Sur les produits:</span>
                <span
                  className={`impact-value ${simulationResults.impact_on_gross_products >= 0 ? 'positive' : 'negative'}`}
                >
                  {simulationResults.impact_on_gross_products.toFixed(2)}%
                </span>
              </div>
              <div className="impact-item">
                <span>Sur la marge nette:</span>
                <span
                  className={`impact-value ${simulationResults.impact_on_margin >= 0 ? 'positive' : 'negative'}`}
                >
                  {simulationResults.impact_on_margin.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {simulations.length > 0 && (
        <div className="card simulations-history">
          <h2>Historique des simulations</h2>
          <table className="simulations-table">
            <thead>
              <tr>
                <th>Scenario</th>
                <th>Culture</th>
                <th>Marge nette</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {simulations.map((sim) => (
                <tr key={sim.id}>
                  <td>{sim.scenario_name}</td>
                  <td>{sim.name}</td>
                  <td className={sim.results.net_margin >= 0 ? 'positive' : 'negative'}>
                    {sim.results.net_margin.toFixed(0)} EUR
                  </td>
                  <td>{new Date(sim.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="btn-icon delete" onClick={() => handleDelete(sim.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default SimulationPage
