import { Outlet } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar";
import TopNavbar from "../components/navigation/TopNavbar";
import "./DashboardLayout.css";

export default function DashboardLayout() {
  return (
    <div className="pm-app">

      <Sidebar />

      <div className="pm-main">

        <TopNavbar />

        <main className="pm-content">

          <Outlet />

        </main>

      </div>

    </div>
  );
}