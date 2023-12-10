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
import axios from "axios";
import { useParams } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, Typography } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import dayjs from "dayjs";
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
const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function StudentForm() {
	const { id } = useParams();

	const [gender, setGender] = React.useState("");
	const [studentDOB, setStudentDOB] = React.useState(null);
	const [firstName, setFirstName] = React.useState(null);
	const [lastName, setLastName] = React.useState(null);
	const [chineseName, setChineseName] = React.useState(null);
	const [address, setAddress] = React.useState(null);
	const [city, setCity] = React.useState(null);
	const [province, setProvince] = React.useState(null);
	const [postalCode, setPostalCode] = React.useState(null);
	const [medicalHistory, setMedicalHistory] = React.useState("");
	const [remark, setRemark] = React.useState("");
	const [foip, setFoip] = React.useState("");
	const [courseId, setCourseId] = React.useState("");
	const [courseData, setCourseData] = React.useState([]);
	// for snackbar notifications
	const [openSnackbar, setOpenSnackbar] = React.useState(false);
	const [snackbarMessage, setSnackbarMessage] = React.useState("Success!");
	const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");
	const [approved, setApproved] = React.useState(true);

	const navigate = useNavigate();
	const [profilePicture, setProfilePicture] = React.useState("");

	const handleClickSnackbar = () => {
		setOpenSnackbar(true);
	};

	const handleCloseSnackbar = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpenSnackbar(false);
	};

	React.useEffect(() => {
		getStudent();
	}, []);

	const getStudent = () => {
		// for getting the current student
		axios({
			method: "get",
			// todo
			url: process.env.REACT_APP_API + "students/" + id,
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
		})
			.then((response) => {
				getCourses(response.data.courses);
				setGender(response.data.gender);
				// add a day to the date of birth because of weird localization provider
				setStudentDOB(new Date(response.data.DoB).setDate(new Date(response.data.DoB).getDate() + 1));
				setFirstName(response.data.firstName);
				setLastName(response.data.lastName);
				setChineseName(response.data.chineseName);
				setAddress(response.data.address);
				setCity(response.data.city);
				setProvince(response.data.province);
				setPostalCode(response.data.postalCode);
				setMedicalHistory(response.data.medicalHistory);
				setRemark(response.data.remark);
				setFoip(response.data.foip);
				setApproved(response.data.approved);
				setProfilePicture(response.data.profilePicture);
			})
			.catch(function (err) {
				console.log(err);
				setSnackbarMessage("Error: " + err);
				setSnackbarSeverity("error");
				handleClickSnackbar();
			});
	};

	const getCourses = (courseIds) => {
		// getting student marks
		var data = {
			courseIds: courseIds,
		};
		axios({
			method: "get",
			// todo
			url: process.env.REACT_APP_API + "students/" + id + "/marks",
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
			params: data,
		})
			.then((response) => {
				//console.log(response.data);
				setCourseData(response.data);
			})
			.catch((err) => {
				console.log(err);
				setSnackbarMessage("Error: " + err);
				setSnackbarSeverity("error");
				handleClickSnackbar();
			});
	};

	const handleFoipChange = (event) => {
		setFoip(event.target.value);
	};

	const handleChangeGender = (event) => {
		setGender(event.target.value);
	};

	const handleSubmit = () => {
		// for updating student
		const formattedDate = dayjs(studentDOB).format("YYYY-MM-DD");

		var data = {
			firstName: firstName,
			lastName: lastName,
			chineseName: chineseName,
			address: address,
			city: city,
			province: province,
			postalCode: postalCode.toUpperCase().replace(/-/g, ""),
			DoB: formattedDate,
			gender: gender,
			medicalHistory: medicalHistory,
			remark: remark,
			foip: foip,
		};

		axios({
			method: "PATCH",
			url: process.env.REACT_APP_API + "students/" + id,
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
			data: data,
		})
			.then((response) => {
				// snackbar confirmation
				setSnackbarMessage("Student updated successfully!");
				setSnackbarSeverity("success");
				handleClickSnackbar();
			})
			.catch(function (err) {
				console.log(err);
			});
	};

	const handleAddCourse = () => {
		// for updating a students marks
		axios({
			method: "PATCH",
			url: process.env.REACT_APP_API + "course/enroll/" + courseId,
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
			data: {
				studentIds: [id],
			},
		})
			.then((response) => {
				// refresh page to show new data
				window.location.reload();
			})
			.catch(function (err) {
				console.log(err);
				setSnackbarMessage("Error: " + err);
				setSnackbarSeverity("error");
				handleClickSnackbar();
			});
	};

	const handleTextFieldChange = (event, index, key) => {
		// for student comment updating
		const newCourseData = [...courseData];
		newCourseData[index][key] = event.target.value;
		setCourseData(newCourseData);
	};

	const handleStatusChange = (event, index) => {
		// for student mark status updating
		const newCourseData = [...courseData];
		newCourseData[index].status = event.target.value;
		setCourseData(newCourseData);
	};

	const handleUpdateMark = (rowIndex) => {
		// for student mark updating
		const updatedRow = courseData[rowIndex];
		// send API request to update mark using updatedRow.mark

		axios({
			method: "PATCH",
			url: process.env.REACT_APP_API + "students/" + id + "/marks/" + updatedRow.id,
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
			data: {
				mark: updatedRow.mark,
				status: updatedRow.status,
				comment: updatedRow.comment,
			},
		})
			.then((response) => {
				setSnackbarMessage(response.data["message"]);
				setSnackbarSeverity("success");
				handleClickSnackbar();
			})
			.catch(function (err) {
				setSnackbarMessage("Error: " + err);
				setSnackbarSeverity("error");
				handleClickSnackbar();
			});
	};

	const approveStudent = () => {
		// for approving student
		axios({
			method: "PATCH",
			url: process.env.REACT_APP_API + "students/unapproved/" + id,
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
			data: {
				approved: true,
				disabled: false,
			},
		})
			.then((response) => {
				// refresh page to show new data
				window.location.reload();
			})
			.catch(function (err) {
				console.log(err);
				setSnackbarMessage("Error: " + err);
				setSnackbarSeverity("error");
				handleClickSnackbar();
			});
	};

	const deleteStudent = () => {
		// for deleting student
		axios({
			method: "DELETE",
			url: process.env.REACT_APP_API + "students/unapproved/" + id,
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
		})
			.then((response) => {
				// navigate to other page
				navigate(-1);
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
			<Grid container spacing={1.5}>
				<Grid item xs={12} sm={12} sx={{ textAlign: "center" }}>
					<h1>{chineseName ? chineseName + " - " : "test"} 學生簡介</h1>
					<h1>{firstName + " " + lastName + " - "} Student Profile</h1>
					<Divider style={{ width: "100%" }} />
					<br />
				</Grid>
				{/* Student Profile Picture Section */}
				<Grid item xs={12} sm={12}>
					<h2>學生合影</h2>
					<h2>Student Picture</h2>
				</Grid>
				<Grid item xs={12} sm={12} mb={3}>
					<img
						src={process.env.REACT_APP_API.replace("/api/", "") + profilePicture}
						alt="student profile picture"
						width="200"
						height="200"
					></img>
				</Grid>
				{/* Student Information Section */}
				<Grid item xs={12} sm={12}>
					<h2>學生資料</h2>
					<h2>Student Information</h2>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						id="student-chinese-name"
						label="中文姓名 Name in Chinese"
						variant="outlined"
						fullWidth
						required
						onChange={(e) => setChineseName(e.target.value)}
						value={chineseName ? chineseName : ""}
					/>
				</Grid>
				<Grid item xs={12} sm={3}>
					<TextField
						id="student-first-name"
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
						id="student-last-name"
						label="姓 Last Name"
						variant="outlined"
						fullWidth
						required
						onChange={(e) => setLastName(e.target.value)}
						value={lastName ? lastName : ""}
					/>
				</Grid>
				<Grid item xs={12} sm={3}>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<div className="customDatePickerWidth">
							<DatePicker
								id="student-dob"
								label="出生日期 Date of Birth"
								value={new Date(studentDOB)}
								onChange={(newDate) => {
									setStudentDOB(newDate);
								}}
								renderInput={(params) => <TextField {...params} />}
								required
							/>
						</div>
					</LocalizationProvider>
				</Grid>
				{/* PROBABLY DONT NEED since we have birthdate
					<Grid item xs={12} sm={3}>
						<TextField id="age" label="年齡 Age" variant="outlined" type="number" fullWidth required />
					</Grid>
                    */}
				<Grid item xs={12} sm={6}>
					<FormControl component="fieldset" fullWidth>
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
							<MenuItem value="other">Other 其他</MenuItem>
						</TextField>
					</FormControl>
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
						select
						value={province ? province : ""}
						onChange={(e) => setProvince(e.target.value)}
						defaultValue="Alberta"
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
						id="postal-code"
						label="郵遞區號 Postal Code"
						variant="outlined"
						fullWidth
						required
						value={postalCode ? postalCode : ""}
						InputProps={{
							inputComponent: CanadianPostalCodeMask,
							onChange: (event) => {
								event.target.value = event.target.value.toUpperCase();
								setPostalCode(event.target.value);
							},
						}}
					/>
				</Grid>
				<Grid item xs={12} sm={12}>
					<TextField
						id="medical-history"
						label="健康狀況或有何種過敏 Medical History/Allergies"
						variant="outlined"
						fullWidth
						onChange={(e) => setMedicalHistory(e.target.value)}
						value={medicalHistory ? medicalHistory : ""}
					/>
				</Grid>
				<Grid item xs={12} sm={12}>
					<TextField
						id="remark-info"
						label="評論 Remarks"
						variant="outlined"
						fullWidth
						onChange={(e) => setRemark(e.target.value)}
						value={remark ? remark : ""}
					/>
				</Grid>
				<Grid item xs={12} sm={12}>
					<br />
					<Divider style={{ width: "100%" }} />
					<h2>
						<b>私隱聲明</b>
					</h2>
					<h2>
						<b>FOIP & Media Consent</b>
					</h2>
				</Grid>
				<Grid item xs={12} sm={12}>
					<FormControl component="fieldset" fullWidth>
						<RadioGroup
							row
							aria-labelledby="media-consent-radio-buttons-group-label"
							name="foip_form"
							onChange={handleFoipChange}
							value={foip}
						>
							<FormControlLabel value="true" control={<Radio />} label="同意 I consent" />
							<FormControlLabel value="false" control={<Radio />} label="不同意 I do not consent" />
						</RadioGroup>
					</FormControl>
				</Grid>
				{/* If a student is approved, show option to update student. Else, show option to approve/delete*/}
				{approved ? (
					<Grid item xs={12} sm={12}>
						<br />
						<Button variant="contained" fullWidth onClick={handleSubmit}>
							Update Student
						</Button>
					</Grid>
				) : (
					<>
						<Grid item xs={12} sm={12}>
							<Typography variant="body1" color="error">
								<b>Note: Student information has not yet been approved. Please wait for admin approval.</b>
							</Typography>
							<Typography variant="body1" color="error">
								<b>注意：学生信息还没有被批准。请等待管理员的批准。</b>
							</Typography>
						</Grid>
						<Grid item xs={6} sm={6}>
							<Button variant="contained" fullWidth disabled onClick={approveStudent} color="success">
								Approve Student
							</Button>
						</Grid>
						<Grid item xs={6} sm={6}>
							<Button variant="contained" fullWidth disabled onClick={deleteStudent} color="error">
								Delete Student
							</Button>
						</Grid>
					</>
				)}
				{/* Academic History/Courses/Marks */}
				<Grid item xs={12} sm={12}>
					<br />
					<Divider style={{ width: "100%" }} />
					<h2>
						<b>學術史</b>
					</h2>
					<h2>
						<b>Academic History</b>
					</h2>
				</Grid>
				{/* Display list of courses*/}
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell width="100">Language</TableCell>
								<TableCell width="75">Year</TableCell>
								<TableCell width="50">Grade</TableCell>
								<TableCell width="150">Name</TableCell>
								<TableCell width="150">Status</TableCell>
								<TableCell width="50">Mark</TableCell>
								<TableCell width="200">Comment</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{courseData.map((row, index) => (
								<TableRow key={row.id}>
									<TableCell width="100">{row.courseLanguage}</TableCell>
									<TableCell width="75">{`${row.academicYear}-${(row.academicYear % 100) + 1}`}</TableCell>
									<TableCell width="50">{row.grade}</TableCell>
									<TableCell width="150">{row.courseName}</TableCell>
									<TableCell align="right" width="75">
										<FormControl component="fieldset" fullWidth>
											<Select
												value={row.status}
												onChange={(event) => handleStatusChange(event, index)}
												style={{ textAlign: "left", width: "100%" }}
												disabled
											>
												<MenuItem value="Enrolled">Enrolled</MenuItem>
												<MenuItem value="Completed">Completed</MenuItem>
												<MenuItem value="Dropped">Dropped</MenuItem>
											</Select>
										</FormControl>
									</TableCell>
									<TableCell align="right" width="50">
										<TextField value={row.mark} disabled />
									</TableCell>
									<TableCell align="right" width="200">
										<TextField value={row.comment} disabled />
									</TableCell>
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
		</React.Fragment>
	);
}
