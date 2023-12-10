import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AuthContext from "../authentication/AuthContext";
import { useContext } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Divider } from "@mui/material";

const theme = createTheme();

export default function SignInSide() {
	let { loginUser } = useContext(AuthContext);
	const navigate = useNavigate();

	const checkLoggedIn = () => {
		if (localStorage.getItem("authTokens")) {
			let decodedToken = jwtDecode(JSON.parse(localStorage.getItem("authTokens"))["refresh"]);
			if (decodedToken["role"] === "PARENT") navigate("/parent/dashboard");
			else if (decodedToken["role"] === "ADMIN") navigate("/admin-dashboard");
		}
	};

	useEffect(() => {
		checkLoggedIn();
	}, [navigate]);

	return (
		<ThemeProvider theme={theme}>
			<Grid container component="main" sx={{ height: "100vh" }}>
				<CssBaseline />
				<Grid
					item
					xs={false}
					sm={4}
					md={7}
					sx={{
						backgroundImage:
							"url(https://images.unsplash.com/photo-1617336422396-e1dfc4210ec5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80)",
						backgroundRepeat: "no-repeat",
						backgroundColor: (t) => (t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900]),
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				/>
				<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
					<Box
						sx={{
							my: 8,
							mx: 4,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<img src={process.env.PUBLIC_URL + "/media/Logo.jpg"} alt="NCA Logo" style={{ width: "75%" }} />
						<Divider />
						<Divider />
						<Typography component="h1" variant="h5">
							Welcome to the NCA Dashboard.
						</Typography>
						<Box component="form" noValidate onSubmit={loginUser} sx={{ mt: 1 }}>
							<TextField
								margin="normal"
								required
								fullWidth
								id="username"
								label="Username"
								name="username"
								autoComplete="username"
								autoFocus
							/>
							<TextField
								margin="normal"
								required
								fullWidth
								name="password"
								label="Password"
								type="password"
								id="password"
								autoComplete="current-password"
							/>
							<Link href="/register" variant="body2">
								{"New parent? Sign Up"}
							</Link>
							<Button id="sign-in-button" type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
								Sign In
							</Button>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</ThemeProvider>
	);
}
