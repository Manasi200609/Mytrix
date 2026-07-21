import "./TopNavbar.css";
import { Search, Bell, Sparkles } from "lucide-react";

export default function TopNavbar() {
  return (
    <header className="pm-topbar">

      <div className="pm-topbar-center">

        <div className="pm-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search files, functions, dependencies..."
          />

        </div>

      </div>

      <div className="pm-topbar-right">

        <button className="pm-ai-btn">

          <Sparkles size={18} />

          AI Ready

        </button>

        <button className="pm-icon-btn">

          <Bell size={19} />

        </button>

        <div className="pm-avatar">

          PM

        </div>

      </div>

    </header>
  );
}