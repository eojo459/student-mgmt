import * as React from "react";
import DashboardPage from "./dashboardPage";
import ParentProfile from "../components/parentProfile";

export default function Dashboard() {
	return <DashboardPage component={ParentProfile} header="Parent Profile" />;
}
