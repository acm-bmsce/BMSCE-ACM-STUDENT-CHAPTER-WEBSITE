import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Index from "./pages/Index";

const App = () => (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
);

export default App;
