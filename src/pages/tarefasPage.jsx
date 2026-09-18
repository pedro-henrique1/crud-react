import { useEffect, useState } from "react";
import {
  createTarefa,
  deleteTarefa,
  getTarefas,
  updateTarefa,
} from "../service/tarefaService";

const initialForm = {
  titulo: "",
  descricao: "",
  status: "pendente",
  prioridade: "baixa",
  dataLimite: "",
};

const statusLabels = {
  pendente: "Pendente",
  em_andamento: "Em andamento",
  concluida: "Concluída",
};

const priorityLabels = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

export default function TarefasPage() {
  const [tarefas, setTarefas] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadTarefas() {
    setLoading(true);
    setError("");
    try {
      const data = await getTarefas();
      setTarefas(Array.isArray(data) ? data : data.tarefas || []);
    } catch (loadError) {
      setError(loadError.message || "Não foi possível carregar as tarefas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    getTarefas()
      .then((data) => {
        if (active) setTarefas(Array.isArray(data) ? data : data.tarefas || []);
      })
      .catch((loadError) => {
        if (active)
          setError(
            loadError.message || "Não foi possível carregar as tarefas.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function startEditing(tarefa) {
    setEditingId(tarefa.id);
    setForm({
      titulo: tarefa.titulo || "",
      descricao: tarefa.descricao || "",
      status: tarefa.status || "pendente",
      prioridade: tarefa.prioridade || "baixa",
      dataLimite: tarefa.dataLimite ? tarefa.dataLimite.slice(0, 10) : "",
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
      if (editingId !== null) await updateTarefa(editingId, form);
      else await createTarefa(form);
      resetForm();
      await loadTarefas();
    } catch (submitError) {
      setError(submitError.message || "Não foi possível salvar a tarefa.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Deseja excluir esta tarefa?")) return;
    try {
      await deleteTarefa(id);
      setTarefas(tarefas.filter((tarefa) => tarefa.id !== id));
    } catch (deleteError) {
      setError(deleteError.message || "Não foi possível excluir a tarefa.");
    }
  }

  return (
    <main className="products-page">
      <section className="content-grid">
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="section-title">
            <h2>{editingId === null ? "Nova tarefa" : "Editar tarefa"}</h2>
          </div>
          <label>
            Título
            <input
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Descrição
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              rows="4"
              required
            />
          </label>
          <div className="form-row">
            <label>
              Status
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="pendente">Pendente</option>
                <option value="em_andamento">Em andamento</option>
                <option value="concluida">Concluída</option>
              </select>
            </label>
            <label>
              Prioridade
              <select
                name="prioridade"
                value={form.prioridade}
                onChange={handleChange}
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </label>
          </div>
          <label>
            Data limite
            <input
              name="dataLimite"
              type="date"
              value={form.dataLimite}
              onChange={handleChange}
              required
            />
          </label>
          <div className="form-actions">
            <button className="primary-button" type="submit" disabled={saving}>
              {saving
                ? "Salvando..."
                : editingId === null
                  ? "Adicionar tarefa"
                  : "Salvar alterações"}
            </button>
            {editingId !== null && (
              <button
                className="secondary-button"
                type="button"
                onClick={resetForm}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <section className="product-list" aria-labelledby="tasks-list-title">
          <div className="section-title">
            <h2 id="tasks-list-title">Tarefas cadastradas</h2>
          </div>
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
          {loading ? (
            <p className="empty-state">Carregando tarefas...</p>
          ) : tarefas.length === 0 ? (
            <p className="empty-state">Nenhuma tarefa cadastrada.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Tarefa</th>
                    <th>Status</th>
                    <th>Prioridade</th>
                    <th>Prazo</th>
                    <th>
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tarefas.map((tarefa) => (
                    <tr key={tarefa.id}>
                      <td>
                        <strong>{tarefa.titulo}</strong>
                        <small>{tarefa.descricao || "Sem descrição"}</small>
                      </td>
                      <td>
                        <span className={`task-status status-${tarefa.status}`}>
                          {statusLabels[tarefa.status] || tarefa.status}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`task-priority priority-${tarefa.prioridade}`}
                        >
                          {priorityLabels[tarefa.prioridade] ||
                            tarefa.prioridade}
                        </span>
                      </td>
                      <td className="deadline">
                        {tarefa.dataLimite
                          ? new Date(
                              `${tarefa.dataLimite}T00:00:00`,
                            ).toLocaleDateString("pt-BR")
                          : "Sem prazo"}
                      </td>
                      <td className="actions">
                        <button
                          type="button"
                          onClick={() => startEditing(tarefa)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="delete-button"
                          onClick={() => handleDelete(tarefa.id)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
