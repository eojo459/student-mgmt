import * as React from "react";
import ParentProfile from "../../components/parent/profile";
import DashboardPage from "../../components/parent/dashboard";

export default function Dashboard() {
	return <DashboardPage component={ParentProfile} header="Parent Profile" />;
}
