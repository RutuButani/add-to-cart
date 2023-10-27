import "./App.css";
import Header from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Import Routes from react-router-dom

import Home from "./components/Home";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="App">
        <Routes> {/* Wrap your Routes in a <Routes> element */}
          <Route path="/" element={<Home />} /> {/* Use element prop instead of children */}
          <Route path="/cart" element={<Cart />} /> {/* Use element prop instead of children */}
          <Route path="/cart/checkout" element={<Checkout />} /> {/* Use element prop instead of children */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
