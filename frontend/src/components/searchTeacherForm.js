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

export default function SearchTeachersForm() {
	const [grade, setGrade] = React.useState("");
	const [first_name, setfirst_name] = React.useState("");
	const [last_name, setlast_name] = React.useState("");
	// maybe we are going to use this in the future
	const [teacherId, setTeacherId] = React.useState("");
	const [motherTongue, setMotherTongue] = React.useState("");
	const [course, setCourse] = React.useState("");
	const [phoneNumber, setPhoneNumber] = React.useState("");
	// not sure if they want to search with "courseName" or "courseId" in model.
	// but we can do the search with both
	const [teacherData, setTeacherData] = React.useState([]);
	const [toggleCleared, setToggleCleared] = React.useState(false);

	useEffect(() => {
		getTeacherData();
	}, []);

	let filteredData = Array.isArray(teacherData)
		? teacherData.filter(
				(data) =>
					data &&
					data.first_name.toLowerCase().includes(first_name.toLowerCase()) &&
					data.last_name.toLowerCase().includes(last_name.toLowerCase()) &&
					data.cell.includes(phoneNumber) &&
					data.id.toString().includes(teacherId) &&
					data.courses.toString().includes(course)
		  )
		: [];

	const clearSearchingText = () => {
		setfirst_name("");
		setlast_name("");
		setPhoneNumber("");
		setTeacherId([]);
		setCourse("");
	};

	useEffect(() => {
		getTeacherData();
	}, [toggleCleared]);

	const handlelast_name = (event) => {
		setlast_name(event.target.value);
		//console.log(event.target.value);
	};

	const handlefirst_name = (event) => {
		setfirst_name(event.target.value);
		//console.log(event.target.value);
	};

	const handleChangePhoneNumber = (event) => {
		setPhoneNumber(event.target.value);
		//console.log(event.target.value);
	};

	const handleChangeGrade = (event) => {
		setGrade(event.target.value);
		//console.log(event.target.value);
	};

	const handleChangeTeacherId = (event) => {
		setTeacherId(event.target.value);
		//console.log(event.target.value);
	};

	const handleChangeMotherTongue = (event) => {
		setMotherTongue(event.target.value);
		//console.log(event.target.value);
	};

	const handleChangeCourse = (event) => {
		setCourse(event.target.value);
		//console.log(event.target.value);
	};

	const getTeacherData = () => {
		axios({
			method: "get",
			// todo
			url: process.env.REACT_APP_API + "teacher/",
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
		})
			.then((response) => {
				setTeacherData(response.data);
				// console.log(response.data);
			})
			.catch(function (err) {
				console.log(err);
			});
	};

	const handleRedirect = (event) => {
		window.location.href = `/teacher-profile/${event.id}`;
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
					profile
				</Button>
			),
			ignoreRowClick: true,
			allowOverflow: true,
			button: true,
		},
		{
			name: "ID",
			selector: (row) => row.id,
			sortable: true,
		},
		{
			name: "First Name",
			selector: (row) => row.first_name,
			sortable: true,
		},
		{
			name: "Last Name",
			selector: (row) => row.last_name,
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
			if (window.confirm(`Are you sure you want to delete:\r ${selectedRows.map((r) => r.title)}?`)) {
				setToggleCleared(!toggleCleared);
				getTeacherData();
			}
		};

		const handleMailTo = () => {
			let mailTo = selectedRows
				.map((r) => r.email)
				.filter((email) => email && email.trim() !== "") // remove empty values and nulls
				.filter((email, index, self) => self.indexOf(email) === index);

			window.location.href = `mailto:?bcc=${mailTo}`;
		};

		return (
			<Stack spacing={2} direction="row">
				<Button key="disable" variant="contained" onClick={handleDelete} style={{ backgroundColor: "red" }}>
					Disable
				</Button>
				<Button key="email" variant="contained" onClick={handleMailTo} style={{ backgroundColor: "blue" }}>
					Email
				</Button>
			</Stack>
		);
	}, [teacherData, selectedRows, toggleCleared]);

	return (
		<React.Fragment>
			<FormControl>
				<Grid container spacing={1.5}>
					<Grid item xs={12} sm={12} sx={{ textAlign: "center" }}>
						<h1>搜索教師資料</h1>
						<h1>Search For Teacher</h1>
						<Divider style={{ width: "100%" }} />
						<br />
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField
							id="student-first-name"
							value={first_name}
							onChange={handlefirst_name}
							label="First Name: "
							variant="outlined"
							fullWidth
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField
							id="student-last-name"
							value={last_name}
							onChange={handlelast_name}
							label="Last Name: "
							variant="outlined"
							fullWidth
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField
							id="student-first-name"
							value={phoneNumber}
							onChange={handleChangePhoneNumber}
							label="Phone Number: "
							variant="outlined"
							fullWidth
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField
							id="student-last-name"
							value={teacherId}
							onChange={handleChangeTeacherId}
							label="Teacher ID: "
							variant="outlined"
							fullWidth
						/>
					</Grid>

					{/* <Grid item xs={12} sm={3}>
						<TextField
							id="select-mother-tongue"
							label="Course Language"
							value={motherTongue}
							onChange={handleChangeMotherTongue}
							select
							fullWidth
						>
							<MenuItem value="cantonese">粵語 Cantonese</MenuItem>
							<MenuItem value="mandarin">國語 Mandarin</MenuItem>
						</TextField>
						<br />
					</Grid> */}

					{/* <Grid item xs={12} sm={3}>
                        <TextField 
                        id="student-last-name" 
                        label="School Year: " 
                        variant="outlined" 
                        fullWidth 
                        />
                    </Grid> */}
					{/* <Grid item xs={12} sm={3}>
                        <TextField
                            id="select-mother-tongue"
                            label="Grade"
                            value={grade}
                            onChange={handleChangeGrade}
                            select
                            fullWidth
                        >
                            <MenuItem value="K1">K1</MenuItem>
                            <MenuItem value="K2">K2</MenuItem>
                            <MenuItem value="K3">K3</MenuItem>
                            <MenuItem value="P1">P1</MenuItem>
                            <MenuItem value="P2">P2</MenuItem>
                            <MenuItem value="P3">P3</MenuItem>
                            <MenuItem value="P4">P4</MenuItem>
                            <MenuItem value="P5">P5</MenuItem>
                            <MenuItem value="P6">P6</MenuItem>
                        </TextField>
                        <br />
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
					</Grid>

					{/* table section */}
					<DataTable
						title="Teacher List"
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
						// onSelectedRowsChange={handleRowSelected}
						clearSelectedRows={toggleCleared}
					/>
				</Grid>
			</FormControl>
		</React.Fragment>
	);
}
