import * as React from "react";
import StudentForm from "../components/registrationForm";
import DashboardPage from "./dashboardPage";

export default function StudentRegistration() {
	return <DashboardPage component={StudentForm} header="Add Student" />;
}
