import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Solicitar from "./pages/Solicitar";
import CadastroUsuario from "./pages/CadastroUsuario";
import Consultar from "./pages/Consultar";
import Base from "./pages/Base";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/solicitar" element={<Solicitar />} />
        <Route path="/consultar" element={<Consultar />} />
        <Route path="/admin/cadastrar" element={<CadastroUsuario />} />
                <Route path="/base" element={<Base />} />

      </Routes>
    </Router>
  );
}

export default App;
