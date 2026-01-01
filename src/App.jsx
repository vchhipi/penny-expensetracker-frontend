// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import AppChrome from "./components/AppChrome";
// import Landing from "./components/Landing";
// import Login from "./components/auth/Login";
// import Register from "./components/auth/Register";
// import Dashboard from "./components/Dashboard";


// function App() {
//   return (
//     <Routes>
//       <Route element={<AppChrome />}>
//         <Route path="/" element={<Landing />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//       </Route>
//     </Routes>
//   );
// }


// export default App;

import { Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;



// import {  Routes, Route } from "react-router-dom";
// import AppChrome from "./components/AppChrome";
// import Landing from "./components/Landing";
// import Dashboard from "./components/Dashboard";

// function App() {
//   return (
    
//       <Routes>
//         <Route element={<AppChrome />}>
//           <Route path="/" element={<Landing />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//         </Route>
//       </Routes>
   
//   );
// }

// export default App;

