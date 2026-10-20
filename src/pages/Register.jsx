// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { login, register } from "../api/auth";
// import { SetupButton } from "../components/ui";

// export default function Register({ onSignedIn }) {
//   const navigate = useNavigate();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [busy, setBusy] = useState(false);

//   const submit = async (event) => {
//     event.preventDefault();
//     setError("");

//     if (password.length < 8) {
//       setError("Use at least 8 characters for your password.");
//       return;
//     }

//     setBusy(true);
//     try {
//       await register(name.trim(), email.trim(), password);
//       // Sign in straight away, so a new user goes on to the setup wizard.
//       await login(email.trim(), password);
//       await onSignedIn();
//       navigate("/", { replace: true });
//     } catch (err) {
//       setError(err.response?.data?.message || "Could not create your account. Please try again.");
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
//             <p className="setup-eyebrow">NEW.ACCOUNT</p>
//             <h1>
//               CREATE YOUR
//               <br />
//               <em>ACCOUNT.</em>
//             </h1>
//           </div>

//           <form className="subscription-form" onSubmit={submit} style={{ marginTop: 32, maxWidth: 440 }}>
//             <div className="form-grid">
//               <label className="field wide">
//                 <span>Name</span>
//                 <input
//                   required
//                   autoComplete="name"
//                   value={name}
//                   onChange={(event) => setName(event.target.value)}
//                 />
//               </label>
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
//                 <span>Password (8+ characters)</span>
//                 <input
//                   type="password"
//                   required
//                   minLength={8}
//                   autoComplete="new-password"
//                   value={password}
//                   onChange={(event) => setPassword(event.target.value)}
//                 />
//               </label>
//             </div>
//             {error && <p className="form-error" role="alert">{error}</p>}
//             <div className="form-actions">
//               <SetupButton type="submit" disabled={busy}>
//                 {busy ? "CREATING…" : "CREATE ACCOUNT →"}
//               </SetupButton>
//             </div>
//           </form>

//           <p className="setup-copy" style={{ marginTop: 28 }}>
//             Already have an account? <Link to="/login">Sign in</Link>
//           </p>
//         </section>
//       </main>
//     </div>
//   );
// }



import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, register } from "../api/auth";

export default function Register({ onSignedIn }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }

    setBusy(true);
    try {
      await register(name.trim(), email.trim(), password);
      // Sign in straight away, so a new user goes on to the setup wizard.
      await login(email.trim(), password);
      await onSignedIn();
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not create your account. Please try again."
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
            Create your 
            <em>account </em>
          </h1>
        </div>
          <form className="ex-form" onSubmit={submit} noValidate>
            <label className="ex-field">
              <span>Name</span>
              <input
                required
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>

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
              <span>Password (8+ characters)</span>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
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
              {busy ? "Creating…" : "Create account"}
            </button>
          </form>

          <p className="ex-aside">
            Already have an account?{" "}
            <Link className="ex-link" to="/login">
              Sign in
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}