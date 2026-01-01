import { useNavigate } from "react-router-dom";

function BackIcon() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      aria-label="Go back"
      className="text-gray-500 hover:text-gray-900 transition text-xl"
    >
      ←
    </button>
  );
}

export default BackIcon;
