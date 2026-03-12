import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import TrackLocation from "./user/TrackLocation";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Home />} />

        {/* user location page */}
        <Route path="/track/:id" element={<TrackLocation />} />

      </Routes>

    </BrowserRouter>
  )
}

export default App