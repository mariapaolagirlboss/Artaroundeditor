import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom' // Per tornare indietro

const LUNGHEZZE = ['3s', '15s', '40s', '1min', '4min']
const LINGUAGGI = ['infantile', 'elementare', 'medio', 'specialistico']

const formVuoto = {
    titolo: '', testo: '', opera: '', autore: '', stile: '',
    lunghezza: '15s', linguaggio: 'medio',
    autoreContenuto: '', licenza: 'CC-BY',
    prezzo: 0, museo: '', immagine: ''
}

// Definiamo l'URL base del server per evitare errori
const API_URL = 'http://localhost:3000/api/items'

function Item() {
    const navigate = useNavigate()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [mostraForm, setMostraForm] = useState(false)
    const [form, setForm] = useState(formVuoto)
    const [editId, setEditId] = useState(null)
    const [errore, setErrore] = useState('')

    // Caricamento dati
    const carica = () => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => { setItems(data); setLoading(false) })
            .catch(() => {
                setErrore('Impossibile connettersi al server.')
                setLoading(false)
            })
    }

    useEffect(() => { carica() }, [])

    const handleChange = e => {
        const { name, value } = e.target
        setForm(f => ({ ...f, [name]: value }))
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setErrore('')
        const url = editId ? `${API_URL}/${editId}` : API_URL
        const method = editId ? 'PUT' : 'POST'
        
        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            })
            if (!res.ok) {
                const err = await res.json()
                setErrore(err.error || 'Errore nel salvataggio')
                return
            }
            setForm(formVuoto)
            setEditId(null)
            setMostraForm(false)
            carica()
        } catch {
            setErrore('Errore di rete — il server è avviato?')
        }
    }

    const handleEdit = item => {
        setForm({ ...item })
        setEditId(item._id)
        setMostraForm(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDelete = async id => {
        if (!confirm('Eliminare questo item?')) return
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
            carica()
        } catch {
            alert("Errore durante l'eliminazione")
        }
    }

    if (loading) return <div className="page-container" style={{paddingTop: '100px'}}>Caricamento...</div>

    return (
        <div className="page-container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
            
            {/* TASTO TORNA INDIETRO */}
            <button 
                onClick={() => navigate('/')} 
                className="btn-secondary" 
                style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
                ← Torna al Menu
            </button>

            {/* HEADER */}
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '2rem', color: '#325a2d' }}>🎨 Gestione Item</h2>
                <button className="btn-primary" onClick={() => {
                    setMostraForm(!mostraForm)
                    setEditId(null)
                    setForm(formVuoto)
                }}>
                    {mostraForm ? '✕ Chiudi' : '+ Nuovo Item'}
                </button>
            </div>

            {/* FORM */}
            {mostraForm && (
                <form className="card form-card" onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', padding: '25px', borderRadius: '20px', marginBottom: '40px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ marginBottom: '20px' }}>{editId ? '✏️ Modifica Item' : '➕ Nuovo Item'}</h3>
                    {errore && <p className="errore" style={{ color: 'red', background: '#ffe6e6', padding: '10px', borderRadius: '8px' }}>{errore}</p>}

                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                        <label>Titolo *
                            <input name="titolo" value={form.titolo} onChange={handleChange} required style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }} />
                        </label>
                        <label>Museo *
                            <input name="museo" value={form.museo} onChange={handleChange} required style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }} />
                        </label>
                        <label>Lunghezza *
                            <select name="lunghezza" value={form.lunghezza} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}>
                                {LUNGHEZZE.map(l => <option key={l}>{l}</option>)}
                            </select>
                        </label>
                        <label>Linguaggio *
                            <select name="linguaggio" value={form.linguaggio} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}>
                                {LINGUAGGI.map(l => <option key={l}>{l}</option>)}
                            </select>
                        </label>
                        {/* Aggiungi qui gli altri campi se necessario */}
                    </div>

                    <label style={{marginTop: '1.5rem', display: 'block'}}>Testo *
                        <textarea name="testo" value={form.testo} onChange={handleChange} rows={5} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', marginTop: '5px' }} />
                    </label>

                    <div className="form-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                        <button type="submit" className="btn-primary" style={{ background: '#466e41', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>
                            {editId ? '💾 Salva modifiche' : '✅ Crea Item'}
                        </button>
                        <button type="button" className="btn-secondary" onClick={() => setMostraForm(false)} style={{ padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>
                            Annulla
                        </button>
                    </div>
                </form>
            )}

            {/* LISTA GRID */}
            {items.length === 0
                ? <p style={{color:'#888', textAlign: 'center', marginTop: '50px'}}>Nessun item ancora. Creane uno! 🎨</p>
                : (
                    <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {items.map(item => (
                            <div key={item._id} className="card" style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                                <div className="card-body" style={{ padding: '20px', flexGrow: 1 }}>
                                    <h3 style={{ marginBottom: '10px', fontFamily: 'Poppins' }}>{item.titolo}</h3>
                                    <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                                        <span style={{ background: '#eef2ed', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{item.lunghezza}</span>
                                        <span style={{ background: '#eef2ed', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{item.linguaggio}</span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: '#666' }}>{item.testo.substring(0, 100)}...</p>
                                </div>
                                <div className="card-actions" style={{ padding: '15px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                                    <button onClick={() => handleEdit(item)} style={{ background: 'none', border: 'none', color: '#466e41', cursor: 'pointer', fontWeight: 600 }}>✏️ Modifica</button>
                                    <button onClick={() => handleDelete(item._id)} style={{ background: 'none', border: 'none', color: '#d9534f', cursor: 'pointer', fontWeight: 600 }}>🗑️ Elimina</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    )
}

export default Item
