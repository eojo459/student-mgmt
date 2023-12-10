import * as React from "react";
import DashboardPage from "./dashboardPage";
import StudentProfile from "../components/studentProfile";

export default function Dashboard() {
	return <DashboardPage component={StudentProfile} header="Student Profile" />;
}
