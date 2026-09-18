const API_URL = "/api";



export async function getClientes() {
  try {
    const response = await fetch(`${API_URL}/clientes`);
    if (!response.ok) {
      throw new Error("Erro ao buscar clientes");
    }
    return  await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createCliente(cliente) {
  try {
    const response = await fetch(`${API_URL}/clientes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cliente),
    });
    if (!response.ok) {
      const details = await response.text();
      throw new Error(details || "Erro ao criar cliente");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateCliente(id, cliente) {
  try {
    const response = await fetch(`${API_URL}/clientes/${id}`, {
      method: "PUT",  
    headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cliente),
    });
    if (!response.ok) {
      const details = await response.text();
      throw new Error(details || "Erro ao atualizar cliente");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteCliente(id) {
  try {
    const response = await fetch(`${API_URL}/clientes/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const details = await response.text();
      throw new Error(details || "Erro ao deletar cliente");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}