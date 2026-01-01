// import { Link } from "react-router-dom";
// import { useState } from "react";
// function Login() {
//   const [email, setEmail] = useState("");
// const [password, setPassword] = useState("");
// const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);


//     return (
//       <section className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
//         <div className="w-full max-w-md rounded-3xl bg-white/70 backdrop-blur-xl shadow-xl border border-white/40 p-8">
          
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h2 className="text-2xl font-semibold text-gray-900 mb-2">
//               Welcome back
//             </h2>
//             <p className="text-gray-600 text-sm">
//               Login to continue tracking your expenses
//             </p>
//           </div>
  
//           {/* Form */}
//           <form className="space-y-5">
//           <Input
//           label="Email"
//           type="email"
//           placeholder="you@example.com"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <Input
//           label="Password"
//           type="password"
//           placeholder="••••••••"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

  
//         <button
//           type="button"
//           disabled={loading}
//           onClick={() => {
//             if (!email || !password) {
//               setError("Please enter email and password");
//               return;
//             }

//             setError("");
//             setLoading(true);

//             // fake API call
//             setTimeout(() => {
//               setLoading(false);
//               setError("Invalid email or password");
//             }, 1500);
//           }}
//           className="w-full py-3 rounded-xl bg-gray-900 text-white font-medium transition disabled:opacity-60"
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>


//           </form>
//           {error && (
//   <p className="text-sm text-red-500 mt-4 text-center">
//     {error}
//   </p>
// )}

  
//           {/* Footer */}
//           <p className="text-sm text-gray-500 text-center mt-6">
//             Don’t have an account?{" "}
//             <Link
//              to="/register"
//              className="text-gray-900 font-medium hover:underline"
//             >
//              Register
//             </Link>

//           </p>
//         </div>
//       </section>
//     );
//   }
  
//   function Input({ label, type, placeholder, value, onChange }) {
//     return (
//       <div>
//         <label className="block text-sm text-gray-600 mb-1">
//           {label}
//         </label>
//               <input
//         type={type}
//         placeholder={placeholder}
//         value={value}
//         onChange={onChange}
//         className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
//       />

//       </div>
//     );
//   }
  
//   export default Login;
  
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/login", {
        email,
        password,
      });

      // ✅ SAVE JWT
      localStorage.setItem("token", res.data.token);

      // ✅ REDIRECT
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
    <div className="w-full max-w-md rounded-3xl bg-white/70 backdrop-blur-xl shadow-xl border border-white/40 p-8">
      
        {/* ❌ Close */}
        <button
          onClick={() => navigate("/")}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition"
        >
          ✕
        </button>
         {/* Header */}
         <div className="text-center mb-8">
             <h2 className="text-2xl font-semibold text-gray-900 mb-2">
               Welcome back
             </h2>
            <p className="text-gray-600 text-sm">
              Login to continue tracking your expenses
             </p>
           </div>

           {error && (
          <p className="text-sm text-red-500 mb-4 text-center">
            {error}
          </p>
        )}

        <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-96"
      >
        {/* <h2 className="text-2xl font-semibold mb-6">Sign in</h2> */}

        
      

        
           
        <input
        label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border rounded-lg"
          required
        />

        <input
        label="Password"
          type="password"
          placeholder="..........."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 border rounded-lg"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white py-3 rounded-xl disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
       {/* Footer */}
        <p className="text-sm text-gray-500 text-center mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-gray-900 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
        </div>

    </section>
  );
}

export default Login;
