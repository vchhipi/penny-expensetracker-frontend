import { Outlet, useLocation } from "react-router-dom";
import BackIcon from "./BackIcon";
import HomeIcon from "./HomeIcon";

function AppChrome() {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <>
      {!isLanding && (
        <>
          <div className="fixed top-6 left-6 z-50">
            <BackIcon />
          </div>

          <div className="fixed top-6 right-6 z-50">
            <HomeIcon />
          </div>
        </>
      )}

      <Outlet />
    </>
  );
}

export default AppChrome;
