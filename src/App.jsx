// import { useCallback, useEffect, useState } from "react";
// import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
// import Dashboard from "./pages/Dashboard";
// import SetupWizard from "./pages/SetupWizard";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import { fetchMe, hasToken, logout, saveSetup } from "./api/auth";
// import Landing from "./pages/Landing";

// export default function App() {
//   const navigate = useNavigate();
//   const [me, setMe] = useState(null);
//   const [checking, setChecking] = useState(true);

//   // Loads the signed-in user (name, onboarding flag, expense count).
//   const loadMe = useCallback(async () => {
//     if (!hasToken()) {
//       setMe(null);
//       setChecking(false);
//       return null;
//     }
//     try {
//       const data = await fetchMe();
//       setMe(data);
//       return data;
//     } catch {
//       setMe(null);
//       return null;
//     } finally {
//       setChecking(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadMe();
//   }, [loadMe]);

//   const handleLogout = () => {
//     logout();
//     setMe(null);
//     navigate("/login", { replace: true });
//   };

//   const handleSetupComplete = async (setup) => {
//     try {
//       await saveSetup(setup);
//     } catch (err) {
//       alert(err.response?.data?.message || "Could not save your setup. Please try again.");
//       return;
//     }
//     await loadMe();
//     navigate("/dashboard", { replace: true });
//   };

//   if (checking) {
//     return (
//       <div className="setup-shell setup-step-0">
//         <main className="setup-main">
//           <p className="setup-copy">Loading…</p>
//         </main>
//       </div>
//     );
//   }

//   const signedIn = Boolean(me);

//   return (
//     <Routes>
//        <Route path="/" element={signedIn ? <Navigate to="/dashboard" replace /> : <Landing />} />
//       {/* <Route path="/" element={<Navigate to={signedIn ? "/dashboard" : "/login"} replace />} /> */}
//       <Route path="/login" element={<Login onSignedIn={loadMe} />} />
//       <Route path="/register" element={<Register onSignedIn={loadMe} />} />

//       <Route
//         path="/setup"
//         element={
//           !signedIn ? (
//             <Navigate to="/login" replace />
//           ) : me.onboarded ? (
//             <Navigate to="/dashboard" replace />
//           ) : (
//             <SetupWizard onComplete={handleSetupComplete} />
//           )
//         }
//       />

//       <Route
//         path="/dashboard"
//         element={
//           !signedIn ? (
//             <Navigate to="/login" replace />
//           ) : !me.onboarded ? (
//             <Navigate to="/setup" replace />
//           ) : (
//             <Dashboard me={me} onLogout={handleLogout} />
//           )
//         }
//       />

//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }


// import { useCallback, useEffect, useState } from "react";
// import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
// import Dashboard from "./pages/Dashboard";
// import SetupWizard from "./pages/SetupWizard";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Landing from "./pages/Landing";
// import { fetchMe, hasToken, logout, saveSetup } from "./api/auth";

// export default function App() {
//   const navigate = useNavigate();
//   const [me, setMe] = useState(null);
//   const [checking, setChecking] = useState(true);

//   // Loads the signed-in user (name, onboarding flag, expense count).
//   const loadMe = useCallback(async () => {
//     if (!hasToken()) {
//       setMe(null);
//       setChecking(false);
//       return null;
//     }
//     try {
//       const data = await fetchMe();
//       setMe(data);
//       return data;
//     } catch {
//       setMe(null);
//       return null;
//     } finally {
//       setChecking(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadMe();
//   }, [loadMe]);

//   const handleLogout = () => {
//     logout();
//     setMe(null);
//     navigate("/login", { replace: true });
//   };

//   const handleSetupComplete = async (setup) => {
//     try {
//       await saveSetup(setup);
//     } catch (err) {
//       alert(err.response?.data?.message || "Could not save your setup. Please try again.");
//       return;
//     }
//     await loadMe();
//     navigate("/dashboard", { replace: true });
//   };

//   if (checking) {
//     return (
//       <div className="setup-shell setup-step-0">
//         <main className="setup-main">
//           <p className="setup-copy">Loading…</p>
//         </main>
//       </div>
//     );
//   }

//   const signedIn = Boolean(me);

//   return (
//     <Routes>
//       <Route path="/" element={signedIn ? <Navigate to="/dashboard" replace /> : <Landing />} />
//       <Route path="/login" element={<Login onSignedIn={loadMe} />} />
//       <Route path="/register" element={<Register onSignedIn={loadMe} />} />

//       <Route
//         path="/setup"
//         element={
//           !signedIn ? (
//             <Navigate to="/login" replace />
//           ) : me.onboarded ? (
//             <Navigate to="/dashboard" replace />
//           ) : (
//             <SetupWizard onComplete={handleSetupComplete} />
//           )
//         }
//       />

//       <Route
//         path="/dashboard"
//         element={
//           !signedIn ? (
//             <Navigate to="/login" replace />
//           ) : !me.onboarded ? (
//             <Navigate to="/setup" replace />
//           ) : (
//             <Dashboard me={me} onLogout={handleLogout} />
//           )
//         }
//       />
        
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }


import { useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SetupWizard from "./pages/SetupWizard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import Settings from "./pages/Settings";
import { fetchMe, hasToken, logout, saveSetup } from "./api/auth";

export default function App() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [checking, setChecking] = useState(true);

  // Loads the signed-in user (name, onboarding flag, expense count).
  const loadMe = useCallback(async () => {
    if (!hasToken()) {
      setMe(null);
      setChecking(false);
      return null;
    }
    try {
      const data = await fetchMe();
      setMe(data);
      return data;
    } catch {
      setMe(null);
      return null;
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  const handleLogout = () => {
    logout();
    setMe(null);
    navigate("/login", { replace: true });
  };

  const handleSetupComplete = async (setup) => {
    try {
      await saveSetup(setup);
    } catch (err) {
      alert(err.response?.data?.message || "Could not save your setup. Please try again.");
      return;
    }
    await loadMe();
    navigate("/dashboard", { replace: true });
  };

  if (checking) {
    return (
      <div className="setup-shell setup-step-0">
        <main className="setup-main">
          <p className="setup-copy">Loading…</p>
        </main>
      </div>
    );
  }

  const signedIn = Boolean(me);

  return (
    <Routes>
      <Route path="/" element={signedIn ? <Navigate to="/dashboard" replace /> : <Landing />} />
      <Route path="/login" element={<Login onSignedIn={loadMe} />} />
      <Route path="/register" element={<Register onSignedIn={loadMe} />} />

      <Route
        path="/setup"
        element={
          !signedIn ? (
            <Navigate to="/login" replace />
          ) : me.onboarded ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <SetupWizard onComplete={handleSetupComplete} />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          !signedIn ? (
            <Navigate to="/login" replace />
          ) : !me.onboarded ? (
            <Navigate to="/setup" replace />
          ) : (
            <Dashboard me={me} onLogout={handleLogout} />
          )
        }
      />

      <Route
        path="/settings"
        element={
          !signedIn ? (
            <Navigate to="/login" replace />
          ) : !me.onboarded ? (
            <Navigate to="/setup" replace />
          ) : (
            <Settings me={me} onProfileSaved={loadMe} onLogout={handleLogout} />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}