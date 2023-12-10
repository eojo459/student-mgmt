import * as React from "react";
import AdminPage from "../components/adminMain";
import DashboardPage from "./dashboardPage";

export default function StudentRegistration() {
	return <DashboardPage component={AdminPage} header="Admin Dashboard" />;
}
