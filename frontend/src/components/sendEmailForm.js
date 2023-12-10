import * as React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import { MenuItem, Divider } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DataTable from "react-data-table-component";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import { useEffect } from "react";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export default function EmailForm() {
	const [emailContent, setEmailContent] = React.useState("");
	const [emailSubject, setEmailSubject] = React.useState("");
	const [studentData, setStudentData] = React.useState([]);
	const [openSnackbar, setOpenSnackbar] = React.useState(false);
	const [snackbarMessage, setSnackbarMessage] = React.useState("Success!");
	const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");

	const handleClickSnackbar = () => {
		setOpenSnackbar(true);
	};

	const handleCloseSnackbar = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpenSnackbar(false);
	};

	useEffect(() => {
		getStudentData();
	}, []);

	const handleSubmit = () => {
		// make sure fields are not empty

		const allEmails = Array.from(new Set(selectedRows.flatMap((item) => item.emails.filter((email) => email))));

		const bccEmails = allEmails.join(",");
		window.location.href = `mailto:?bcc=${bccEmails}`;
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
				setSnackbarMessage("Error: " + err.response.request.response);
				setSnackbarSeverity("error");
				handleClickSnackbar();
			});
	};

	const columns = [
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
			name: "Chinese Name",
			selector: (row) => row.chineseName,
			sortable: true,
		},
		{
			name: "Parent Email",
			selector: (row) => row.emails.join(", "),
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

	// handles related to selecting
	const handleChange = ({ selectedRows }) => {
		setSelectedRows(selectedRows);
	};

	// Toggle the state so React Data Table changes to clearSelectedRows are triggered
	const handleClearRows = () => {
		setToggleClearRows(!toggledClearRows);
	};

	const [toggledClearRows, setToggleClearRows] = React.useState(false);
	const [selectedRows, setSelectedRows] = React.useState([]);
	const [toggleCleared, setToggleCleared] = React.useState(false);

	const handleRowSelected = React.useCallback((state) => {
		setSelectedRows(state.selectedRows);
	}, []);

	const contextActions = React.useMemo(() => {
		const handleDelete = () => {
			if (window.confirm(`Are you sure you want to delete:\r ${selectedRows.map((r) => r.title)}?`)) {
				setToggleCleared(!toggleCleared);
			}
		};

		return (
			<Button key="delete" onClick={handleDelete} style={{ backgroundColor: "red" }} icon>
				Delete
			</Button>
		);
	}, [studentData, selectedRows, toggleCleared]);

	return (
		<React.Fragment>
			<Snackbar open={openSnackbar} autoHideDuration={2000} onClose={handleCloseSnackbar}>
				<Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
					{snackbarMessage}
				</Alert>
			</Snackbar>
			<FormControl>
				<Grid container spacing={1.5}>
					<Grid item xs={12} sm={12} sx={{ textAlign: "center" }}>
						<h1>發送電子郵件</h1>
						<h1>Send Email</h1>
						<Divider style={{ width: "100%" }} />
						<br />
					</Grid>

					{/* table section */}
					<Grid item xs={12} sm={12}>
						<DataTable
							title="Student List"
							columns={columns}
							data={studentData}
							selectableRows
							dense
							pagination
							customStyles={customStyles}
							expandableRows
							//contextActions={contextActions}
							expandableRowsComponent={ExpandedComponent}
							// onSelectedRowsChange={handleChange}
							onSelectedRowsChange={handleRowSelected}
							clearSelectedRows={toggleCleared}
						/>
						<br />
					</Grid>
					{/* Email title */}
					<Grid item xs={12} sm={12}>
						<br />
						<Button variant="contained" fullWidth onClick={handleSubmit}>
							Send Email
						</Button>
					</Grid>
				</Grid>
			</FormControl>
		</React.Fragment>
	);
}
