import React, { useState, useEffect } from 'react'
import useCultureStore from '../stores/cultureStore'
import Modal from '../components/Modal'
import Loading from '../components/Loading'
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'
import './CultureManagement.css'

function CultureManagement() {
  const cultures = useCultureStore((state) => state.cultures)
  const fetchCultures = useCultureStore((state) => state.fetchCultures)
  const createCulture = useCultureStore((state) => state.createCulture)
  const updateCulture = useCultureStore((state) => state.updateCulture)
  const deleteCulture = useCultureStore((state) => state.deleteCulture)
  const loading = useCultureStore((state) => state.loading)
  const error = useCultureStore((state) => state.error)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCulture, setEditingCulture] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fertilizer_cost: 0,
    bioagressor_intrants_cost: 0,
    other_intrants_cost: 0,
    labor_cost: 0,
    mechanization_cost: 0,
    building_cost: 0,
    insurance_cost: 0,
    miscellaneous_cost: 0,
    fermage_cost: 0,
    capital_cost: 0,
    default_yield: 30,
    default_price: 1.3,
  })

  useEffect(() => {
    fetchCultures()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: isNaN(value) ? value : parseFloat(value),
    })
  }

  const handleOpenModal = (culture = null) => {
    if (culture) {
      setEditingCulture(culture)
      setFormData(culture)
    } else {
      setEditingCulture(null)
      setFormData({
        name: '',
        description: '',
        fertilizer_cost: 0,
        bioagressor_intrants_cost: 0,
        other_intrants_cost: 0,
        labor_cost: 0,
        mechanization_cost: 0,
        building_cost: 0,
        insurance_cost: 0,
        miscellaneous_cost: 0,
        fermage_cost: 0,
        capital_cost: 0,
        default_yield: 30,
        default_price: 1.3,
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCulture) {
        await updateCulture(editingCulture.id, formData)
      } else {
        await createCulture(formData)
      }
      setIsModalOpen(false)
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Confirmer la suppression?')) {
      try {
        await deleteCulture(id)
      } catch (err) {
        console.error('Erreur:', err)
      }
    }
  }

  if (loading) return <Loading message="Chargement des cultures..." />

  return (
    <div className="culture-management">
      <div className="page-header">
        <h1 className="page-title">Gestion des Cultures</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <FaPlus /> Ajouter une culture
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="table-container card">
        {cultures.length > 0 ? (
          <table className="cultures-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Rendement (t/ha)</th>
                <th>Prix (EUR/kg)</th>
                <th>Charges (EUR/ha)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cultures.map((culture) => (
                <tr key={culture.id}>
                  <td>
                    <strong>{culture.name}</strong>
                    <br />
                    <span className="description">{culture.description}</span>
                  </td>
                  <td>{culture.default_yield.toFixed(1)}</td>
                  <td>{culture.default_price.toFixed(2)}</td>
                  <td>
                    {
                      (
                        culture.fertilizer_cost +
                        culture.bioagressor_intrants_cost +
                        culture.labor_cost
                      ).toFixed(0)
                    }
                  </td>
                  <td className="actions">
                    <button
                      className="btn-icon edit"
                      onClick={() => handleOpenModal(culture)}
                      title="Modifier"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(culture.id)}
                      title="Supprimer"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data">Aucune culture. Commencez par en ajouter une!</p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        title={editingCulture ? 'Modifier la culture' : 'Ajouter une culture'}
        onClose={() => setIsModalOpen(false)}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="culture-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nom</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Rendement & Prix</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Rendement (t/ha)</label>
                <input
                  type="number"
                  name="default_yield"
                  value={formData.default_yield}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.1"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Prix (EUR/kg)</label>
                <input
                  type="number"
                  name="default_price"
                  value={formData.default_price}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Charges Operationnelles</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Engrais (EUR/ha)</label>
                <input
                  type="number"
                  name="fertilizer_cost"
                  value={formData.fertilizer_cost}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Bioagresseurs (EUR/ha)</label>
                <input
                  type="number"
                  name="bioagressor_intrants_cost"
                  value={formData.bioagressor_intrants_cost}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Autres intrants (EUR/ha)</label>
                <input
                  type="number"
                  name="other_intrants_cost"
                  value={formData.other_intrants_cost}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Main-d'oeuvre (EUR/ha)</label>
                <input
                  type="number"
                  name="labor_cost"
                  value={formData.labor_cost}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Charges de Structure</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Mecanisation (EUR/ha)</label>
                <input
                  type="number"
                  name="mechanization_cost"
                  value={formData.mechanization_cost}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Batiment (EUR/ha)</label>
                <input
                  type="number"
                  name="building_cost"
                  value={formData.building_cost}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Assurances (EUR/ha)</label>
                <input
                  type="number"
                  name="insurance_cost"
                  value={formData.insurance_cost}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Frais divers (EUR/ha)</label>
                <input
                  type="number"
                  name="miscellaneous_cost"
                  value={formData.miscellaneous_cost}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Charges Supletives</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Fermage (EUR/ha)</label>
                <input
                  type="number"
                  name="fermage_cost"
                  value={formData.fermage_cost}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Capital (EUR/ha)</label>
                <input
                  type="number"
                  name="capital_cost"
                  value={formData.capital_cost}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingCulture ? 'Mettre a jour' : 'Creer'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Annuler
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default CultureManagement
