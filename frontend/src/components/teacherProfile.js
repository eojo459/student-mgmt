import * as React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import { MenuItem, Divider } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
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
	const { id } = useParams();

	const [firstName, setFirstName] = React.useState(null);
	const [lastName, setLastName] = React.useState(null);
	const [chineseName, setChineseName] = React.useState(null);
	const [email, setEmail] = React.useState(null);
	const [username, setUsername] = React.useState(null);
	const [address, setAddress] = React.useState(null);
	const [city, setCity] = React.useState(null);
	const [province, setProvince] = React.useState(null);
	const [postalCode, setPostalCode] = React.useState(null);
	const [cell, setCell] = React.useState("");
	const [work, setWork] = React.useState("");
	const [home, setHome] = React.useState("");
	const [gender, setGender] = React.useState("");
	const [openSnackbar, setOpenSnackbar] = React.useState(false);
	const [snackbarMessage, setSnackbarMessage] = React.useState("Success!");
	const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");
	const [courses, setCourses] = React.useState([]);

	const handleClickSnackbar = () => {
		setOpenSnackbar(true);
	};

	const handleCloseSnackbar = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpenSnackbar(false);
	};

	const handleChangeGender = (event) => {
		setGender(event.target.value);
		//console.log(event.target.value);
	};

	React.useEffect(() => {
		getTeacher();
	}, []);

	const getTeacher = () => {
		axios({
			method: "get",
			// todo
			url: process.env.REACT_APP_API + "teacher/" + id + "/profile/",
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
		})
			.then((response) => {
				setFirstName(response.data.first_name);
				setLastName(response.data.last_name);
				setWork(response.data.work);
				setHome(response.data.home);
				setCell(response.data.cell);
				setChineseName(response.data.chineseName);
				setEmail(response.data.email);
				setUsername(response.data.username);
				setAddress(response.data.address);
				setCity(response.data.city);
				setProvince(response.data.province);
				setPostalCode(response.data.postalCode);
				setGender(response.data.gender);
				setCourses(response.data.courses);
			})
			.catch(function (err) {
				console.log(err);
				setSnackbarMessage("Error: " + err);
				setSnackbarSeverity("error");
				handleClickSnackbar();
			});
	};

	const handleSubmit = () => {
		// for updating teacher profile
		var data = {
			first_name: firstName,
			last_name: lastName,
			chineseName: chineseName,
			address: address,
			city: city,
			province: province,
			postalCode: postalCode.toUpperCase().replace(/-/g, ""),
			username: username,
			email: email,
			cell: cell.replace(/\D/g, ""),
			home: home.replace(/\D/g, ""),
			work: work.replace(/\D/g, ""),
			gender: gender,
		};

		axios({
			method: "PATCH",
			url: process.env.REACT_APP_API + "teacher/" + id,
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
			data: data,
		})
			.then((response) => {
				// snackbar response
				setSnackbarMessage("Successfully updated teacher!");
				setSnackbarSeverity("success");
				handleClickSnackbar();
			})
			.catch(function (err) {
				console.log(err);
				setSnackbarMessage("Error: " + err.request.response);
				setSnackbarSeverity("error");
				handleClickSnackbar();
			});
	};

	return (
		<React.Fragment>
			<FormControl>
				<Grid container spacing={1.5}>
					<Grid item xs={12} sm={12} sx={{ textAlign: "center" }}>
						<h1>老師簡介</h1>
						<h1>Teacher Profile</h1>
						<Divider style={{ width: "100%" }} />
						<br />
					</Grid>

					{/* Teacher Information Section */}
					<Grid item xs={12} sm={12}>
						<h2>老師資料</h2>
						<h2>Teacher Information</h2>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							id="teacher-username"
							label="用户名 Username"
							variant="outlined"
							fullWidth
							required
							onChange={(e) => setUsername(e.target.value)}
							value={username ? username : ""}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							id="teacher-email"
							label="電郵 Email"
							variant="outlined"
							fullWidth
							required
							onChange={(e) => setEmail(e.target.value)}
							value={email ? email : ""}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							id="teacher-chinese-name"
							label="中文姓名 Chinese Name"
							variant="outlined"
							fullWidth
							onChange={(e) => setChineseName(e.target.value)}
							value={chineseName ? chineseName : ""}
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField
							id="teacher-first-name"
							label="名 First Name"
							variant="outlined"
							fullWidth
							required
							onChange={(e) => setFirstName(e.target.value)}
							value={firstName ? firstName : ""}
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField
							id="teacher-last-name"
							label="姓 Last Name"
							variant="outlined"
							fullWidth
							required
							onChange={(e) => setLastName(e.target.value)}
							value={lastName ? lastName : ""}
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
							value={address ? address : ""}
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
							<MenuItem value="male">Male 男</MenuItem>
							<MenuItem value="female">Female 女</MenuItem>
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
							value={city ? city : ""}
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
							value={province ? province : ""}
							onChange={(e) => setProvince(e.target.value)}
						>
							<MenuItem value="Alberta">Alberta</MenuItem>
							<MenuItem value="British Columbia">British Columbia</MenuItem>
							<MenuItem value="Manitoba">Manitoba</MenuItem>
							<MenuItem value="New Brunswick">New Brunswick</MenuItem>
							<MenuItem value="Newfoundland and Labrador">Newfoundland and Labrador</MenuItem>
							<MenuItem value="Nova Scotia">Nova Scotia</MenuItem>
							<MenuItem value="Northwest Territories">Northwest Territories</MenuItem>
							<MenuItem value="Nunavut">Nunavut</MenuItem>
							<MenuItem value="Ontario">Ontario</MenuItem>
							<MenuItem value="Prince Edward Island">Prince Edward Island</MenuItem>
							<MenuItem value="Quebec">Quebec</MenuItem>
							<MenuItem value="Saskatchewan">Saskatchewan</MenuItem>
							<MenuItem value="Yukon">Yukon</MenuItem>
						</TextField>
					</Grid>
					<Grid item xs={12} sm={4}>
						<TextField
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
							value={postalCode ? postalCode : ""}
						/>
					</Grid>
					<Grid item xs={12} sm={4}>
						<TextField
							id="cell"
							label="手提 Cell"
							variant="outlined"
							fullWidth
							onChange={(e) => setCell(e.target.value)}
							value={cell ? cell : ""}
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
							required
							onChange={(e) => setHome(e.target.value)}
							value={home ? home : ""}
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
							required
							onChange={(e) => setWork(e.target.value)}
							value={work ? work : ""}
							InputProps={{
								inputComponent: PhoneMask,
							}}
						/>
					</Grid>
					<Grid item xs={12} sm={12}>
						<br />
						<Button id="modify-btn" variant="contained" fullWidth onClick={handleSubmit}>
							Modify Teacher
						</Button>
					</Grid>
					{/* Add divider between courses and teacher */}
					<Grid item xs={12} sm={12}>
						<br />
						<Divider />
						<br />
					</Grid>

					{/* Course Information Section */}
					<Grid item xs={12} sm={12}>
						<Typography variant="h5" gutterBottom>
							Course Information
						</Typography>
					</Grid>

					<TableContainer component={null}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Academic Year</TableCell>
									<TableCell>Course Name</TableCell>
									<TableCell>Grade</TableCell>
									<TableCell>Course Language</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{courses.map((course) => (
									<TableRow key={course.id}>
										<TableCell id={course.id + ": academicYear"}>
											<TableCell>{`${course.academicYear}-${(course.academicYear % 100) + 1}`}</TableCell>
										</TableCell>
										<TableCell id={course.id + ": courseName"}>{course.courseName}</TableCell>
										<TableCell id={course.id + ": grade"}>{course.grade}</TableCell>
										<TableCell id={course.id + ": courseLanguage"}>{course.courseLanguage}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>

					<Snackbar open={openSnackbar} autoHideDuration={2000} onClose={handleCloseSnackbar}>
						<Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
							{snackbarMessage}
						</Alert>
					</Snackbar>
				</Grid>
			</FormControl>
		</React.Fragment>
	);
}
