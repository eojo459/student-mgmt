import * as React from "react";
import DashboardPage from "./dashboardPage";
import CourseView from "../components/courseView";

export default function Dashboard() {
	return <DashboardPage component={CourseView} header="View Course" />;
}
