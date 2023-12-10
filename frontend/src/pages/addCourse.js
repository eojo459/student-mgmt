import * as React from "react";
import CourseCreation from "../components/courseCreation";
import DashboardPage from "./dashboardPage";

export default function Dashboard() {
	return <DashboardPage component={CourseCreation} header="Course Creation" />;
}
