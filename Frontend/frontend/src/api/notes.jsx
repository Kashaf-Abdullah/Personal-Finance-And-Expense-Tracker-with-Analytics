const API = import.meta.env.VITE_API_URL;

export async function getNotes(token) {
  const res = await fetch(`${API}/api/notes`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function createNote(token, data) {
  const res = await fetch(`${API}/api/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateNote(token, id, data) {
  const res = await fetch(`${API}/api/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteNote(token, id) {
  const res = await fetch(`${API}/api/notes/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}
