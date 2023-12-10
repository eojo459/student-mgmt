import * as React from "react";
import NewsletterCreation from "../components/newsletterCreation";
import DashboardPage from "./dashboardPage";

export default function StudentRegistration() {
	return <DashboardPage component={NewsletterCreation} header="Create Newsletter" />;
}
