import * as React from "react";
import RegistrationForm from "../../components/parent/childRegistration";
import DashboardPage from "../../components/parent/dashboard";

export default function Dashboard() {
	return <DashboardPage component={RegistrationForm} header="Register Child" />;
}
