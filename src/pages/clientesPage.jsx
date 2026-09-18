import { useEffect, useState } from "react";
import {
  createCliente,
  deleteCliente,
  getClientes,
  updateCliente,
} from "../service/clienteService";

const initialForm = {
  nome: "",
  email: "",
  telefone: "",
  cidade: "",
  estado: "",
};

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadClientes() {
    setLoading(true);
    setError("");
    try {
      const data = await getClientes();
      setClientes(Array.isArray(data) ? data : data.clientes || []);
    } catch {
      setError("Não foi possível carregar os clientes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    getClientes()
      .then((data) => {
        if (active) setClientes(Array.isArray(data) ? data : data.clientes || []);
      })
      .catch(() => {
        if (active) setError("Não foi possível carregar os clientes.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function startEditing(cliente) {
    setEditingId(cliente.id);
    setForm({
      nome: cliente.nome || "",
      email: cliente.email || "",
      telefone: cliente.telefone || "",
      cidade: cliente.cidade || "",
      estado: cliente.estado || "",
    });
    setError("");
  }

  function resetForm() {
    setEditingId(null);
    setForm(initialForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId !== null) await updateCliente(editingId, form);
      else await createCliente(form);
      resetForm();
      await loadClientes();
    } catch (submitError) {
      setError(submitError.message || "Não foi possível salvar o cliente.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Deseja excluir este cliente?")) return;
    try {
      await deleteCliente(id);
      setClientes(clientes.filter((cliente) => cliente.id !== id));
    } catch (deleteError) {
      setError(deleteError.message || "Não foi possível excluir o cliente.");
    }
  }

  return (
    <main className="products-page">
      <section className="content-grid">
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="section-title">
            <h2>{editingId === null ? "Novo cliente" : "Editar cliente"}</h2>
          </div>
          <label>Nome<input name="nome" value={form.nome} onChange={handleChange} required /></label>
          <label>E-mail<input name="email" type="email" value={form.email} onChange={handleChange} required /></label>
          <label>Telefone<input name="telefone" value={form.telefone} onChange={handleChange}  /></label>
          <div className="form-row">
            <label>Cidade<input name="cidade" value={form.cidade} onChange={handleChange}  /></label>
            <label>Estado<input name="estado" maxLength="2" value={form.estado} onChange={handleChange}  /></label>
          </div>
          <div className="form-actions">
            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? "Salvando..." : editingId === null ? "Adicionar cliente" : "Salvar alterações"}
            </button>
            {editingId !== null && <button className="secondary-button" type="button" onClick={resetForm}>Cancelar</button>}
          </div>
        </form>

        <section className="product-list" aria-labelledby="clients-list-title">
          <div className="section-title">
            <h2 id="clients-list-title">Clientes cadastrados</h2>
          </div>
          {error && <p className="error-message" role="alert">{error}</p>}
          {loading ? <p className="empty-state">Carregando clientes...</p> : clientes.length === 0 ? <p className="empty-state">Nenhum cliente cadastrado.</p> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Cliente</th><th>Contato</th><th><span className="sr-only">Ações</span></th></tr></thead>
                <tbody>{clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td><strong>{cliente.nome}</strong><small>{cliente.cidade || "Cidade não informada"} / {cliente.estado || "--"}</small></td>
                    <td><strong>{cliente.email || "Não informado"}</strong><small>{cliente.telefone || "Sem telefone"}</small></td>
                    <td className="actions"><button type="button" onClick={() => startEditing(cliente)}>Editar</button><button type="button" className="delete-button" onClick={() => handleDelete(cliente.id)}>Excluir</button></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}