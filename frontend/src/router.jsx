import { createBrowserRouter } from "react-router-dom";

import SplashScreen from "./pages/SplashScreen";
import Landing from "./pages/Landing";
import Analyze from "./pages/Analyze";
import Dashboard from "./pages/Dashboard";
import KnowledgeGraph from "./pages/KnowledgeGraph";
import Mentor from "./pages/Mentor";
import SavedProjects from "./pages/SavedProjects";
import NotFound from "./pages/NotFound";

import DashboardLayout from "./layouts/DashboardLayout";

export const router = createBrowserRouter([

  {
    path: "/",
    element: <SplashScreen />,
  },

  {
    path: "/home",
    element: <Landing />,
  },

  {
    path: "/analyze",
    element: <Analyze />,
  },

  {
    element: <DashboardLayout />,

    children: [
      {
        path: "/dashboard/:projectId",
        element: <Dashboard />,
      },

      {
        path: "/dashboard/:projectId/knowledge-graph",
        element: <KnowledgeGraph />,
      },

      {
        path: "/dashboard/:projectId/mentor",
        element: <Mentor />,
      },

      {
        path: "/dashboard/:projectId/saved-projects",
        element: <SavedProjects />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },

]);