import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Solicitar from "./pages/Solicitar";
import CadastroUsuario from "./pages/CadastroUsuario";
import Consultar from "./pages/Consultar";
import Base from "./pages/Base";
import Recebidos from "./pages/Recebidos";
import Fiscal from "./pages/Fiscal";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/solicitar" element={<Solicitar />} />
        <Route path="/consultar" element={<Consultar />} />
        <Route path="/admin/cadastrar" element={<CadastroUsuario />} />
                <Route path="/base" element={<Base />} />
                <Route path="/base" element={<Base />} />
                <Route path="/recebidos" element={<Recebidos />} />
                <Route path="/recebidos" element={<Recebidos />} />
                <Route path="/fiscal" element={<Fiscal />} />

      </Routes>
    </Router>
  );
}

export default App;
