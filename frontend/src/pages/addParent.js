import * as React from "react";
import ParentRegistration from "../components/parentRegistrationForm";
import DashboardPage from "./dashboardPage";

export default function Dashboard() {
	return <DashboardPage component={ParentRegistration} header="Parent Registration" />;
}
