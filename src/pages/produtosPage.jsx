import { useEffect, useState } from "react";
import {
  createProduto,
  deleteProduto,
  getProdutos,
  updateProduto,
} from "../service/produtoService";

const initialForm = {
  nome: "",
  descricao: "",
  preco: "",
  quantidadeEstoque: 0,
  categoria: "",
  marca: "",
  cor: "",
  peso: 0,
  altura: 0,
  largura: 0,
  profundidade: 0,
  codigoBarras: "",
  fabricante: "",
  ativo: true,
};

const numericFields = [
  "preco",
  "quantidadeEstoque",
  "peso",
  "altura",
  "largura",
  "profundidade",
];

function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadProdutos() {
    setLoading(true);
    setError("");
    try {
      const data = await getProdutos();
      setProdutos(Array.isArray(data) ? data : data.produtos || []);
    } catch {
      setError("Não foi possível carregar os produtos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    getProdutos()
      .then((data) => {
        if (active)
          setProdutos(Array.isArray(data) ? data : data.produtos || []);
      })
      .catch(() => {
        if (active) setError("Não foi possível carregar os produtos.");
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

  function startEditing(produto) {
    setEditingId(produto.id);
    setForm({
      nome: produto.nome || "",
      descricao: produto.descricao || "",
      preco: produto.preco ?? "",
      quantidadeEstoque: produto.quantidadeEstoque ?? 0,
      categoria: produto.categoria || "",
      marca: produto.marca || "",
      cor: produto.cor || "",
      peso: produto.peso ?? 0,
      altura: produto.altura ?? 0,
      largura: produto.largura ?? 0,
      profundidade: produto.profundidade ?? 0,
      codigoBarras: produto.codigoBarras || "",
      fabricante: produto.fabricante || "",
      ativo: produto.ativo ?? true,
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
    const produto = { ...form };
    numericFields.forEach((field) => {
      produto[field] = form[field] === "" ? null : Number(form[field]);
    });
    try {
      if (editingId !== null) await updateProduto(editingId, produto);
      else await createProduto(produto);
      resetForm();
      await loadProdutos();
    } catch (error) {
      setError(error.message || "Não foi possível salvar o produto.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Deseja excluir este produto?")) return;
    try {
      await deleteProduto(id);
      setProdutos(produtos.filter((produto) => produto.id !== id));
    } catch {
      setError("Não foi possível excluir o produto.");
    }
  }

  return (
    <main className="products-page">
      <section className="content-grid">
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="section-title">
            
            <h2>{editingId === null ? "Novo produto" : "Editar produto"}</h2>
          </div>
          <label>
            Nome
            <input
              name="nome"
              value={form.nome}
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
            />
          </label>
          <label>
            Preço (R$)
            <input
              name="preco"
              type="number"
              min="0"
              step="0.01"
              value={form.preco}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Quantidade em estoque
            <input
              name="quantidadeEstoque"
              type="number"
              min="0"
              value={form.quantidadeEstoque}
              onChange={handleChange}
              required
            />
          </label>
          <div className="form-row">
            <label>
              Categoria
              <input
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
              />
            </label>
            <label>
              Marca
              <input name="marca" value={form.marca} onChange={handleChange} />
            </label>
          </div>
          <div className="form-row">
            <label>
              Cor
              <input name="cor" value={form.cor} onChange={handleChange} />
            </label>
            <label>
              Fabricante
              <input
                name="fabricante"
                value={form.fabricante}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="form-row form-row--three">
            <label>
              Peso
              <input
                name="peso"
                type="number"
                min="0"
                step="0.01"
                value={form.peso}
                onChange={handleChange}
              />
            </label>
            <label>
              Altura
              <input
                name="altura"
                type="number"
                min="0"
                step="0.01"
                value={form.altura}
                onChange={handleChange}
              />
            </label>
            <label>
              Largura
              <input
                name="largura"
                type="number"
                min="0"
                step="0.01"
                value={form.largura}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Profundidade
              <input
                name="profundidade"
                type="number"
                min="0"
                step="0.01"
                value={form.profundidade}
                onChange={handleChange}
              />
            </label>
            <label>
              Código de barras
              <input
                name="codigoBarras"
                value={form.codigoBarras}
                onChange={handleChange}
              />
            </label>
          </div>
          <label className="checkbox-label">
            <input
              name="ativo"
              type="checkbox"
              checked={form.ativo}
              onChange={(event) =>
                setForm({ ...form, ativo: event.target.checked })
              }
            />
            Produto ativo
          </label>
          <div className="form-actions">
            <button className="primary-button" type="submit" disabled={saving}>
              {saving
                ? "Salvando..."
                : editingId === null
                  ? "Adicionar produto"
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

        <section className="product-list" aria-labelledby="list-title">
          <div className="section-title">
            <h2 id="list-title">Produtos cadastrados</h2>
          </div>
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
          {loading ? (
            <p className="empty-state">Carregando produtos...</p>
          ) : produtos.length === 0 ? (
            <p className="empty-state">Nenhum produto cadastrado.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Preço</th>
                    <th>
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map((produto) => (
                    <tr key={produto.id}>
                      <td>
                        <strong>{produto.nome}</strong>
                        <small>{produto.descricao || "Sem descrição"}</small>
                      </td>
                      <td className="price">
                        R${" "}
                        {Number(produto.preco || 0)
                          .toFixed(2)
                          .replace(".", ",")}
                      </td>
                      <td className="actions">
                        <button
                          type="button"
                          onClick={() => startEditing(produto)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="delete-button"
                          onClick={() => handleDelete(produto.id)}
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

export default ProdutosPage;
