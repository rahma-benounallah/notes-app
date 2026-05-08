import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notes from "./pages/Notes";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Page login */}
        <Route path="/" element={<Login />} />

        {/* Page register */}
        <Route path="/register" element={<Register />} />

        {/* Page notes */}
        <Route path="/notes" element={<Notes />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
