const API_URL = "/api";


export async function getProdutos() {
  try {
    const response = await fetch(`${API_URL}/produtos`);
    if (!response.ok) {
      throw new Error("Erro ao buscar produtos");
    }
    return  await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createProduto(produto) {
  try {
    const response = await fetch(`${API_URL}/produtos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(produto),
    });
    if (!response.ok) {
      const details = await response.text();
      throw new Error(details || "Erro ao criar produto");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateProduto(id, produto) {
  try {
    const response = await fetch(`${API_URL}/produtos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(produto),
    });
    if (!response.ok) {
      const details = await response.text();
      throw new Error(details || "Erro ao atualizar produto");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteProduto(id) {
  try {
    const response = await fetch(`${API_URL}/produtos/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Erro ao deletar produto");
    }
    if (response.status === 204) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
} 