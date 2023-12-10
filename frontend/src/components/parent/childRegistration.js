import * as React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import { MenuItem, Divider, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import dayjs from "dayjs";
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
export default function StudentForm() {
	// form for creating a new student
	const navigate = useNavigate();
	const [gender, setGender] = React.useState("");
	const [studentDOB, setStudentDOB] = React.useState(null);
	const [firstName, setFirstName] = React.useState(null);
	const [lastName, setLastName] = React.useState(null);
	const [chineseName, setChineseName] = React.useState(null);
	const [address, setAddress] = React.useState(null);
	const [city, setCity] = React.useState("Edmonton");
	const [province, setProvince] = React.useState("Alberta");
	const [postalCode, setPostalCode] = React.useState(null);
	const [medicalHistory, setMedicalHistory] = React.useState("");
	const [remark, setRemark] = React.useState("");
	const [courseSelection, setCourseSelection] = React.useState("");
	const [foip, setFoip] = React.useState("");
	const [parentID, setParentID] = React.useState(null);
	const [courses, setCourses] = React.useState([]);
	const [openSnackbar, setOpenSnackbar] = React.useState(false);
	const [snackbarMessage, setSnackbarMessage] = React.useState("Success!");
	const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");

	// snackbar notifications
	const handleClickSnackbar = () => {
		setOpenSnackbar(true);
	};

	const handleCloseSnackbar = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpenSnackbar(false);
	};

	const handleFoipChange = (event) => {
		setFoip(event.target.value);
		//console.log(foip);
	};

	const handleCourseSelection = (event) => {
		setCourseSelection(event.target.value);
		//console.log(courses[event.target.value]);
	};

	const handleChangeGender = (event) => {
		setGender(event.target.value);
		//console.log(event.target.value);
	};

	const handleSubmit = () => {
		// check if calendar values are null
		if (studentDOB === null) {
			setSnackbarMessage("Error: Please select a date of birth");
			setSnackbarSeverity("error");
			handleClickSnackbar();
			return;
		}
		const formattedDate = dayjs(studentDOB).format("YYYY-MM-DD");
		// immutable
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
			method: "POST",
			url: process.env.REACT_APP_API + "students/",
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
			data: data,
		})
			.then((response) => {
				let newStudentID = response.data.id;
				// if there is a course selection, then add the student to the course
				if (courseSelection !== "") {
					axios({
						method: "PATCH",
						url: process.env.REACT_APP_API + "course/enroll/" + courses[courseSelection].id,
						headers: {
							Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
						},
						data: {
							studentIds: [response.data.id],
						},
					})
						.then((response) => {
							navigate("/parent/child/profile/" + newStudentID);
						})
						.catch(function (err) {
							console.log(err);
							navigate("/parent/child/profile/" + newStudentID);
						});
				} else {
					navigate("/parent/child/profile/" + newStudentID);
				}
			})
			.catch(function (err) {
				// handle error
				console.log(err);
				setSnackbarMessage("Error:" + err.response.request.response);
				setSnackbarSeverity("error");
				handleClickSnackbar();
			});
	};

	// get current user id
	const setParentId = () => {
		let Id = jwtDecode(JSON.parse(localStorage.getItem("authTokens"))["access"])["user_id"];

		setParentID(Id);
	};

	// get courses for course selection
	const getCourses = () => {
		axios({
			method: "GET",
			url: process.env.REACT_APP_API + "course/current/",
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
		})
			.then((response) => {
				setCourses(response.data);
			})
			.catch(function (err) {
				// handle error
				setSnackbarMessage("Error:" + err.response.request.response);
				setSnackbarSeverity("error");
				handleClickSnackbar();
				console.log(err);
			});
	};

	useEffect(() => {
		setParentId();
		getCourses();
	}, []);

	return (
		<React.Fragment>
			{/* snackbar notifications */}
			<Snackbar open={openSnackbar} autoHideDuration={2000} onClose={handleCloseSnackbar}>
				<Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
					{snackbarMessage}
				</Alert>
			</Snackbar>
			<FormControl>
				<Grid container spacing={1.5}>
					<Grid item xs={12} sm={12} sx={{ textAlign: "center" }}>
						<h1>學生登記表</h1>
						<h1>Student Registration Form</h1>
						<Divider style={{ width: "100%" }} />
						<br />
					</Grid>

					{/* Student Information Section */}
					<Grid item xs={12} sm={12}>
						<h2>學生資料（申請人必須在本年九月滿四歲）</h2>
						<h2>Student Information (applicant must be at least 4 years of age in this September)</h2>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							id="student-chinese-name"
							label="中文姓名 Name in Chinese"
							variant="outlined"
							fullWidth
							required
							onChange={(e) => setChineseName(e.target.value)}
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
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<div id="dob-picker" className="customDatePickerWidth">
								<DatePicker
									id="student-dob"
									className="student-dob-picker"
									label="出生日期 Date of Birth"
									inputFormat="YYYY-MM-DD"
									views={["year", "month", "day"]}
									value={studentDOB}
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
							<MenuItem id="other-option" value="other">
								Other 其他
							</MenuItem>
						</TextField>
					</Grid>
					<Grid item xs={12} sm={12}>
						<TextField
							id="address"
							label="地址 Address"
							variant="outlined"
							fullWidth
							required
							onChange={(e) => setAddress(e.target.value)}
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
							value={province}
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
						/>
					</Grid>
					<Grid item xs={12} sm={12}>
						<TextField
							id="remark-info"
							label="評論 Remarks"
							variant="outlined"
							fullWidth
							onChange={(e) => setRemark(e.target.value)}
						/>
					</Grid>
					<Grid item xs={12} sm={12}>
						<br />

						<Divider style={{ width: "100%" }} />
					</Grid>
					<Grid item xs={12} sm={12}>
						<br />
						<label>
							<b>课程 Course </b>
						</label>
						<br />
					</Grid>
					<Grid item xs={12} sm={12}>
						<Typography variant="body1">
							Select a course to take. Displayed in the format of: Course Name - Course Language - Grade - Year
						</Typography>
						<Typography variant="body1">選擇要參加的課程. 顯示格式為: 課程名稱-課程語言-年級-年份</Typography>
					</Grid>
					<Grid item xs={12} sm={12}>
						<TextField
							id="select-course"
							label="Select course to assign to student"
							value={courseSelection}
							onChange={handleCourseSelection}
							select
							fullWidth
						>
							{courses.map((course, index) => (
								<MenuItem key={index} value={index}>
									{course.courseName +
										" - " +
										course.courseLanguage +
										" - " +
										course.grade +
										" - " +
										`${course.academicYear}-${(course.academicYear % 100) + 1}`}
								</MenuItem>
							))}
						</TextField>
					</Grid>

					{/* Parent/Guardian Information Section */}
					{/* <Grid item xs={12} sm={12}>
						<br />
						<label>
							<b>家長/監護人 Add Parent/Guardian </b>
						</label>
						<br />
					</Grid>
					<Grid item xs={12} sm={12}>
						<TextField
							id="parent-id"
							label="ID of Parent"
							variant="outlined"
							fullWidth
							disabled
							onChange={(e) => setParentID(e.target.value)}
							value={parentID ? parentID : ""}
						/>
					</Grid> */}
					{/* FOIP  */}
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
						<p>你是否同意樂活中文學校刊登你孩子的個人资料,照片和作品作宣傳用途</p>
						<p>
							Do you consent to the use of your child's personal information, images, and school work for school
							promotion, displays, and on the school's website?{" "}
						</p>
					</Grid>
					<Grid item xs={12} sm={12}>
						<RadioGroup
							row
							aria-labelledby="media-consent-radio-buttons-group-label"
							name="foip_form"
							onChange={handleFoipChange}
						>
							<FormControlLabel id="consent-yes-radio" value="true" control={<Radio />} label="同意 I consent" />
							<FormControlLabel value="false" control={<Radio />} label="不同意 I do not consent" />
						</RadioGroup>
					</Grid>
					{/* end of fields */}
					<Grid item xs={12} sm={12}>
						<br />
						<Button id="register-student-btn" variant="contained" fullWidth onClick={handleSubmit}>
							Register Student
						</Button>
					</Grid>
				</Grid>
			</FormControl>
		</React.Fragment>
	);
}
