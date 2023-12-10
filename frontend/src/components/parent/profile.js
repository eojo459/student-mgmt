import * as React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import { MenuItem, Divider } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Navigate, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import jwtDecode from "jwt-decode";
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
export default function ParentProfile() {
	// Parent profile component

	const navigate = useNavigate();

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
	const [studentId, setStudentId] = React.useState(null);
	const [studentData, setStudentData] = React.useState([]);
	const [openSnackbar, setOpenSnackbar] = React.useState(false);
	const [snackbarMessage, setSnackbarMessage] = React.useState("Success!");
	const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");
	const [userId, setUserId] = React.useState(null);

	const handleClickSnackbar = () => {
		setOpenSnackbar(true);
	};

	const handleCloseSnackbar = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpenSnackbar(false);
	};

	// set user id
	React.useEffect(() => {
		const userId = jwtDecode(JSON.parse(localStorage.getItem("authTokens"))["access"])["user_id"];
		setUserId(userId);
	}, []);

	// once user id is set, get parent data
	React.useEffect(() => {
		if (userId) {
			getParent();
		}
	}, [userId]);

	// get children data, chained after parent
	const getStudentData = (id) => {
		axios({
			method: "get",
			url: process.env.REACT_APP_API + "students/" + id,
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
		})
			.then((response) => {
				// append response.data to studentData
				setStudentData((studentData) => [...studentData, response.data]);
				return response.data;
			})
			.catch(function (err) {
				// error handling
				console.log(err);
				setSnackbarMessage("Error: " + err);
				setSnackbarSeverity("error");
				handleClickSnackbar();
			});
	};

	const getParent = () => {
		// get parent data
		axios({
			method: "get",
			// todo
			url: process.env.REACT_APP_API + "parent/" + userId,
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
		})
			.then((response) => {
				// set state of all fields
				setFirstName(response.data.first_name);
				setLastName(response.data.last_name);
				setWork(response.data.business);
				setHome(response.data.home);
				setCell(response.data.cell);
				setChineseName(response.data.chineseName);
				setEmail(response.data.email);
				setUsername(response.data.username);
				setAddress(response.data.address);
				setCity(response.data.city);
				setProvince(response.data.province);
				setPostalCode(response.data.postalCode);
				setStudentId(response.data.studentID);

				// render student information from list of studentIDs if not null
				console.log(response.data.studentID);

				response.data.studentID.forEach((id) => {
					getStudentData(id);
				});
			})
			.catch(function (err) {
				// error handling
				console.log(err);
				setSnackbarMessage("Error: " + err);
				setSnackbarSeverity("error");
				handleClickSnackbar();
			});
	};

	// for adding a student to a parent
	const addStudentToParent = () => {
		var data = {
			studentId: studentId,
		};
		axios({
			method: "POST",
			url: process.env.REACT_APP_API + "parent/" + userId + "/students/",
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
			data: data,
		})
			.then((response) => {
				// refresh page to show changes
				window.location.reload();
			})
			.catch(function (err) {
				// error handling
				console.log(err);
				setSnackbarMessage("Error: " + err);
				setSnackbarSeverity("error");
				handleClickSnackbar();
			});
	};

	const addNewChild = () => {
		// store current parent id, and navigate to the student creation form
		localStorage.setItem("parentId", userId);
		navigate("/parent/student/register");
	};

	const handleSubmit = () => {
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
			home: home.replace(/\D/g, ""),
			cell: cell.replace(/\D/g, ""),
			business: work.replace(/\D/g, ""),
		};

		axios({
			method: "PATCH",
			url: process.env.REACT_APP_API + "parent/" + userId,
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
			data: data,
		})
			.then((response) => {
				//console.log(response.data);
				setSnackbarMessage("Successfully updated!");
				setSnackbarSeverity("success");
				handleClickSnackbar();
			})
			.catch(function (err) {
				console.log(err);
				setSnackbarMessage("Error: " + err);
				setSnackbarSeverity("error");
				handleClickSnackbar();
			});
	};

	return (
		<React.Fragment>
			<FormControl>
				<Grid container spacing={1.5}>
					<Grid item xs={12} sm={12} sx={{ textAlign: "center" }}>
						<h1>家長/監護人簡介</h1>
						<h1>Parent/Guardian Profile</h1>
						<Divider style={{ width: "100%" }} />
						<br />
					</Grid>

					{/* Parent Information Section */}
					<Grid item xs={12} sm={12}>
						<h2>家長/監護人資料</h2>
						<h2>Parent/Guardian Information</h2>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							id="parent-username"
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
							id="parent-email"
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
							id="parent-chinese-name"
							label="中文姓名 Chinese Name"
							variant="outlined"
							fullWidth
							onChange={(e) => setChineseName(e.target.value)}
							value={chineseName ? chineseName : ""}
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField
							id="parent-first-name"
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
							id="parent-last-name"
							label="姓 Last Name"
							variant="outlined"
							fullWidth
							required
							onChange={(e) => setLastName(e.target.value)}
							value={lastName ? lastName : ""}
						/>
					</Grid>
					<Grid item xs={12} sm={12}>
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
							onChange={(e) => setProvince(e.target.value)}
							value={province ? province : ""}
						/>
					</Grid>
					<Grid item xs={12} sm={4}>
						<TextField
							id="postal-code"
							label="郵遞區號 Postal Code"
							variant="outlined"
							fullWidth
							required
							onChange={(e) => setPostalCode(e.target.value)}
							value={postalCode ? postalCode : ""}
							InputProps={{
								inputComponent: CanadianPostalCodeMask,
							}}
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
							required
						/>
					</Grid>
					<Grid item xs={12} sm={4}>
						<TextField
							id="home"
							label="住家 Home"
							variant="outlined"
							fullWidth
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
							onChange={(e) => setWork(e.target.value)}
							value={work ? work : ""}
							InputProps={{
								inputComponent: PhoneMask,
							}}
						/>
					</Grid>
					<Grid item xs={12} sm={12}>
						<br />
						<Button className="modify-parent-btn" variant="contained" fullWidth onClick={handleSubmit}>
							Update Profile
						</Button>
					</Grid>
					{/* Child Information Section */}
					<Grid item xs={12} sm={12}>
						<br />
						<Divider style={{ width: "100%" }} />
						<h2>
							<b>子女資料</b>
						</h2>
						<h2>
							<b>Children Information</b>
						</h2>
						{studentData.length === 0 && (
							<Grid item xs={12} sm={12}>
								<Typography variant="h6">No children found</Typography> {/* No children found */}
							</Grid>
						)}
					</Grid>
					{/* Children Information Section */}
					{studentData.map((student, index) => (
						<React.Fragment key={student.studentId}>
							<Grid item xs={12} sm={6} md={4}>
								<Typography variant="h6">
									{student.firstName} {student.lastName} {(student.chineseName && `(${student.chineseName})`) || ""}{" "}
								</Typography>
								<Typography variant="body1">Date of Birth: {student.DoB}</Typography>
								<Typography variant="body1">Gender: {student.gender}</Typography>
								<Typography variant="body1">Medical History: {student.medicalHistory}</Typography>
								<Typography variant="body1">Remark: {student.remark}</Typography>
								<Typography variant="body1">Courses: {student.courses ? student.courses.join(", ") : "N/A"}</Typography>
								{/* view profile */}
								<Button variant="contained" onClick={() => navigate(`/parent/child/profile/${student.studentId}`)}>
									Profile
								</Button>
							</Grid>
							{index < studentData.length - 1 && (
								<Grid item xs={12}>
									<Divider />
								</Grid>
							)}
						</React.Fragment>
					))}
					<Grid item xs={12} sm={12}>
						{/* Navigate to add student form page after storing parent id.*/}
						<Button className="add-child-btn" variant="contained" fullWidth onClick={addNewChild}>
							Add New Child
						</Button>
					</Grid>
					{/* Notifications */}
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
