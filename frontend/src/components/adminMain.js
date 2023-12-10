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

	return (
		<React.Fragment>
			<Snackbar open={openSnackbar} autoHideDuration={2000} onClose={handleCloseSnackbar}>
				<Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
					{snackbarMessage}
				</Alert>
			</Snackbar>

			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Typography variant="h4">Welcome, Admin.</Typography>
				</Grid>
				<Grid item xs={12}></Grid>
				{/* if there is no current year, let them create a current year */}
			</Grid>
		</React.Fragment>
	);
}
