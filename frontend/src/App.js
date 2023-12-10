import Admin from "./pages/admin";
import Login from "./pages/login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminRoute from "./authentication/AdminRoute";
import ParentRoute from "./authentication/ParentRoute";
import { AuthProvider } from "./authentication/AuthContext";
import StudentRegistration from "./pages/addStudent";
import ViewList from "./pages/viewStuff";
import ParentRegistration from "./pages/addParent";
import TeacherRegistration from "./pages/addTeacher";
import CourseCreation from "./pages/addCourse";
import EmailCreation from "./pages/sendEmail";
import StudentProfile from "./pages/viewStudent";
import ParentProfileAdmin from "./pages/viewParent";
import TeacherProfile from "./pages/viewTeacher";
import CourseView from "./pages/viewCourse";
import Calendar from "./pages/calendarPage";
import CreateNewsletter from "./pages/createNewsletter";
import ParentSignUp from "./pages/parentSignUp";
import ParentDashboard from "./pages/parent/main";
import ParentAddChild from "./pages/parent/addChild";
import ParentProfile from "./pages/parent/profilePage";
import ParentViewChild from "./pages/parent/viewChild";
import NewsletterPage from "./pages/viewNewsletter";
import Settings from "./pages/settings";

function App() {
	return (
		<div className="App">
			<Router>
				<AuthProvider>
					<Routes>
						<Route element={<AdminRoute />}>
							<Route path="/admin-dashboard" element={<Admin />} />
							<Route path="/student-form" element={<StudentRegistration />} />
							<Route path="/student-list" element={<ViewList />} />
							<Route path="/teacher-list" element={<ViewList />} />
							<Route path="/course-list" element={<ViewList />} />
							<Route path="/parent-list" element={<ViewList />} />
							<Route path="/parent-form" element={<ParentRegistration />} />
							<Route path="/teacher-form" element={<TeacherRegistration />} />
							<Route path="/course-form" element={<CourseCreation />} />
							<Route path="/send-email" element={<EmailCreation />} />
							<Route path="/student-profile/:id" element={<StudentProfile />} />
							<Route path="/parent-profile/:id" element={<ParentProfileAdmin />} />
							<Route path="/teacher-profile/:id" element={<TeacherProfile />} />
							<Route path="/course/:id" element={<CourseView />} />
							<Route path="/calendar" element={<Calendar />} />
							<Route path="/create-newsletter" element={<CreateNewsletter />} />
							<Route path="/admin/settings" element={<Settings />} />
						</Route>
						<Route element={<ParentRoute />}>
							<Route path="/parent/dashboard" element={<ParentDashboard />} />
							<Route path="/parent/student/register" element={<ParentAddChild />} />
							<Route path="/parent/profile/" element={<ParentProfile />} />
							<Route path="/parent/child/profile/:id" element={<ParentViewChild />} />
						</Route>
						<Route path="/newsletter/:id" element={<NewsletterPage />} />
						<Route exact path="/register" element={<ParentSignUp />} />
						<Route exact path="/" element={<Login />} />
					</Routes>
				</AuthProvider>
			</Router>
		</div>
	);
}

export default App;
