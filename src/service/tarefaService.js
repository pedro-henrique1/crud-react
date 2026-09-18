const API_URL = "/api";
 
export async function getTarefas() {
  try {
    const response = await fetch(`${API_URL}/tarefas`);
    if (!response.ok) {
      throw new Error("Erro ao buscar tarefas");
    }
    return  await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createTarefa(tarefa) {
  try {
    const response = await fetch(`${API_URL}/tarefas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tarefa),
    });
    if (!response.ok) {
      const details = await response.text();
      throw new Error(details || "Erro ao criar tarefa");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateTarefa(id, tarefa) {
  try {
    const response = await fetch(`${API_URL}/tarefas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tarefa),
    });
    if (!response.ok) {
      const details = await response.text();
      throw new Error(details || "Erro ao atualizar tarefa");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteTarefa(id) {
  try {
    const response = await fetch(`${API_URL}/tarefas/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const details = await response.text();
      throw new Error(details || "Erro ao deletar tarefa");
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

