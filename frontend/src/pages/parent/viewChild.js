import * as React from "react";
import ChildProfile from "../../components/parent/childProfile";
import DashboardPage from "../../components/parent/dashboard";

export default function Dashboard() {
	return <DashboardPage component={ChildProfile} header="View Child" />;
}
