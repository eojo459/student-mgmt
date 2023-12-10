import * as React from "react";
import DashboardPage from "./dashboardPage";
import TeacherProfile from "../components/teacherProfile";

export default function Dashboard() {
	return <DashboardPage component={TeacherProfile} header="Teacher Profile" />;
}
