import { NavLink, useParams } from "react-router-dom";
import "./Sidebar.css";
import {
  LayoutDashboard,
  GitBranch,
  BrainCircuit,
  FolderArchive,
} from "lucide-react";
import logo from "../../assets/logo.png";

export default function Sidebar() {
  const { projectId } = useParams();
  const rootPath = projectId ? `/dashboard/${projectId}` : "/analyze";
  const links = [
    {
      name: "Overview",
      path: rootPath,
      icon: LayoutDashboard,
      end: true,
    },
    {
      name: "Knowledge Graph",
      path: `${rootPath}/knowledge-graph`,
      icon: GitBranch,
    },
    {
      name: "Project Mentor",
      path: `${rootPath}/mentor`,
      icon: BrainCircuit,
    },
    {
      name: "Saved Projects",
      path: `${rootPath}/saved-projects`,
      icon: FolderArchive,
    },
  ];

  return (
    <aside className="pm-sidebar">

      <div className="pm-logo">

        <img
  src={logo}
  alt="Mytrix Logo"
  className="pm-logo-img"
/>

        <div>
          <h2>Mytrix</h2>
          <span>Repository Intelligence</span>
        </div>

      </div>

      <nav className="pm-nav">

        {links.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                isActive
                  ? "pm-nav-item active"
                  : "pm-nav-item"
              }
            >
              <Icon size={19} />

              <span>{item.name}</span>
            </NavLink>
          );
        })}

      </nav>

    </aside>
  );
}