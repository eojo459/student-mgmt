import { useState, useEffect } from "react";
import { Container, Typography, Button } from "@mui/material";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { Grid } from "@mui/material";
import Paper from "@mui/material/Paper";
// import marked from 'marked';
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";

function NewsletterPage({ match }) {
	const navigate = useNavigate();
	const [title, setTitle] = useState("");
	const [date, setDate] = useState("");
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(true);
	const [isLatest, setIsLatest] = useState(false);
	const { id } = useParams();
	const defaultContent = "No newsletter found for this date. Come back later?";

	useEffect(() => {
		async function getNewsletter() {
			try {
				// check if we have latest in the link
				if (id === "latest") {
					// get the latest newsletter
					const response = await axios.get(process.env.REACT_APP_API + "newsletters/latest/");
					navigate("/newsletter/" + response.data["id"]);
				}
				const response = await axios.get(process.env.REACT_APP_API + `newsletters/${id}/`);
				const { title, date, content } = response.data;
				setTitle(title);
				setDate(date);
				setContent(content);
				setLoading(false);
			} catch (error) {
				console.error(error);
				setTitle("No Newsletter Found!");
				setDate("1980-01-01");
				setContent(defaultContent);
				setLoading(false);
			}
		}

		getNewsletter();
	}, [id]);

	// if there was no current newsletter, then there will not be a next one

	const nextId = content === defaultContent ? null : parseInt(id) + 1;
	const prevId = id - 1;
	// const md = markdown();

	const useStyles = makeStyles((theme) => ({
		paper: {
			width: "75%",
			margin: "0 auto",
			padding: 40,
			overflow: "auto",
		},
	}));

	const classes = useStyles();

	return (
		<>
			<Toolbar sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Grid container alignItems="center">
					<Grid item xm={4} xs={4}>
						<img src={process.env.PUBLIC_URL + "/media/Logo.jpg"} alt="NCA Logo" style={{ width: "75%" }} />
					</Grid>
					<Grid item xm={4} xs={4}>
						<Typography component="h2" variant="h5" color="inherit" align="center" noWrap>
							{"Norwood Chinese Association Newsletter"}
						</Typography>
					</Grid>
					<Grid item xm={4} xs={4} sx={{ textAlign: "right" }}>
						<Button variant="outlined" size="small" component={Link} to={`/`}>
							Dashboard
						</Button>
					</Grid>
				</Grid>
			</Toolbar>
			<Toolbar component="nav" variant="dense" sx={{ justifyContent: "space-between", overflowX: "auto" }}></Toolbar>
			<Paper className={classes.paper}>
				<ReactMarkdown>{`# ${title}!`}</ReactMarkdown>
				<ReactMarkdown>{`## *${date}!*`}</ReactMarkdown>
				<ReactMarkdown
					components={{
						img: ({ src, alt }) => <img src={src} alt={alt} style={{ width: "300px", height: "300px" }} />,
					}}
				>
					{content}
				</ReactMarkdown>

				<div>
					{prevId >= 1 && (
						<Button component={Link} to={`/newsletter/${prevId}`}>
							Previous Newsletter
						</Button>
					)}
					{nextId && (
						<Button component={Link} to={`/newsletter/${nextId}`}>
							Next Newsletter
						</Button>
					)}
				</div>
			</Paper>
		</>
	);
}

export default NewsletterPage;
