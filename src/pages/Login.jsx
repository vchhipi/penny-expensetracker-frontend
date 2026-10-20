// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { login } from "../api/auth";
// import { SetupButton } from "../components/ui";

// export default function Login({ onSignedIn }) {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [busy, setBusy] = useState(false);

//   const submit = async (event) => {
//     event.preventDefault();
//     setError("");
//     setBusy(true);
//     try {
//       await login(email.trim(), password);
//       await onSignedIn();
//       navigate("/", { replace: true });
//     } catch (err) {
//       setError(err.response?.data?.message || "Could not sign in. Check your details and try again.");
//     } finally {
//       setBusy(false);
//     }
//   };

//   return (
//     <div className="setup-shell setup-step-0">
//       <header className="setup-header">
//         <div className="setup-brand">penny</div>
//       </header>
//       <main className="setup-main">
//         <section className="setup-screen">
//           <div className="setup-title-block">
//             <p className="setup-eyebrow">ACCESS.SYSTEM</p>
//             <h1>
//               SIGN IN
//               <br />
//               <em>TO CONTINUE.</em>
//             </h1>
//           </div>

//           <form className="subscription-form" onSubmit={submit} style={{ marginTop: 32, maxWidth: 440 }}>
//             <div className="form-grid">
//               <label className="field wide">
//                 <span>Email</span>
//                 <input
//                   type="email"
//                   required
//                   autoComplete="email"
//                   value={email}
//                   onChange={(event) => setEmail(event.target.value)}
//                 />
//               </label>
//               <label className="field wide">
//                 <span>Password</span>
//                 <input
//                   type="password"
//                   required
//                   autoComplete="current-password"
//                   value={password}
//                   onChange={(event) => setPassword(event.target.value)}
//                 />
//               </label>
//             </div>
//             {error && <p className="form-error" role="alert">{error}</p>}
//             <div className="form-actions">
//               <SetupButton type="submit" disabled={busy}>
//                 {busy ? "SIGNING IN…" : "SIGN IN →"}
//               </SetupButton>
//             </div>
//           </form>

//           <p className="setup-copy" style={{ marginTop: 28 }}>
//             New here? <Link to="/register">Create an account</Link>
//           </p>
//         </section>
//       </main>
//     </div>
//   );
// }

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";

export default function Login({ onSignedIn }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email.trim(), password);
      await onSignedIn();
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not sign in. Check your details and try again."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ex-auth">
      <header className="ex-auth-top">
        <span className="ex-brand">
          penny<span>.</span>
        </span>
      </header>

      <main className="ex-auth-main">
        <section className="ex-auth-card">
        <div className="setup-title-block">
          <h1>
            Sign in
            <em>to continue.</em>
          </h1>
          </div>

          <form className="ex-form" onSubmit={submit} noValidate>
            <label className="ex-field">
              <span>Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label className="ex-field">
              <span>Password</span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>

            {error && (
              <p className="ex-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="ex-primary ex-block" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="ex-aside">
            New here?{" "}
            <Link className="ex-link" to="/register">
              Create an account
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}