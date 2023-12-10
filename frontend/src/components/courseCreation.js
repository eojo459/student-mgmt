import * as React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import { MenuItem, Divider } from "@mui/material";
import { useEffect } from "react";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export default function CourseForm() {
	// form for creating a new course
	const [courseLanguage, setCourseLanguage] = React.useState("");
	const [academicYear, setAcademicYear] = React.useState("");
	const [courseName, setCourseName] = React.useState("");
	const [courseGrade, setCourseGrade] = React.useState("");
	const [teacher, setTeacher] = React.useState("");
	const [openSnackbar, setOpenSnackbar] = React.useState(false);
	const [snackbarMessage, setSnackbarMessage] = React.useState("Success!");
	const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");
	const [teachers, setTeachers] = React.useState([]);
	const [years, setYears] = React.useState([]);

	const handleClickSnackbar = () => {
		setOpenSnackbar(true);
	};

	const handleCloseSnackbar = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpenSnackbar(false);
	};

	const handleCourseLanguage = (event) => {
		setCourseLanguage(event.target.value);
	};

	const handleAcademicYear = (event) => {
		setAcademicYear(event.target.value);
	};

	const handleTeacher = (event) => {
		setTeacher(event.target.value);
	};

	// axios request for creating new course
	const handleSubmit = () => {
		var data = {
			courseLanguage: courseLanguage,
			academicYear: academicYear,
			courseName: courseName,
			grade: courseGrade,
			teacherId: [teacher],
		};

		axios({
			method: "POST",
			url: process.env.REACT_APP_API + "course/",
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
			data: data,
		})
			.then((response) => {
				//console.log(response.data);
				setSnackbarMessage(response.data.message);
				setSnackbarSeverity("success");
				handleClickSnackbar();
				// clear fields
				setCourseLanguage("");
				setAcademicYear("");
				setCourseName("");
				setCourseGrade("");
				setTeacher("");
			})
			.catch(function (err) {
				console.log(err);
				setSnackbarMessage("Error: " + err.response.request.response);
				setSnackbarSeverity("error");
				handleClickSnackbar();
			});
	};

	const getTeachers = () => {
		axios({
			method: "GET",
			url: process.env.REACT_APP_API + "teacher/",
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
		})
			.then((response) => {
				setTeachers(response.data);
			})
			.catch(function (err) {
				console.log(err);
				setSnackbarMessage("Failed to get teachers: " + err.response.request.response);
				setSnackbarSeverity("error");
				handleClickSnackbar();
			});
	};

	const getYears = () => {
		// for getting all years on page load
		axios({
			method: "get",
			url: process.env.REACT_APP_API + "years/active/",
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
		})
			.then((response) => {
				// set current year as the current year based on the id
				setAcademicYear(response.data["current_year"].academic_year);
				const sortedYears = response.data["years"].sort((a, b) => b.year - a.year);
				setYears(sortedYears);
			})
			.catch(function (err) {
				console.log(err);
				setSnackbarMessage("Failed to get all academic years!");
				setSnackbarSeverity("error");
				handleClickSnackbar();
			});
	};

	useEffect(() => {
		getTeachers();
		getYears();
	}, []);

	return (
		<React.Fragment>
			<FormControl>
				<Grid container spacing={1.5}>
					<Grid item xs={12} sm={12} sx={{ textAlign: "center" }}>
						<h1>課程創建形式</h1>
						<h1>Course Creation Form</h1>
						<Divider style={{ width: "100%" }} />
						<br />
					</Grid>

					{/* Parent Information Section */}
					<Grid item xs={12} sm={12}>
						<h2>課程資料</h2>
						<h2>Course Information</h2>
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField
							id="select-course-language"
							label="Course Language"
							value={courseLanguage}
							onChange={handleCourseLanguage}
							select
							fullWidth
							required
						>
							<MenuItem id="course-lang-option-1" value="cantonese">
								粵語 Cantonese
							</MenuItem>
							<MenuItem id="course-lang-option-2" value="mandarin">
								國語 Mandarin
							</MenuItem>
						</TextField>
						<br />
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField
							id="select-academic-year"
							label="Academic Year"
							value={academicYear}
							onChange={handleAcademicYear}
							select
							fullWidth
							required
						>
							{
								// for each year, create a menu item
								years.map((year) => (
									<MenuItem id={"year-" + year.year} value={year.year} key={year.id}>
										{`${year.year}-${(year.year % 100) + 1}`}
									</MenuItem>
								))
							}
						</TextField>
						<br />
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							id="course-name"
							label="Course Name"
							variant="outlined"
							fullWidth
							required
							onChange={(e) => setCourseName(e.target.value)}
							value={courseName}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							id="course-grade"
							label="Course Grade"
							variant="outlined"
							fullWidth
							required
							onChange={(e) => setCourseGrade(e.target.value)}
							value={courseGrade || ""}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							id="select-teacher"
							label="Teacher"
							value={teacher}
							onChange={handleTeacher}
							select
							fullWidth
							required
						>
							{teachers.map((teacher) => (
								<MenuItem id={"teacher-id-" + teacher.id} key={teacher.id} value={teacher.id}>
									{teacher.first_name + " " + teacher.last_name + " (" + teacher.email + ")"}
								</MenuItem>
							))}
						</TextField>
						<br />
					</Grid>
					<Grid item xs={12} sm={12}>
						<br />
						<Button id="create-course-btn" variant="contained" fullWidth onClick={handleSubmit}>
							Create Course
						</Button>
					</Grid>
					<Snackbar open={openSnackbar} autoHideDuration={2000} onClose={handleCloseSnackbar}>
						<Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
							{snackbarMessage}
						</Alert>
					</Snackbar>
				</Grid>
			</FormControl>
		</React.Fragment>
	);
}
