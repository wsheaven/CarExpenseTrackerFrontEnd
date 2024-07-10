import Register from "./components/Register.js";
import Login from "./components/Login.js";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.js";
import ViewExpenses from "./components/ViewExpenses.js";
import Unauthorized from "./components/Unauthorized.js";
import Missing from "./components/Missing.js";
import AddExpenses from "./components/AddExpenses.js";
import Home from "./components/Home.js";
import RequireAuth from "./components/RequireAuth.js";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="Login" element={<Login />} />
        <Route path="Register" element={<Register />} />
        <Route path="Unauthorized" element={<Unauthorized />} />

        <Route path="/" element={<Home />} />
        <Route element={<RequireAuth />}>
          <Route path="ViewExpenses" element={<ViewExpenses />} />
          <Route path="AddExpense" element={<AddExpenses />} />
        </Route>
        <Route path="Missing" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
