import * as React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
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
			url: process.env.REACT_APP_API + "years/all/",
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
		})
			.then((response) => {
				const sortedYears = response.data["years"].sort((a, b) => b.year - a.year);
				setYears(sortedYears);
				// set current year as the current year based on the id

				if (response.data["current_year"].academic_year.year === null) {
					setCurrentYear("None");
				} else setCurrentYear(response.data["current_year"].academic_year);
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

	return (
		<React.Fragment>
			<Snackbar open={openSnackbar} autoHideDuration={2000} onClose={handleCloseSnackbar}>
				<Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
					{snackbarMessage}
				</Alert>
			</Snackbar>

			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Typography variant="h4">Welcome, Parent.</Typography>
				</Grid>
				<Grid item xs={12}>
					<Divider />
				</Grid>
				<Grid item xs={12}>
					<Typography variant="h5">
						{/* Academic year should be displayed in format of YYYY-YY*/}
						The current academic year is {currentYear !== "None" ? `${currentYear}-${(currentYear % 100) + 1}` : "NONE"}
						. Please register your children on the left.
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="h5"></Typography>
				</Grid>
			</Grid>
		</React.Fragment>
	);
}
