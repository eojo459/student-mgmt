import * as React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import { MenuItem, Divider, MenuList } from "@mui/material";
import { useEffect } from "react";
import axios from "axios";
import { Typography } from "@mui/material";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";

export default function AdminMain() {
	const [years, setYears] = React.useState([]);
	const [newYear, setNewYear] = React.useState(false);
	const [currentYear, setCurrentYear] = React.useState("");
	const [selectedYear, setSelectedYear] = React.useState("");
	const [openSnackbar, setOpenSnackbar] = React.useState(false);
	const [snackbarMessage, setSnackbarMessage] = React.useState("Success!");
	const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");
	const [openFinishYearDialog, setOpenFinishYearDialog] = React.useState(false);

	const handleFinishYearDialogOpen = () => {
		setOpenFinishYearDialog(true);
	};

	const handleClickSnackbar = () => {
		setOpenSnackbar(true);
	};

	const handleCloseSnackbar = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpenSnackbar(false);
	};

	const getYears = () => {
		// for getting all years on page load
		axios({
			method: "get",
			url: process.env.REACT_APP_API + "years/active/",
		})
			.then((response) => {
				const sortedYears = response.data["years"].sort((a, b) => b.year - a.year);
				setYears(sortedYears);
				// set current year as the current year based on the id
				if (response.data["current_year"].academic_year.year === null) {
					setCurrentYear("None");
				} else {
					setCurrentYear(response.data["current_year"].academic_year);
					setSelectedYear(response.data["current_year"].academic_year);
				}
			})
			.catch(function (err) {
				console.log(err);
				setSnackbarMessage("Failed to get all academic years!");
				setSnackbarSeverity("error");
				handleClickSnackbar();
			});
	};

	useEffect(() => {
		getYears();
	}, []);

	const handleNewYear = () => {
		// for creating a new year
		axios({
			method: "post",
			url: process.env.REACT_APP_API + "years/all/",
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
			data: {
				year: newYear,
			},
		})
			.then((response) => {
				getYears();
				setSnackbarMessage("Successfully created a new academic year!");
				setSnackbarSeverity("success");
				handleClickSnackbar();
				// clear the new year field
				setNewYear("");
			})
			.catch(function (err) {
				console.log(err);
				setSnackbarMessage("Error!");
				setSnackbarSeverity("error");
				handleClickSnackbar();
				setNewYear("");
			});
	};

	const YearChange = () => {
		// for setting a new year

		// find the id of current year
		let id = 0;
		for (let i = 0; i < years.length; i++) {
			if (years[i].year === selectedYear) {
				id = years[i].id;
				break;
			}
		}

		axios({
			method: "post",
			url: process.env.REACT_APP_API + "years/current/",
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
			data: {
				year: id,
			},
		})
			.then((response) => {
				getYears();
				setSnackbarMessage("Success!");
				setSnackbarSeverity("success");
				handleClickSnackbar();
			})
			.catch(function (err) {
				console.log(err);
				setSnackbarMessage("Error!");
				setSnackbarSeverity("error");
				handleClickSnackbar();
			});
	};

	const FinishYear = () => {
		// for finishing a year
		axios({
			method: "post",
			url: process.env.REACT_APP_API + "years/current/finish/",
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
		})
			.then((response) => {
				getYears();
				setSnackbarMessage("Successfully finished the current year!");
				setSnackbarSeverity("success");
				handleClickSnackbar();
			})
			.catch(function (err) {
				if (err.request.response) setSnackbarMessage(err.request.response);
				else setSnackbarMessage("Failed to finish the current year!");
				setSnackbarSeverity("error");
				handleClickSnackbar();
			});
	};

	const handleYearChange = (event) => {
		setSelectedYear(event.target.value);
	};

	return (
		<React.Fragment>
			<Snackbar open={openSnackbar} autoHideDuration={2000} onClose={handleCloseSnackbar}>
				<Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
					{snackbarMessage}
				</Alert>
			</Snackbar>
			<Dialog open={openFinishYearDialog} onClose={() => setOpenFinishYearDialog(false)}>
				<DialogTitle>Confirm Finish Year</DialogTitle>
				<DialogContent>
					<DialogContentText>Are you sure you want to finish the current year?</DialogContentText>
					<DialogContentText>
						This will change the status of all marks that are "enrolled" to completed", and create a new academic year.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenFinishYearDialog(false)}>Cancel</Button>
					<Button
						color="primary"
						onClick={() => {
							setOpenFinishYearDialog(false);
							// Call the API to finish the year here
							FinishYear();
						}}
					>
						Finish Year
					</Button>
				</DialogActions>
			</Dialog>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Typography variant="h5">
						The current academic year is {currentYear !== "None" ? `${currentYear}-${(currentYear % 100) + 1}` : "NONE"}
						.
					</Typography>
				</Grid>
				<Grid item xs={6}>
					<TextField
						id="select-year"
						label="Active Academic Years"
						select
						fullWidth
						required
						sx={{ height: "100%" }}
						value={selectedYear ? selectedYear : ""}
						onChange={handleYearChange}
					>
						{years.map((year) => (
							<MenuItem id={"year-" + year.year} key={year.year} value={year.year}>
								{`${year.year}-${(year.year % 100) + 1}`}{" "}
							</MenuItem>
						))}
					</TextField>
				</Grid>
				<Grid item xs={3}>
					<Button id="update-year-btn" variant="contained" color="primary" fullWidth sx={{ height: "100%" }} onClick={YearChange}>
						Update Current Year
					</Button>
				</Grid>
				<Grid item xs={3}>
					<Button
						variant="contained"
						color="primary"
						fullWidth
						sx={{ height: "100%" }}
						onClick={handleFinishYearDialogOpen}
					>
						Finish Current Year
					</Button>
				</Grid>
				<Grid item xs={6}>
					<TextField
						id="create-year"
						label="Create New Year"
						fullWidth
						required
						sx={{ height: "100%" }}
						onChange={(e) => setNewYear(e.target.value)}
					></TextField>
				</Grid>
				<Grid item xs={6}>
					<Button 
						id="create-year-btn" 
						variant="contained" 
						color="primary" 
						fullWidth 
						sx={{ height: "100%" }} 
						onClick={handleNewYear}
					>
						Create New Year
					</Button>
				</Grid>
			</Grid>
		</React.Fragment>
	);
}
