import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../features/auth/context/AuthContext";

import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">

      {/* Left Section */}

      <div className="navbar-left">

        <div className="navbar-logo">
          🤖 ConvoAI
        </div>

      </div>

      {/* Center Section */}

      <div className="navbar-center">

        <div className="search-box">

          <i className="bi bi-search"></i>

          <input
            type="text"
            placeholder="Search users or chats..."
          />

        </div>

      </div>

      {/* Right Section */}

      <div className="navbar-right">

        <button className="icon-btn">
          <i className="bi bi-bell"></i>
        </button>

        <div className="profile-info">

          <div className="profile-avatar">
            {user?.name
              ? user.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <span>
            {user?.name || "User"}
          </span>

        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right"></i>

          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;