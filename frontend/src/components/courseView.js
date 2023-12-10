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
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

export default function CourseForm() {
	// get id
	const { id } = useParams();
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

	// all course data
	const [courseData, setCourseData] = React.useState([]);
	const [students, setStudents] = React.useState([]);
	const [courseTeachers, setCourseTeachers] = React.useState([]);

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

	React.useEffect(() => {
		getCourse();
		getTeachers();
		getYears();
	}, []);

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

	const getCourse = () => {
		axios({
			method: "get",
			// todo
			url: process.env.REACT_APP_API + "course/" + id + "/members/",
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
		})
			.then((response) => {
				setCourseLanguage(response.data.courseLanguage);
				setAcademicYear(response.data.academicYear);
				setCourseName(response.data.courseName);
				setCourseGrade(response.data.grade);
				setCourseTeachers(response.data["teacherId"]);
				setStudents(response.data["enrolledStudents"]);
			})
			.catch(function (err) {
				console.log(err);
				setSnackbarMessage("Error: " + err);
				setSnackbarSeverity("error");
				handleClickSnackbar();
			});
	};

	return (
		<React.Fragment>
			<FormControl>
				<Grid container spacing={1.5}>
					<Grid item xs={12} sm={12} sx={{ textAlign: "center" }}>
						<h1>課程詳情</h1>
						<h1>Course Details</h1>
						<Divider style={{ width: "100%" }} />
						<br />
					</Grid>

					{/* Course Information Section */}
					<Grid item xs={12} sm={12}>
						<h2>課程資料</h2>
						<h2>Course Information</h2>
					</Grid>
					<Grid item xs={12} sm={6}>
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
					<Grid item xs={12} sm={6}>
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
									<MenuItem id={"year-option-" + year.id} value={year.year} key={year.id}>
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
							type="number"
							fullWidth
							required
							onChange={(e) => setCourseGrade(e.target.value)}
							value={courseGrade || ""}
						/>
					</Grid>
					<Grid item xs={12} sm={6}></Grid>
					<Grid item xs={12} sm={12}>
						<Divider style={{ width: "100%" }} />
					</Grid>

					{/* Teacher Section */}
					<Grid item xs={12} sm={12}>
						<h2>老師資料</h2>
						<h2>Teacher Information</h2>
					</Grid>

					{courseTeachers.map((teacher) => (
						<Grid item xs={12} sm={12}>
							<div key={teacher.id}>
								<Typography variant="h6">{teacher.first_name + " " + teacher.last_name}</Typography>
								<Typography>{teacher.chineseName ? teacher.chineseName : ""}</Typography>
								<Typography>{teacher.address}</Typography>
								<Typography>{teacher.postalCode}</Typography>
								<Typography>{teacher.city}</Typography>
								<Typography>{teacher.province}</Typography>
								<Grid item xs={12}>
									<br />
									<Divider />
								</Grid>
							</div>
						</Grid>
					))}

					{/* Students Section */}
					<Grid item xs={12} sm={12}>
						<h2>學生資料</h2>
						<h2>Student Information</h2>
					</Grid>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<TableContainer component={null}>
								<Table aria-label="student table">
									<TableHead>
										<TableRow>
											<TableCell>Name</TableCell>
											<TableCell>Chinese Name</TableCell>
											<TableCell>Gender</TableCell>
											<TableCell>Medical History</TableCell>
											<TableCell>Remark</TableCell>
											<TableCell>DoB</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{students.map((student) => (
											<TableRow key={student.studentId}>
												<TableCell component="th" scope="row">
													{student.firstName} {student.lastName}
												</TableCell>
												<TableCell>{student.chineseName}</TableCell>
												<TableCell>{student.gender}</TableCell>
												<TableCell>{student.medicalHistory}</TableCell>
												<TableCell>{student.remark}</TableCell>
												<TableCell>{student.DoB}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</Grid>
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
