import * as React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import { MenuItem, Divider } from "@mui/material";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";
import MaskedInput from "react-text-mask";

const CanadianPostalCodeMask = React.forwardRef((props, ref) => (
	<MaskedInput
		{...props}
		mask={[/[A-Za-z]/, /\d/, /[A-Za-z]/, "-", /\d/, /[A-Za-z]/, /\d/]}
		guide={false}
		placeholderChar={"\u2000"}
		showMask
	/>
));

const PhoneMask = React.forwardRef((props, ref) => (
	<MaskedInput
		{...props}
		mask={["(", /\d/, /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/]}
		guide={false}
		placeholderChar={"\u2000"}
		showMask
	/>
));
export default function TeacherForm() {
	const navigate = useNavigate();

	const [gender, setGender] = React.useState("");
	const [firstName, setFirstName] = React.useState(null);
	const [lastName, setLastName] = React.useState(null);
	const [chineseName, setChineseName] = React.useState(null);
	const [email, setEmail] = React.useState(null);
	const [password, setPassword] = React.useState(null);
	const [username, setUsername] = React.useState(null);
	const [address, setAddress] = React.useState(null);
	const [city, setCity] = React.useState(null);
	const [province, setProvince] = React.useState(null);
	const [postalCode, setPostalCode] = React.useState(null);
	const [cell, setCell] = React.useState("");
	const [work, setWork] = React.useState("");
	const [home, setHome] = React.useState("");
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

	//const [signedDate, setSignedDate] = React.useState(null);

	const handleChangeGender = (event) => {
		setGender(event.target.value);
		//console.log(event.target.value);
	};

	const handleSubmit = () => {
		// immutable
		var data = {
			username: username,
			first_name: firstName,
			last_name: lastName,
			email: email,
			password: password,
			chineseName: chineseName,
			address: address,
			city: city,
			province: province,
			postalCode: postalCode.toUpperCase().replace(/-/g, ""),
			gender: gender,
			// medicalHistory: medicalHistory,
			// remark: remark,
			cell: cell.replace(/\D/g, ""),
			home: home.replace(/\D/g, ""),
			work: work.replace(/\D/g, ""),
		};

		axios({
			method: "POST",
			url: process.env.REACT_APP_API + "teacher/",
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
			data: data,
		})
			.then((response) => {
				// navigate to teacher profile
				navigate("/teacher-profile/" + response.data.id);
			})
			.catch(function (err) {
				console.log(err);
				setSnackbarMessage("Error: " + err.response.request.response);
				// if response is empty
				if (err.response === "") {
					setSnackbarMessage("Error: ");
				}
				setSnackbarSeverity("error");
				handleClickSnackbar();
			});
	};

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
						<h1>老師登記表</h1>
						<h1>Teacher Registration Form</h1>
						<Divider style={{ width: "100%" }} />
						<br />
					</Grid>

					{/* Parent Information Section */}
					<Grid item xs={12} sm={12}>
						<h2>老師資料</h2>
						<h2>Teacher Information</h2>
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField
							id="username"
							label="用户名 Username"
							variant="outlined"
							fullWidth
							required
							onChange={(e) => setUsername(e.target.value)}
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField
							id="password"
							label="密碼 Password"
							variant="outlined"
							fullWidth
							required
							onChange={(e) => setPassword(e.target.value)}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							id="email"
							label="電郵 Email"
							variant="outlined"
							fullWidth
							required
							onChange={(e) => setEmail(e.target.value)}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							id="chinese-name"
							label="中文姓名 Chinese Name"
							variant="outlined"
							fullWidth
							onChange={(e) => setChineseName(e.target.value)}
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField
							id="first-name"
							label="名 First Name"
							variant="outlined"
							fullWidth
							required
							onChange={(e) => setFirstName(e.target.value)}
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField
							id="last-name"
							label="姓 Last Name"
							variant="outlined"
							fullWidth
							required
							onChange={(e) => setLastName(e.target.value)}
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<TextField
							id="address"
							label="地址 Address"
							variant="outlined"
							fullWidth
							required
							onChange={(e) => setAddress(e.target.value)}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							id="select-gender"
							label="性别 Gender"
							value={gender}
							onChange={handleChangeGender}
							select
							fullWidth
							required
						>
							<MenuItem id="male-option" value="male">
								Male 男
							</MenuItem>
							<MenuItem id="female-option" value="female">
								Female 女
							</MenuItem>
						</TextField>
					</Grid>
					<Grid item xs={12} sm={4}>
						<TextField
							id="city"
							label="城市 City"
							variant="outlined"
							fullWidth
							required
							onChange={(e) => setCity(e.target.value)}
						/>
					</Grid>
					<Grid item xs={12} sm={4}>
						<TextField
							id="province"
							label="省 Province"
							variant="outlined"
							fullWidth
							required
							select
							value={province}
							onChange={(e) => setProvince(e.target.value)}
							defaultValue="Alberta"
						>
							<MenuItem id="ab" value="Alberta">Alberta</MenuItem>
							<MenuItem id="bc" value="British Columbia">British Columbia</MenuItem>
							<MenuItem id="mb" value="Manitoba">Manitoba</MenuItem>
							<MenuItem id="nb" value="New Brunswick">New Brunswick</MenuItem>
							<MenuItem id="nl" value="Newfoundland and Labrador">Newfoundland and Labrador</MenuItem>
							<MenuItem id="ns" value="Nova Scotia">Nova Scotia</MenuItem>
							<MenuItem id="nt" value="Northwest Territories">Northwest Territories</MenuItem>
							<MenuItem id="nu" value="Nunavut">Nunavut</MenuItem>
							<MenuItem id="on" value="Ontario">Ontario</MenuItem>
							<MenuItem id="pe" value="Prince Edward Island">Prince Edward Island</MenuItem>
							<MenuItem id="qc" value="Quebec">Quebec</MenuItem>
							<MenuItem id="sk" value="Saskatchewan">Saskatchewan</MenuItem>
							<MenuItem id="yt" value="Yukon">Yukon</MenuItem>
						</TextField>
					</Grid>
					<Grid item xs={12} sm={4}>
						<TextField
							id="postal-code"
							label="郵遞區號 Postal Code"
							InputProps={{
								inputComponent: CanadianPostalCodeMask,
								onChange: (event) => {
									event.target.value = event.target.value.toUpperCase();
									setPostalCode(event.target.value);
								},
							}}
							fullWidth
							required
							variant="outlined"
						/>
					</Grid>
					<Grid item xs={12} sm={4}>
						<TextField
							id="cell"
							label="手提 Cell"
							variant="outlined"
							fullWidth
							required
							onChange={(e) => setCell(e.target.value)}
							InputProps={{
								inputComponent: PhoneMask,
							}}
						/>
					</Grid>
					<Grid item xs={12} sm={4}>
						<TextField
							id="home"
							label="住家 Home"
							variant="outlined"
							fullWidth
							onChange={(e) => setHome(e.target.value)}
							InputProps={{
								inputComponent: PhoneMask,
							}}
						/>
					</Grid>
					<Grid item xs={12} sm={4}>
						<TextField
							id="work"
							label="公司 Business"
							variant="outlined"
							fullWidth
							onChange={(e) => setWork(e.target.value)}
							InputProps={{
								inputComponent: PhoneMask,
							}}
						/>
					</Grid>
					<Grid item xs={12} sm={12}>
						<br />
						<Button id="register-teacher-btn" variant="contained" fullWidth onClick={handleSubmit}>
							Register
						</Button>
					</Grid>
				</Grid>
			</FormControl>
		</React.Fragment>
	);
}
