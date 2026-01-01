// import { useState } from "react";
// import { Link } from "react-router-dom";
// function Register() {
//         const [name, setName] = useState("");
//       const [email, setEmail] = useState("");
//       const [password, setPassword] = useState("");
//       const [error, setError] = useState("");
//         const [loading, setLoading] = useState(false);

//     return (
//       <section className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
//         <div className="w-full max-w-md rounded-3xl bg-white/70 backdrop-blur-xl shadow-xl border border-white/40 p-8">
          
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h2 className="text-2xl font-semibold text-gray-900 mb-2">
//               Create an account
//             </h2>
//             <p className="text-gray-600 text-sm">
//               Start managing your expenses in one place
//             </p>
//           </div>
  
//           {/* Form */}
//           <form className="space-y-5">
//           <Input
//   label="Name"
//   type="text"
//   placeholder="Your name"
//   value={name}
//   onChange={(e) => setName(e.target.value)}
// />

// <Input
//   label="Email"
//   type="email"
//   placeholder="you@example.com"
//   value={email}
//   onChange={(e) => setEmail(e.target.value)}
// />

// <Input
//   label="Password"
//   type="password"
//   placeholder="••••••••"
//   value={password}
//   onChange={(e) => setPassword(e.target.value)}
// />

  
// <button
//   type="button"
//   disabled={loading}
//   onClick={() => {
//     if (!name || !email || !password) {
//       setError("Please fill all fields");
//       return;
//     }

//     setError("");
//     setLoading(true);

//     // fake API call
//     setTimeout(() => {
//       setLoading(false);
//       setError("Email already exists");
//     }, 1500);
//   }}
//   className="w-full py-3 rounded-xl bg-gray-900 text-white font-medium transition disabled:opacity-60"
// >
//   {loading ? "Creating account..." : "Create Account"}
// </button>

//           </form>
  
//           {error && (
//   <p className="text-sm text-red-500 mt-4 text-center">
//     {error}
//   </p>
// )}
//           {/* Footer */}
//           <p className="text-sm text-gray-500 text-center mt-6">
//             Already have an account?{" "}
//             <Link
//               to="/login"
//               className="text-gray-900 font-medium hover:underline"
//             >
//               Login
//             </Link>

//           </p>
//         </div>
//       </section>
//     );
//   }
  
//   function Input({ label, type, placeholder, value, onChange }) {
//     return (
//       <div className="space-y-1">
//         <label className="block text-sm text-gray-600 mb-1">
//           {label}
//         </label>
//         <input
//           type={type}
//           placeholder={placeholder}
//           value={value}
//           onChange={onChange}
//           className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
//         />
//       </div>
//     );
//   }

  
 // export default Register;
  


 import { useState } from "react";
 import { useNavigate, Link } from "react-router-dom";
 import { useAuth } from "../../context/AuthContext";
 import api from "../../api";
 import toast from "react-hot-toast";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

 const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/register", {
        name,
        email,
        password,
      });

      toast.success("Account created successfully 🎉");

      // optional: auto login UX
      login();
      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
    <div className="relative bg-white p-8 rounded-2xl shadow-md w-96">
      
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
               Create an account
             </h2>
             <p className="text-gray-600 text-sm">
               Start managing your expenses in one place
             </p>
           </div>

           {/* form */}
           <form
        onSubmit={handleSubmit} >
        <input
          type="text"
          placeholder="Name"
          className="w-full mb-4 p-3 border rounded-lg"
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded-lg"
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 border rounded-lg"
          required
        />

        <button
          type="submit"
          className="w-full bg-gray-900 text-white py-3 rounded-xl"
        >
          Register
        </button>
      </form>



        {/* Footer */}
        <p className="text-sm text-gray-500 text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-gray-900 font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </section>
  
  );
}

export default Register;
