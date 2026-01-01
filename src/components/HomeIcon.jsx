import { useNavigate } from "react-router-dom";

function HomeIcon() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      aria-label="Go to home"
      className="p-3  "
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#111827"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 10.5L12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
      </svg>
    </button>
  );
}

 export default HomeIcon;
// import { useNavigate } from "react-router-dom";

// function HomeIcon() {
//   const navigate = useNavigate();

//   return (
//     <button
//       onClick={() => navigate("/")}
//       aria-label="Go to home"
//       className="text-gray-500 hover:text-gray-900 transition text-2xl"
//     >
//       ⌂
//     </button>
//   );
// }

// export default HomeIcon;
