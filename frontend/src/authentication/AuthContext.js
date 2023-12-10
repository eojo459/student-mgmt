import { createContext, useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import * as React from "react";
import jwtDecode from "jwt-decode";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
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

	let [authTokens, setAuthTokens] = useState(() =>
		localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null
	);
	let [user, setUser] = useState(() =>
		localStorage.getItem("authTokens") ? jwt_decode(localStorage.getItem("authTokens")) : null
	);
	let [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	let loginUser = (e) => {
		e.preventDefault();
		axios({
			method: "post",
			url: process.env.REACT_APP_API + "token/",
			data: { username: e.target.username.value, password: e.target.password.value },
		})
			.then(function (response) {
				if (response.status === 200) {
					setAuthTokens(response.data);
					setUser(jwt_decode(response.data.access));
					localStorage.setItem("authTokens", JSON.stringify(response.data));
					if (jwt_decode(response.data.access)["role"] === "PARENT") navigate("/parent/dashboard");
					else if (jwt_decode(response.data.access)["role"] === "ADMIN") navigate("/admin-dashboard");
				}
			})
			.catch(function (error) {
				console.log(error);
				setSnackbarMessage("Failed to log in! Check your username and password.");
				setSnackbarSeverity("error");
				handleClickSnackbar();
			});
	};

	// for parent login after signup, as it doesnt use an event
	let loginUserWithArguments = (username, password) => {
		axios({
			method: "post",
			url: process.env.REACT_APP_API + "token/",
			data: { username: username, password: password },
		})
			.then(function (response) {
				if (response.status === 200) {
					setAuthTokens(response.data);
					setUser(jwt_decode(response.data.access));
					localStorage.setItem("authTokens", JSON.stringify(response.data));
					if (jwt_decode(response.data.access)["role"] === "PARENT") navigate("/parent/dashboard");
					else if (jwt_decode(response.data.access)["role"] === "ADMIN") navigate("/admin-dashboard");
				}
			})
			.catch(function (error) {
				console.log(error);
				setSnackbarMessage("Failed to log in! Check your username and password.");
				setSnackbarSeverity("error");
				handleClickSnackbar();
			});
	};

	// This function is used to logout the user
	let logoutUser = () => {
		// blacklist token before logging out
		axios.post(process.env.REACT_APP_API + "token/blacklist/", { refresh: authTokens.refresh });
		setUser(null);
		setAuthTokens(null);
		localStorage.removeItem("authTokens");
		navigate("/");
	};

	// This function is used to update the token
	let updateToken = () => {
		// only update if logged in
		if (!authTokens) {
			setLoading(false);
			return;
		}

		axios({
			method: "post",
			url: process.env.REACT_APP_API + "token/refresh/",
			data: { refresh: authTokens?.refresh },
		})
			.then(function (response) {
				if (response.status === 200) {
					setAuthTokens(response.data);
					setUser(jwt_decode(response.data.access));
					localStorage.setItem("authTokens", JSON.stringify(response.data));
				}
			})
			.catch(function (error) {
				// logs out user if token is invalid
				logoutUser();
			});
		if (loading) {
			setLoading(false);
		}
	};

	// This useEffect is used to update the token every 29 minutes (1000 ms * 60 sec * 29 min)
	useEffect(() => {
		if (loading) {
			updateToken();
		}

		let interval = setInterval(() => {
			if (authTokens) {
				updateToken();
			}
		}, 1000 * 60 * 29);
		return () => clearInterval(interval);
	});

	let contextData = {
		loginUser: loginUser,
		user: user,
		logoutUser: logoutUser,
		loginUserWithArguments: loginUserWithArguments,
	};

	return (
		<>
			<Snackbar open={openSnackbar} autoHideDuration={2000} onClose={handleCloseSnackbar}>
				<Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
					{snackbarMessage}
				</Alert>
			</Snackbar>
			<AuthContext.Provider value={contextData}>{loading ? null : children}</AuthContext.Provider>
		</>
	);
};
