let currentItems = [];
let editingId = null;

async function loadItems() {
    try {
        const museo = document.getElementById('museoFilter').value;
        const res = await fetch(`/api/items${museo ? '?museo=' + museo : ''}`);
        currentItems = await res.json();
        renderItems();
    } catch (err) {
        alert('Errore caricamento: ' + err);
    }
}

function renderItems() {
    const list = document.getElementById('itemList');
    list.innerHTML = currentItems.map(item => `
        <li>
            <strong>${item.operaId}</strong> - ${item.testo.substring(0, 50)}...
            <span>${item.linguaggio}, ${item.lunghezza}</span>
            <button onclick="editItem('${item._id}')">Edit</button>
            <button onclick="deleteItem('${item._id}')">Delete</button>
        </li>
    `).join('');
}

function newItem() {
    document.getElementById('itemForm').style.display = 'block';
    document.getElementById('itemForm').reset();
    editingId = null;
}

function editItem(id) {
    const item = currentItems.find(i => i._id === id);
    if (item) {
        document.getElementById('itemId').value = id;
        document.getElementById('operaId').value = item.operaId;
        document.getElementById('autoreId').value = item.autoreId || '';
        document.getElementById('stileId').value = item.stileId || '';
        document.getElementById('lunghezza').value = item.lunghezza;
        document.getElementById('linguaggio').value = item.linguaggio;
        document.getElementById('testo').value = item.testo;
        document.getElementById('licenza').value = item.licenza || '';
        document.getElementById('itemForm').style.display = 'block';
        editingId = id;
    }
}

function cancelEdit() {
    document.getElementById('itemForm').style.display = 'none';
}

async function deleteItem(id) {
    if (confirm('Confermi?')) {
        await fetch(`/api/items/${id}`, { method: 'DELETE' });
        loadItems();
    }
}

document.getElementById('itemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        operaId: document.getElementById('operaId').value,
        autoreId: document.getElementById('autoreId').value,
        stileId: document.getElementById('stileId').value,
        lunghezza: document.getElementById('lunghezza').value,
        linguaggio: document.getElementById('linguaggio').value,
        testo: document.getElementById('testo').value,
        licenza: document.getElementById('licenza').value
    };
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/items/${editingId}` : '/api/items';
    await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    cancelEdit();
    loadItems();
});

// Carica al load
loadItems();
