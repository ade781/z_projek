import { BrowserRouter, Routes, Route } from "react-router-dom";
import NoteList from "./components/NoteList";
import AddNote from "./components/AddNote";
import EditNote from "./components/EditNote";
import Login from "./components/Loginn";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />


        <Route path="/add" element={<AddNote />} />
        <Route path="/edit/:id" element={<EditNote />} />

        <Route element={<Layout />}>
          <Route path="/note" element={<NoteList />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
