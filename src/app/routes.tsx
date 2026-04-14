import { createHashRouter } from "react-router";
import { Landing } from "./components/Landing";
import { DashboardLayout } from "./components/DashboardLayout";
import { Dashboard } from "./components/Dashboard";
import { Editor } from "./components/Editor";
import { Insights } from "./components/Insights";
import { Settings } from "./components/Settings";

export const router = createHashRouter([
  { path: "/", Component: Landing },
  {
    path: "/app",
    Component: DashboardLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "editor", Component: Editor },
      { path: "insights", Component: Insights },
      { path: "settings", Component: Settings },
    ],
  },
]);
