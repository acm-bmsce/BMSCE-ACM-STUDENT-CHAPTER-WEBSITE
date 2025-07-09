import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/About";

const App = () => (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<About />} />
        </Routes>
      </BrowserRouter>
);

export default App;
