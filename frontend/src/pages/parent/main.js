import * as React from "react";
import MainComponent from "../../components/parent/mainComponent";
import DashboardPage from "../../components/parent/dashboard";

export default function Dashboard() {
	return <DashboardPage component={MainComponent} header="Parent Dashboard" />;
}
