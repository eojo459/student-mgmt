import * as React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import { MenuItem, Divider, InputLabel, Typography } from "@mui/material";
import { useEffect } from "react";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import ImageIcon from "@mui/icons-material/Image";
import VideoIcon from "@mui/icons-material/VideoLibrary";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Box from "@mui/material/Box";
import ReactMarkdown from "react-markdown";

const Container = styled("div")({
	display: "flex",
	flexDirection: "column",
	alignItems: "flex-start",
	padding: "10px",
	border: "1px solid #ccc",
	borderRadius: "4px",
});

const Input = styled(InputBase)({
	marginTop: "10px",
	width: "100%",
});

const ButtonContainer = styled("div")({
	display: "flex",
	justifyContent: "flex-start",
	marginBottom: "10px",
});

export default function NewsletterForm() {
	// form for creating a newsletter
	const navigate = useNavigate();

	const [message, setMessage] = React.useState("");
	const [title, setTitle] = React.useState("");
	const [openSnackbar, setOpenSnackbar] = React.useState(false);
	const [snackbarMessage, setSnackbarMessage] = React.useState("Success!");
	const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");
	const [showMarkdown, setShowMarkdown] = React.useState(false);

	const handleToggleMarkdown = () => {
		setShowMarkdown(!showMarkdown);
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

	const handleImageClick = () => {
		// Add Markdown for image insertion
		setMessage(`${message}\n\n![Alt text](https://via.placeholder.com/150)`);
	};

	const handleVideoClick = () => {
		// Add Markdown for video insertion
		setMessage(
			`${message}\n\n[![Alt text](https://img.youtube.com/vi/VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=VIDEO_ID)`
		);
	};

	// axios request for creating new course
	const handleSubmit = () => {
		var data = {
			title: title,
			content: message,
			// date: new Date().toISOString().split("T")[0],
		};

		axios({
			method: "post",
			url: process.env.REACT_APP_API + "newsletters/",
			headers: {
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("authTokens"))["access"],
			},
			data: data,
		})
			.then((response) => {
				setSnackbarMessage("Newsletter Created!");
				setSnackbarSeverity("success");
				handleClickSnackbar();
				navigate("/newsletter/" + response.data["id"]);
			})
			.catch((error) => {
				console.log(error);
				setSnackbarMessage("Error: " + error.response.request.response);
				setSnackbarSeverity("error");
				handleClickSnackbar();
			});
	};

	return (
		<React.Fragment>
			<FormControl>
				<Grid container spacing={1.5}>
					<Grid item xs={12} sm={12} sx={{ textAlign: "center" }}>
						<h1>通訊創建表</h1>
						<h1>Newsletter Creation Form</h1>
						<Divider style={{ width: "100%" }} />
						<br />
					</Grid>
					{/* Parent Information Section */}
					<Grid item xs={12} sm={12}>
						<TextField
							id="newsletter-title"
							label="Newsletter Title"
							variant="outlined"
							fullWidth
							required
							onChange={(e) => setTitle(e.target.value)}
						/>
					</Grid>
					<Grid item xs={12} sm={12}>
						<Container>
							<ButtonContainer>
								<Button onClick={handleImageClick}>
									<ImageIcon />
									Add Image
								</Button>
								<Divider orientation="vertical" flexItem />
								<Button onClick={handleVideoClick}>
									<VideoIcon />
									Add Video
								</Button>
								<Divider orientation="vertical" flexItem />
								<Button onClick={handleToggleMarkdown}>{showMarkdown ? "Hide Preview" : "Show Preview"}</Button>
								<Divider orientation="vertical" flexItem />
							</ButtonContainer>
							{showMarkdown && (
								<React.Fragment>
									<Divider style={{ width: "100%" }} />
									<Typography variant="h6">{title}</Typography>
									<Divider style={{ width: "100%" }} />
									<ReactMarkdown
										components={{
											img: ({ src, alt }) => <img src={src} alt={alt} style={{ width: "300px", height: "300px" }} />,
										}}
									>
										{message}
									</ReactMarkdown>
								</React.Fragment>
							)}
							{!showMarkdown && (
								<Input
									id="newsletter-content"
									placeholder="Type your Markdown text here"
									multiline
									rowsMax={Infinity} // Set the maximum number of rows to control the height
									value={message}
									onChange={(e) => setMessage(e.target.value)}
								/>
							)}
						</Container>
					</Grid>
					<Grid item xs={12} sm={12}>
						<br />
						<Button id="create-newsletter-btn" variant="contained" fullWidth onClick={handleSubmit}>
							Create Newsletter
						</Button>
					</Grid>
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
