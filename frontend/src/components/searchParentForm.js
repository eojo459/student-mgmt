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

export default function SearchTeachersForm() {
	const [grade, setGrade] = React.useState("");
	const [firstName, setFirstName] = React.useState("");
	const [lastName, setLastName] = React.useState("");
	// maybe we are going to use this in the future
	const [parentId, setParentId] = React.useState("");
	const [motherTongue, setMotherTongue] = React.useState("");
	const [course, setCourse] = React.useState("");
	const [phoneNumber, setPhoneNumber] = React.useState("");
	// not sure if they want to search with "courseName" or "courseId" in model.
	// but we can do the search with both
	const [parentData, setParentData] = React.useState([]);
	const [toggleCleared, setToggleCleared] = React.useState(false);

	useEffect(() => {
		getParentData();
	}, []);

	let filteredData = Array.isArray(parentData)
		? parentData.filter(
				(data) =>
					data &&
					data.first_name.toLowerCase().includes(firstName.toLowerCase()) &&
					data.last_name.toLowerCase().includes(lastName.toLowerCase()) &&
					data.cell.includes(phoneNumber) &&
					data.id.toString().includes(parentId)
		  )
		: [];

	const clearSearchingText = () => {
		setFirstName("");
		setLastName("");
		setPhoneNumber("");
		setParentId("");
	};

	useEffect(() => {
		getParentData();
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

	const handleChangeParentId = (event) => {
		setParentId(event.target.value);
		//console.log(event.target.value);
	};

	const handleChangeCourse = (event) => {
		setCourse(event.target.value);
		//console.log(event.target.value);
	};

	const getParentData = () => {
		axios({
			method: "get",
			// todo
			url: process.env.REACT_APP_API + "parent/",
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
		})
			.then((response) => {
				setParentData(response.data);
				// console.log(response.data);
			})
			.catch(function (err) {
				console.log(err);
			});
	};

	const handleRedirect = (event) => {
		window.location.href = `/parent-profile/${event.id}`;
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
			name: "parentNo",
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
			name: "Email",
			selector: (row) => row.email,
			sortable: true,
		},
		{
			name: "Home Phone",
			selector: (row) => row.home,
		},
		{
			name: "Mobile Phone",
			selector: (row) => row.cell,
			sortable: true,
		},
		{
			name: "Work Phone",
			selector: (row) => row.business,
			sortable: true,
		},
		{
			name: "Children",
			selector: (row) => row.studentID.join(", "),
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
				getParentData();
			}
		};

		return (
			<Button key="delete" variant="contained" onClick={handleDelete} style={{ backgroundColor: "red" }}>
				Delete
			</Button>
		);
	}, [parentData, selectedRows, toggleCleared]);

	return (
		<React.Fragment>
			<FormControl>
				<Grid container spacing={1.5}>
					<Grid item xs={12} sm={12} sx={{ textAlign: "center" }}>
						<h1>搜索家長/監護人資料</h1>
						<h1>Search for Parents/Guardians</h1>
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
							value={parentId}
							onChange={handleChangeParentId}
							label="Parent ID: "
							variant="outlined"
							fullWidth
						/>
					</Grid>
					{/* add divider here */}
					<Grid item xs={12} sm={12} minHeight={20}></Grid>

					{/* <Grid xs={3}></Grid> */}
					<Grid container item xs={12} sm={12} justifyContent="center">
						<Grid item>
							<Button variant="contained" onClick={clearSearchingText}>
								Clear
							</Button>
						</Grid>
						<Grid item xs={1} />

						<Grid item>
							<Button variant="contained">Print View</Button>
						</Grid>
					</Grid>

					{/* table section */}
					<DataTable
						className="parent-data-table"
						title="Parent/Guardian List"
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
