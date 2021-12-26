import type { Component } from "solid-js";
import { Routes, Route, Link } from "solid-app-router";
import { Home } from "./Home";
import { About } from "./About";

const App: Component = () => {
  return (
    <>
      <nav className="flex flex-col items-center">
        <Link href="/" className="bg-white text-blue mt-5 text-lg px-2">
          Home
        </Link>
        <Link href="/about" className="bg-white text-blue mt-2 text-lg px-2">
          About
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
};

export default App;
