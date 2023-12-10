import * as React from "react";
import DashboardPage from "./dashboardPage";
import Settings from "../components/adminSettings";

export default function Dashboard() {
	return <DashboardPage component={Settings} header="Admin Settings" />;
}
