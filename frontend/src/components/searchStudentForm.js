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
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

export default function SearchStudentsForm() {
	const [studentStatus, setStudentStatus] = React.useState(false);
	const [studentApproved, setStudentApproved] = React.useState(true);
	const [firstName, setFirstName] = React.useState("");
	const [lastName, setLastName] = React.useState("");
	// maybe we are going to use this in the future
	const [studentId, setStudentId] = React.useState([]);
	const [motherTongue, setMotherTongue] = React.useState("");
	const [chineseName, setChineseName] = React.useState("");
	const [course, setCourse] = React.useState("");
	const [phoneNumber, setPhoneNumber] = React.useState("");
	// not sure if they want to search with "courseName" or "courseId" in model.
	// but we can do the search with both
	const [studentData, setStudentData] = React.useState([]);
	const [toggleCleared, setToggleCleared] = React.useState(false);
	const [courseData, setCourseData] = React.useState([]);

	// get data of student list before it first renders
	useEffect(() => {
		getStudentData();
		getCourseList();
		ifCheckUnapproved();
	}, []);

	// check if we navigated here from the "unapproved" notification bell
	const ifCheckUnapproved = () => {
		if (localStorage.getItem("unapproved")) {
			setStudentApproved(false);
			setStudentStatus(true);
			localStorage.removeItem("unapproved");
		}
	};

	// this ternary operator is to tell which status of students to be displayed. (active, disabled, or both)
	// inner filter is to filter out students based on what they put in the search boxes, eg firstName, lastName, studentId
	let filteredData = Array.isArray(studentData)
		? studentStatus == true
			? studentData.filter(
					(data) =>
						data &&
						data.firstName.toLowerCase().includes(firstName.toLowerCase()) &&
						data.lastName.toLowerCase().includes(lastName.toLowerCase()) &&
						data.studentId.toString().includes(studentId) &&
						data.chineseName.toLowerCase().includes(chineseName.toLowerCase()) &&
						data.disabled === true &&
						(studentApproved === "all" || data.approved === studentApproved)
			  )
			: studentStatus == false
			? studentData.filter(
					(data) =>
						data &&
						data.firstName.toLowerCase().includes(firstName.toLowerCase()) &&
						data.lastName.toLowerCase().includes(lastName.toLowerCase()) &&
						data.studentId.toString().includes(studentId) &&
						data.chineseName.toLowerCase().includes(chineseName.toLowerCase()) &&
						data.disabled === false &&
						(studentApproved === "all" || data.approved === studentApproved)
			  )
			: studentStatus == "both"
			? studentData.filter(
					(data) =>
						data &&
						data.firstName.toLowerCase().includes(firstName.toLowerCase()) &&
						data.lastName.toLowerCase().includes(lastName.toLowerCase()) &&
						data.studentId.toString().includes(studentId) &&
						data.chineseName.toLowerCase().includes(chineseName.toLowerCase()) &&
						(studentApproved === "all" || data.approved === studentApproved)
			  )
			: []
		: [];

	// clear everything in search boxes to remove the filter (show all student data again)
	const clearSearchingText = () => {
		setFirstName("");
		setLastName("");
		setStudentId([]);
		setStudentStatus(false);
		setStudentApproved(false);
		setChineseName([]);
	};

	// get student data again everytime handleDisable() is called,
	// in order to rerender to page to show the new student list after change
	useEffect(() => {
		getStudentData();
		getCourseList();
	}, [toggleCleared]);

	const handleLastName = (event) => {
		setLastName(event.target.value);
		//console.log(event.target.value);
	};

	const handleFirstName = (event) => {
		setFirstName(event.target.value);
		//console.log(event.target.value);
	};

	const handleChangePhoneNumber = (event) => {
		setPhoneNumber(event.target.value);
		//console.log(event.target.value);
	};

	const handleChangeStudentStatus = (event) => {
		setStudentStatus(event.target.value);
		//console.log("togggle ", event.target.value);
	};

	const handleChangeStudentApproved = (event) => {
		// if we are setting the value to be false, then we need to set the studentStatus to be false as well
		if (event.target.value == false) {
			setStudentStatus(true);
		}

		setStudentApproved(event.target.value);
	};

	const handleChangeStudentId = (event) => {
		setStudentId(event.target.value);
		//console.log(event.target.value);
	};

	const handleChangeChineseName = (event) => {
		setChineseName(event.target.value);
		//console.log(event.target.value);
	};

	const handleChangeCourse = (event) => {
		setCourse(event.target.value);
		//console.log(event.target.value);
	};

	const getStudentData = () => {
		axios({
			method: "get",
			url: process.env.REACT_APP_API + "students/contacts/",
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
		})
			.then((response) => {
				setStudentData(response.data);
			})
			.catch(function (err) {
				console.log(err);
			});
	};

	const disableStudents = (studentIds) => {
		//console.log("ids: ", studentIds);
		// temporarily changed this to "disableStudents" since the clients don't want "delete"
		let url = process.env.REACT_APP_API + "students/disable/";
		let endpoints = [];
		studentIds.map((e) => {
			let completeUrl = url.concat(e.studentId);
			endpoints.push(completeUrl);
		});
		//console.log("urls: ", endpoints);

		endpoints.map((endpoint) => {
			axios({
				method: "patch",
				url: `${endpoint}`,
				headers: {
					Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
				},
			})
				.then((response) => {
					setStudentData(response.data);
					//console.log(response.data);
				})
				.catch(function (err) {
					console.log(err);
				});
		});
	};

	// redirect the user to the student-profile page
	const handleRedirect = (event) => {
		window.location.href = `/student-profile/${event.studentId}`;
	};

	// specify what to display on the data-table
	const columns = [
		{
			cell: (e) => (
				<Button
					variant="contained"
					onClick={() => {
						handleRedirect(e);
					}}
				>
					profile
				</Button>
			),
			ignoreRowClick: true,
			allowOverflow: true,
			button: true,
		},
		{
			name: "studentNo",
			selector: (row) => row.studentId,
			sortable: true,
		},
		{
			name: "First Name",
			selector: (row) => row.firstName,
			sortable: true,
		},
		{
			name: "Last Name",
			selector: (row) => row.lastName,
			sortable: true,
		},
		{
			name: "Date of Birth",
			selector: (row) => row.DoB,
			sortable: true,
		},
		{
			name: "Chinese Name",
			selector: (row) => row.chineseName,
			sortable: true,
		},
		{
			name: "Gender",
			selector: (row) => row.gender,
			sortable: true,
		},
		{
			name: "Parent Emails",
			selector: (row) => row.emails.join(", "),
			sortable: true,
		},
		{
			name: "Parent Numbers",
			selector: (row) => row.numbers.join(", "),
		},
		{
			name: "Medical History",
			selector: (row) =>
				row.medicalHistory.length > 10 ? row.medicalHistory.slice(0, 10 - 3) + "..." : row.medicalHistory,
			sortable: true,
		},
		{
			name: "Remarks",
			selector: (row) => (row.remark.length > 10 ? row.remark.slice(0, 10 - 3) + "..." : row.remark),
			sortable: true,
		},
	];

	// style that applied for data-table
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
			},
		},
		cells: {
			style: {
				paddingLeft: "8px", // override the cell padding for data cells
				paddingRight: "1px",
			},
		},
	};

	// controls what to show up underneath the row everytime a show is expanded
	const ExpandedComponent = ({ data }) => <h6>{JSON.stringify(data, null, 2)}</h6>;

	const [toggledClearRows, setToggleClearRows] = React.useState(false);
	const [selectedRows, setSelectedRows] = React.useState([]);

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

	const getCourseList = () => {
		axios({
			method: "get",
			url: process.env.REACT_APP_API + "course/current/",
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

	const enrollStudents = (courseId) => {
		let studentIds = [];

		selectedRows.map((selectedStudentData) => {
			studentIds.push(selectedStudentData.studentId);
		});

		axios({
			method: "PATCH",
			url: process.env.REACT_APP_API + "course/enroll/" + courseId,
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
			data: {
				studentIds: studentIds,
			},
		})
			.then((response) => {})
			.catch(function (err) {
				console.log(err);
			});
	};

	const [open, setOpen] = React.useState(false);
	const [selectedValue, setSelectedValue] = React.useState(courseData[1]);

	const handleClose = (value) => {
		setOpen(false);
		setSelectedValue(value);
	};

	function SimpleDialog(props) {
		const { onClose, selectedValue, open } = props;

		// define interaction that let the Clients double check if they want to do the enrollments
		const handleEnroll = (selectedCourseData) => {
			if (
				window.confirm(
					`Are you sure you want to enroll these students:\r ${selectedRows.map(
						(r) => r.firstName + " " + r.lastName
					)} \r to course:  ${selectedCourseData.courseName}?`
				)
			) {
				// if the Clients are sure to enroll,
				// switch the toggle of selection and actually do the API call
				setToggleCleared(!toggleCleared);
				enrollStudents(selectedCourseData.id);
			}
		};

		// define the behavior of dialogue when clients try to close the dialogue.
		const handleClose = () => {
			setToggleCleared(!toggleCleared);
			onClose(selectedValue);
		};

		const handleListItemClick = (value) => {
			handleEnroll(value);
			setToggleCleared(!toggleCleared);
			onClose(value);
		};

		// define the UI for dialogue that allows Clients to choose what course to enroll students in
		return (
			<Dialog onClose={handleClose} open={open}>
				<DialogTitle>Choose a course to enroll students in</DialogTitle>
				<List sx={{ pt: 0 }}>
					{courseData
						? courseData.map((selectedCourse) => (
								<ListItem disableGutters key={selectedCourse.id}>
									<ListItemButton onClick={() => handleListItemClick(selectedCourse)} key={selectedCourse.courseName}>
										<ListItemText
											primary={
												selectedCourse.courseName +
												" - Grade: " +
												selectedCourse.grade +
												" - Language: " +
												selectedCourse.courseLanguage
											}
										/>
									</ListItemButton>
								</ListItem>
						  ))
						: ""}
				</List>
			</Dialog>
		);
	}

	SimpleDialog.propTypes = {
		onClose: PropTypes.func.isRequired,
		open: PropTypes.bool.isRequired,
		selectedValue: PropTypes.string.isRequired,
	};

	const contextActions = React.useMemo(() => {
		// behavior when the user hits the button 'disable' or 'enroll' after selection
		const handleDisable = () => {
			// define interaction that let the Clients double check if they want to do the enrollments
			if (
				window.confirm(
					`Are you sure you want to disable these students:\r ${selectedRows.map(
						(r) => r.firstName + " " + r.lastName
					)}?`
				)
			) {
				// switch the toggle of selection and actually do the API call.
				setToggleCleared(!toggleCleared);
				disableStudents(selectedRows);
				// getStudentData() again to refresh the page to be able to show new users
				getStudentData();
			}
		};

		const handleClickOpen = () => {
			getCourseList();
			setOpen(true);
		};

		const handleMailTo = () => {
			let mailTo = selectedRows
				.map((r) => r.emails)
				.flat()
				.filter((email) => email && email.trim() !== "") // remove empty values and nulls
				.filter((email, index, self) => self.indexOf(email) === index);

			window.location.href = `mailto:?bcc=${mailTo}`;
		};

		// defined the UIs that turn up when we select multiple students
		return (
			<Stack spacing={2} direction="row">
				<Button key="enroll" variant="contained" onClick={handleClickOpen} style={{ backgroundColor: "green" }}>
					Enroll
				</Button>
				<Button key="disable" variant="contained" onClick={handleDisable} style={{ backgroundColor: "red" }}>
					Disable
				</Button>
				<Button key="email" variant="contained" onClick={handleMailTo} style={{ backgroundColor: "blue" }}>
					Email
				</Button>
			</Stack>
		);
	}, [studentData, selectedRows, toggleCleared]);

	return (
		<React.Fragment>
			<FormControl>
				<Grid container spacing={1.5}>
					<Grid item xs={12} sm={12} sx={{ textAlign: "center" }}>
						<h1>搜索學生資料</h1>
						<h1>Search For Student</h1>
						<Divider style={{ width: "100%" }} />
						<br />
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField
							id="student-first-name"
							value={firstName}
							onChange={handleFirstName}
							label="First Name: "
							variant="outlined"
							fullWidth
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField
							id="student-last-name"
							value={lastName}
							onChange={handleLastName}
							label="Last Name: "
							variant="outlined"
							fullWidth
						/>
					</Grid>
					{/* <Grid item xs={12} sm={3}>
						<TextField
							id="student-first-name"
							value={phoneNumber}
							onChange={handleChangePhoneNumber}
							label="Phone Number: "
							variant="outlined"
							fullWidth
							disabled
						/>
					</Grid> */}
					<Grid item xs={12} sm={3}>
						<TextField
							id="student-last-name"
							value={studentId}
							onChange={handleChangeStudentId}
							label="Student ID: "
							variant="outlined"
							fullWidth
						/>
					</Grid>

					<Grid item xs={12} sm={3}>
						<TextField
							id="search-chinese-name"
							label="Chinese Name"
							value={chineseName}
							onChange={handleChangeChineseName}
							fullWidth
						></TextField>
						<br />
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField
							id="select-student-approval"
							label="Approval Status"
							value={studentApproved}
							onChange={handleChangeStudentApproved}
							select
							fullWidth
						>
							<MenuItem value={true}>Approved</MenuItem>
							<MenuItem value={false}>Unapproved</MenuItem>
							<MenuItem value={"all"}>All</MenuItem>
						</TextField>
						<br />
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField
							id="select-student-status"
							label="Student Status"
							value={studentStatus}
							onChange={handleChangeStudentStatus}
							select
							fullWidth
						>
							<MenuItem value={false}>Active</MenuItem>
							<MenuItem value={true}>Disabled</MenuItem>
							<MenuItem value={"both"}>All</MenuItem>
						</TextField>
						<br />
					</Grid>
					{/* <Grid item xs={12} sm={3}>
						<TextField
							id="student-first-name"
							value={course}
							onChange={handleChangeCourse}
							label="Course"
							variant="outlined"
							fullWidth
						/>
					</Grid> */}
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

						<Grid item>
							<Button variant="contained">Class Mark</Button>
						</Grid>
					</Grid>

					{/* table section */}
					<DataTable
						title="Student List"
						columns={columns}
						data={filteredData}
						selectableRows
						dense
						pagination
						customStyles={customStyles}
						expandableRows
						contextActions={contextActions}
						expandableRowsComponent={ExpandedComponent}
						onSelectedRowsChange={handleChange}
						clearSelectedRows={toggleCleared}
					/>

					{/* dialogue section */}
					<SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} />
				</Grid>
			</FormControl>
		</React.Fragment>
	);
}
