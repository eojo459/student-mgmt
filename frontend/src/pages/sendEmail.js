import * as React from "react";
import EmailForm from "../components/sendEmailForm";
import DashboardPage from "./dashboardPage";

export default function Dashboard() {
	return <DashboardPage component={EmailForm} header="Send Email" />;
}
