import * as React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import { MenuItem, Divider } from "@mui/material";
import DataTable from "react-data-table-component";
import { useEffect } from "react";
import axios from "axios";
import _ from "lodash";

export default function SearchCoursesForm() {
	// maybe we are going to use this in the future
	const [courseId, setCourseId] = React.useState([]);
	const [courseLanguage, setCourseLanguage] = React.useState("");
	const [courseName, setCourseName] = React.useState("");
	// not sure if they want to search with "courseName" or "courseId" in model.
	// but we can do the search with both
	const [teacherName, setTeacherName] = React.useState("");
	const [teacherId, setTeacherId] = React.useState([]);
	const [courseData, setCourseData] = React.useState([]);
	const [toggleCleared, setToggleCleared] = React.useState(false);
	const [currentYear, setCurrentYear] = React.useState("");

	let filteredData = Array.isArray(courseData)
		? courseLanguage == "cantonese"
			? courseData.filter(
					(data) =>
						data &&
						data.id.toString().includes(courseId) &&
						data.teacherId.toString().includes(teacherId) &&
						data.courseName.toLowerCase().includes(courseName.toLowerCase()) &&
						data.academicYear.toString().includes(currentYear) &&
						// data.teacherName.toLowerCase().includes(teacherName.toLowerCase()) &&
						data.courseLanguage === "cantonese"
			  )
			: courseLanguage == "mandarin"
			? courseData.filter(
					(data) =>
						data &&
						data.id.toString().includes(courseId) &&
						data.teacherId.toString().includes(teacherId) &&
						data.courseName.toLowerCase().includes(courseName.toLowerCase()) &&
						data.academicYear.toString().includes(currentYear) &&
						// data.teacherName.toLowerCase().includes(teacherName.toLowerCase()) &&
						data.courseLanguage === "mandarin"
			  )
			: courseLanguage == ""
			? courseData.filter(
					(data) =>
						data &&
						data.id.toString().includes(courseId) &&
						data.teacherId.toString().includes(teacherId) &&
						data.academicYear.toString().includes(currentYear) &&
						// data.teacherName.toLowerCase().includes(teacherName.toLowerCase()) &&
						data.courseName.toLowerCase().includes(courseName.toLowerCase())
			  )
			: []
		: [];

	const getCurrentYear = () => {
		// for getting current year to auto set
		axios({
			method: "get",
			url: process.env.REACT_APP_API + "years/all/",
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
		})
			.then((response) => {
				// set current year as the current year based on the id
				if (response.data["current_year"].academic_year.year === null) {
					setCurrentYear("None");
				} else setCurrentYear(response.data["current_year"].academic_year);
			})
			.catch(function (err) {
				console.log(err);
			});
	};

	useEffect(() => {
		getCourseData();
		getCurrentYear();
	}, []);

	const clearSearchingText = () => {
		setTeacherName("");
		setCourseName("");
		setCourseId([]);
		setTeacherId([]);
		setCourseLanguage("");
		setCurrentYear("");
	};

	useEffect(() => {
		getCourseData();
	}, [toggleCleared]);

	const handleChangeCourseId = (event) => {
		setCourseId(event.target.value);
		//console.log(event.target.value);
	};

	const handleChangeMotherTongue = (event) => {
		setCourseLanguage(event.target.value);
		//console.log(event.target.value);
	};

	const handleChangeCourse = (event) => {
		setCourseName(event.target.value);
		//console.log(event.target.value);
	};

	const handleChangeTeacherName = (event) => {
		setTeacherName(event.target.value);
		//console.log(event.target.value);
	};

	const handleChangeTeacherId = (event) => {
		setTeacherId(event.target.value);
		//console.log(event.target.value);
	};

	const handleChangeCurrentYear = (event) => {
		setCurrentYear(event.target.value);
		//console.log(event.target.value);
	};

	const getCourseData = () => {
		axios({
			method: "get",
			// todo
			url: process.env.REACT_APP_API + "course/",
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
		})
			.then((response) => {
				setCourseData(response.data);
			})
			.catch(function (err) {
				console.log(err);
			});
	};

	const handleRedirect = (event) => {
		window.location.href = `/course/${event.id}`;
	};

	const columns = [
		{
			cell: (e) => (
				<Button
					variant="contained"
					onClick={() => {
						handleRedirect(e);
					}}
				>
					View
				</Button>
			),
			ignoreRowClick: true,
			allowOverflow: true,
			button: true,
		},
		{
			name: "CourseID",
			selector: (row) => row.id,
			sortable: true,
		},
		{
			name: "Course Name",
			selector: (row) => row.courseName,
			sortable: true,
		},
		{
			name: "Course Language",
			selector: (row) => row.courseLanguage,
			sortable: true,
		},
		{
			name: "Academic Year",
			selector: (row) => row.academicYear,
			sortable: true,
		},
		{
			name: "Grade",
			selector: (row) => row.grade,
			sortable: true,
		},
		{
			name: "Teacher ID",
			selector: (row) => row.teacherId,
			sortable: true,
		},
		{
			name: "Number of Students",
			selector: (row) => row.enrolledStudents.length,
			sortable: true,
		},
	];

	const customStyles = {
		rows: {
			style: {
				minHeight: "72px", // override the row height
			},
		},
		head: {
			style: {
				// color: theme.text.primary,
				fontSize: "12px",
				fontWeight: 500,
			},
		},
		headCells: {
			style: {
				paddingLeft: "8px", // override the cell padding for head cells
				paddingRight: "8px",
				// paddingTop: '10px',
			},
		},
		cells: {
			style: {
				paddingLeft: "8px", // override the cell padding for data cells
				paddingRight: "1px",
			},
		},
	};

	const ExpandedComponent = ({ data }) => <h6>{JSON.stringify(data, null, 2)}</h6>;

	const [toggledClearRows, setToggleClearRows] = React.useState(false);
	const [selectedRows, setSelectedRows] = React.useState([]);
	// const [toggleCleared, setToggleCleared] = React.useState(false);

	// handles related to selecting
	const handleChange = ({ selectedRows }) => {
		//console.log(selectedRows);
		setSelectedRows(selectedRows);
	};

	// Toggle the state so React Data Table changes to clearSelectedRows are triggered
	const handleClearRows = () => {
		setToggleClearRows(!toggledClearRows);
	};

	const handleRowSelected = React.useCallback((state) => {
		setSelectedRows(state.selectedRows);
	}, []);

	const contextActions = React.useMemo(() => {
		const handleDelete = () => {
			if (window.confirm(`Are you sure you want to delete:\r${selectedRows.map((r) => r.courseName)}?`)) {
				setToggleCleared(!toggleCleared);
				getCourseData();
			}
		};

		return (
			<Button key="delete" variant="contained" onClick={handleDelete} style={{ backgroundColor: "red" }}>
				Delete
			</Button>
		);
	}, [courseData, selectedRows, toggleCleared]);

	return (
		<React.Fragment>
			<FormControl>
				<Grid container spacing={1.5}>
					<Grid item xs={12} sm={12} sx={{ textAlign: "center" }}>
						<h1>搜索課程資料</h1>
						<h1>Search For Course</h1>
						<Divider style={{ width: "100%" }} />
						<br />
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField
							id="select-mother-tongue"
							label="Course Language"
							value={courseLanguage}
							onChange={handleChangeMotherTongue}
							select
							fullWidth
						>
							<MenuItem value="cantonese">粵語 Cantonese</MenuItem>
							<MenuItem value="mandarin">國語 Mandarin</MenuItem>
						</TextField>
						<br />
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField
							id="student-last-name"
							value={courseId}
							onChange={handleChangeCourseId}
							label="Course ID: "
							variant="outlined"
							fullWidth
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField
							id="student-first-name"
							value={courseName}
							onChange={handleChangeCourse}
							label="Course Name"
							variant="outlined"
							fullWidth
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField
							id="teacher-name"
							value={teacherName}
							onChange={handleChangeTeacherName}
							label="Teacher Name"
							variant="outlined"
							fullWidth
							disabled
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField
							id="teacher-id"
							value={teacherId}
							onChange={handleChangeTeacherId}
							label="Teacher ID:"
							variant="outlined"
							fullWidth
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField
							id="academic-year"
							value={currentYear}
							onChange={handleChangeCurrentYear}
							label="Academic Year: "
							variant="outlined"
							fullWidth
						/>
					</Grid>

					<Grid item xs={12} sm={12} minHeight={20}></Grid>

					<Grid item container xs={12} sm={12} justifyContent="center">
						<Grid item>
							<Button variant="contained" onClick={clearSearchingText}>
								Clear
							</Button>
						</Grid>
						<Grid item xs={1}></Grid>

						<Grid item>
							<Button variant="contained">Print View</Button>
						</Grid>
						<Grid item xs={1}></Grid>
					</Grid>

					{/* table section */}
					<DataTable
						title="Course List"
						columns={columns}
						data={filteredData.sort((a, b) => parseInt(b.academicYear) - parseInt(a.academicYear))}
						selectableRows
						dense
						pagination
						customStyles={customStyles}
						expandableRows
						contextActions={contextActions}
						expandableRowsComponent={ExpandedComponent}
						onSelectedRowsChange={handleChange}
						// onSelectedRowsChange={handleRowSelected}
						clearSelectedRows={toggleCleared}
					/>
				</Grid>
			</FormControl>
		</React.Fragment>
	);
}
