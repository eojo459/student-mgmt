import * as React from "react";
import TeacherRegistration from "../components/teacherRegistration";
import DashboardPage from "./dashboardPage";

export default function Dashboard() {
	return <DashboardPage component={TeacherRegistration} header="Teacher Registration" />;
}
