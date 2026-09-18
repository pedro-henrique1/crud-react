import './App.css'
import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom'
import ProdutosPage from './pages/produtosPage'
import ClientesPage from './pages/clientesPage'
import TarefasPage from './pages/tarefasPage'

function App() {
  return (
    <BrowserRouter>
      <header className="app-nav">
        <NavLink className="brand" to="/produtos" aria-label="Início">
          <span className="brand-mark">C</span>
          <span>Controle</span>
        </NavLink>
        <nav className="main-menu" aria-label="Navegação principal">
          <Link className="menu-link" to="/produtos">
            Produtos
          </Link>
          <Link className="menu-link" to="/clientes">
            Clientes
          </Link>
          <Link className="menu-link" to="/tarefas">
            Tarefas
          </Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<ProdutosPage />} />
        <Route path="/produtos" element={<ProdutosPage />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/tarefas" element={<TarefasPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
