import * as React from "react";
import SearchStudentForm from "../components/searchStudentForm";
import SearchCourseForm from "../components/searchCourseForm";
import SearchTeacherForm from "../components/searchTeacherForm";
import SearchParentForm from "../components/searchParentForm";
import DashboardPage from "./dashboardPage";

export default function ViewStudents() {
	return (
		<DashboardPage
			component={
				window.location.href.split("/").slice(-1).toString() === "student-list"
					? SearchStudentForm
					: window.location.href.split("/").slice(-1).toString() === "course-list"
					? SearchCourseForm
					: window.location.href.split("/").slice(-1).toString() === "teacher-list"
					? SearchTeacherForm
					: window.location.href.split("/").slice(-1).toString() === "parent-list"
					? SearchParentForm
					: null
			}
			// header will be students, courses or teachers based on window link and it will have proper capitalization
			header={window.location.href
				.split("/")
				.slice(-1)
				.toString()
				.replace(/-/g, " ")
				.replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()))}
		/>
	);
}
