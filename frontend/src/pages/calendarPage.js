import * as React from "react";
import Calendar from "../components/calendar";
// import Calendar from "../components/calendar_safe"
import DashboardPage from "./dashboardPage";

export default function Dashboard() {
    return <DashboardPage component={Calendar} header="Calendar" />;
}
