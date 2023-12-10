import React, { useState, useEffect } from "react";
import { FormControl, InputLabel } from "@material-ui/core";
import axios from "axios";
import {
	TextField,
	Button,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	FormControlLabel,
	Checkbox,
} from "@mui/material";
import DatePicker from "react-multi-date-picker";

function Calendar() {
	const [academicYear, setAcademicYear] = useState("");
	const [calendarDays, setCalendarDays] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [startDate, setStartDate] = useState("");
	const [numWorkDays, setnumWorkDays] = useState("");
	const [holiday, setholiday] = useState("");
	const [editingIndex, setEditingIndex] = useState(-1);
	const [newDescription, setNewDescription] = useState("");
	const [editDate, setEditDate] = useState("");

	useEffect(() => {
		async function fetchDefaultAcademicYear() {
			try {
				const response = await axios({
					method: "get",
					url: process.env.REACT_APP_API + "years/current/",
					headers: {
						Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
					},
				});
				setAcademicYear(response.data.academic_year);
			} catch (error) {
				console.error(error);
			}
		}

		fetchDefaultAcademicYear();
	}, []);

	const handleHolidayChange = (e, index) => {
		const newcalendarDays = [...calendarDays];
		newcalendarDays[index].holiday = e.target.checked;
		setCalendarDays(newcalendarDays);
	};

	const config = {
		headers: {
			Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
		},
	};

	const handleSave = (index, day) => {
		setEditDate(day.Date);
		const patchUrl = process.env.REACT_APP_API + "calendars/calendar/generator";
		axios({
			method: "patch",
			url: patchUrl,
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
			data: {
				academicYear: academicYear,
				Date: day.Date,
				holiday: calendarDays[index].holiday,
				comment: newDescription,
			},
		}).then((a) => {
			const urlGet = process.env.REACT_APP_API + `calendars/calendar/${academicYear}`;

			axios({
				method: "get",
				url: urlGet,
				headers: {
					Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
				},
			}).then((a) => {
				setCalendarDays([]);
				setCalendarDays(a.data.days);
			});
		});

		setEditingIndex(-1);
		setNewDescription("");
	};

	const handleAcademicYearSubmit = async (e) => {
		e.preventDefault();
		setCalendarDays([]);
		try {
			const url = process.env.REACT_APP_API + `calendars/calendar/${academicYear}`;
			const response = await axios.get(url, config);
			setCalendarDays(response.data.days);
			setShowForm(false);
		} catch (error) {
			if (error.response && error.response.status === 404) {
				setShowForm(true);
				setStartDate("");
				setnumWorkDays("");
				setholiday("");
			} else {
				console.error(error);
			}
		}
	};

	const handleCalendarFormSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = process.env.REACT_APP_API + `calendars/calendar/`;
			const markedHolidays = [];
			if (holiday) {
				holiday.map((a) => {
					let month = "";
					if (a.month < 10) month = `0${a.month}`;
					else month = a.month;
					let day = "";
					if (a.day < 10) day = `0${a.day}`;
					else day = a.day;
					let strDate = `${a.year}-${month}-${day}`;
					markedHolidays.push(strDate);
				});
			}
			await axios({
				method: "post",
				url: url,
				headers: {
					Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
				},
				data: {
					startDate,
					numWorkDays,
					holiday: markedHolidays,
					academicYear,
				},
			});
			const url2 = process.env.REACT_APP_API + `calendars/calendar/${academicYear}`;
			const response = await axios.get(url2, config);
			setCalendarDays(response.data.days);
			setShowForm(false);
		} catch (error) {
			console.error(error);
		}
	};

	const pdfUrl = process.env.REACT_APP_API + `calendars/calendar/${academicYear}/pdf`;
	const generatePDF = () => {
		const pdfGenerateUrl = process.env.REACT_APP_API + `calendars/calendar/pdfGenerator`;
		axios({
			method: "post",
			url: pdfGenerateUrl,
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
			data: {
				academicYear,
			},
		});
	};
	return (
		<div>
			<h1>Calendar Page</h1>
			<form onSubmit={handleAcademicYearSubmit}>
				<TextField
					id="academicYearInput"
					label="Academic Year"
					type="number"
					variant="outlined"
					value={academicYear}
					onChange={(e) => setAcademicYear(e.target.value)}
				/>
				<Button variant="contained" type="submit" sx={{ ml: 2 }}>
					Get Calendar
				</Button>
				{!showForm && (
					<Button variant="contained" sx={{ ml: 2 }} onClick={() => generatePDF()}>
						Generate PDF
					</Button>
				)}
				{!showForm && (
					<Button variant="contained" sx={{ ml: 2 }} onClick={() => window.open(pdfUrl, "_blank")}>
						View PDF
					</Button>
				)}
			</form>
			{showForm ? null : (
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Description</TableCell>
							<TableCell>Date</TableCell>
							<TableCell>Holiday</TableCell>
							<TableCell></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{calendarDays.map((day, index) => (
							<TableRow key={index}>
								<TableCell>
									{editingIndex === index ? (
										<TextField value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
									) : (
										day.description
									)}
								</TableCell>
								<TableCell>{day.Date}</TableCell>
								<TableCell>
									{editingIndex === index ? (
										<FormControlLabel
											control={
												<Checkbox
													checked={calendarDays[index].holiday}
													onChange={(e) => handleHolidayChange(e, editingIndex)}
												/>
											}
											label={calendarDays[index].holiday ? "Yes" : "No"}
										/>
									) : day.holiday ? (
										"Yes"
									) : (
										"No"
									)}
								</TableCell>
								<TableCell>
									{editingIndex === index ? (
										<Button variant="contained" color="primary" onClick={() => handleSave(index, day)}>
											Save
										</Button>
									) : (
										<Button variant="contained" color="secondary" onClick={() => setEditingIndex(index)}>
											Edit
										</Button>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
			{showForm && (
				<form onSubmit={handleCalendarFormSubmit}>
					<TextField
						id="startDateInput"
						label="Start Date"
						InputLabelProps={{ shrink: true }}
						type="date"
						variant="outlined"
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
						sx={{ mt: 2 }}
					/>
					<br />
					<TextField
						id="numWorkDaysInput"
						label="Number of Days"
						type="number"
						variant="outlined"
						value={numWorkDays}
						onChange={(e) => setnumWorkDays(e.target.value)}
						inputProps={{ min: 1 }}
						sx={{ mt: 2 }}
					/>
					<br />
					<FormControl variant="outlined">
						<InputLabel htmlFor="holidayInput">{holiday ? "" : "Select Holidays"}</InputLabel>
						<DatePicker
							id="holidayInput"
							value={holiday}
							onChange={setholiday}
							InputLabelProps={{
								shrink: true,
							}}
							style={{ margin: "1rem 0" }}
							multiple
						/>
					</FormControl>

					<br />
					<Button variant="contained" type="submit" sx={{ mt: 2 }}>
						Create Calendar
					</Button>
				</form>
			)}
		</div>
	);
}

export default Calendar;
