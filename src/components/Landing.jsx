import { Link } from "react-router-dom";
import TiltedCards from "./TiltedCards";
import DemoDashboard from "./DemoDashboard";

function Landing() {
  return (
    <>
    {/* ================= NAVBAR ================= */}
<header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md">
  <div className="max-w-full mx-auto px-6 h-16 flex items-center justify-between">
    
    {/* Logo / Brand */}
    <div className="text-2xl font-normal text-gray-500 cursor-pointer">
      Expensify
    </div>

    {/* Actions */}
    <div className="flex items-center gap-4">
    <Link
    to="/login"
    className="text-gray-600 hover:text-gray-900 transition"
  >
    Login →
  </Link>

  <Link
    to="/register"
    className="inline-block px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
  >
    Get Started
  </Link>


    </div>
  </div>
</header>
      {/* ================= HERO SECTION ================= */}
      <section className="min-h-[65vh] flex items-center justify-center">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 ">
          
          {/* Left: Text */}
          <div>
            <h1 className="text-7xl font-normal tracking-tight  text-gray-900 leading-[1.05] mt-40 -translate-x-10">
              Streamline <br/>How <br/>You Spend
            </h1>

            <p className="text-lg text-gray-500 max-w-md  mt-2  -translate-x-10">
              Manage daily and monthly expenses effortlessly with clarity and control.
            </p>

          
          </div>

          {/* Right: Tilted cards */}
          <div className="flex justify-center md:justify-end md:pl-12 mt-30">
            <TiltedCards />
          </div>
        </div>
      </section>

      {/* ================= SOFT DIVIDER ================= */}
      <div className="flex justify-center my-24">
        <div className="h-0.5 w-56 bg-gray-300" />
      </div>

      {/* ================= DEMO DASHBOARD (GLASS) ================= */}
      <section className="pb-40">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Demo text OUTSIDE glass */}
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">
              Demo Dashboard Preview
            </p>
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">
              Manage Your Expenses Visually
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              A quick look at how your dashboard appears after login.
            </p>
          </div>

          {/* Glass Container */}
          <div className="relative rounded-3xl border border-white/10 bg-white/60 backdrop-blur-xl shadow-xl p-0">
            
            {/* Optional subtle glow */}
            <div className="absolute inset-0 bottom-6 flex items-end justify-center  z-20  pointer-events-none">
  <span className="text-sm text-black px-4 py-2 rounded-full shadow-md border border-gray-200 ">
    Login to unlock full dashboard
  </span>
</div>

            {/* Demo dashboard inside */}
            <div
              className="relative -mt-2"
              style={{
                transform: "scale(0.9)",
                opacity: 0.9,
              }}
            >
              <DemoDashboard />
            </div>

            {/* Bottom fade (preview hint) */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent rounded-b-3xl" />
          </div>
        </div>
      </section>
    </>
  );
}

export default Landing;
