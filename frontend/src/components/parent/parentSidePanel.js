import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import EmailIcon from "@mui/icons-material/Email";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import ViewListIcon from "@mui/icons-material/ViewList";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import ClassIcon from "@mui/icons-material/Class";
import EscalatorWarningIcon from "@mui/icons-material/EscalatorWarning";

export function MainListItems() {
	const navigate = useNavigate();

	return (
		<React.Fragment>
			<ListItemButton onClick={() => navigate("/parent/dashboard")}>
				<ListItemIcon>
					<HomeIcon />
				</ListItemIcon>
				<ListItemText primary="Dashboard" />
			</ListItemButton>
			<ListItemButton id="add-student-nav-button" onClick={() => navigate("/parent/student/register")}>
				<ListItemIcon>
					<PersonAddAlt1Icon />
				</ListItemIcon>
				<ListItemText primary="Register Child" />
			</ListItemButton>
			<ListItemButton onClick={() => navigate("/parent/profile/")}>
				<ListItemIcon>
					<EscalatorWarningIcon />
				</ListItemIcon>
				<ListItemText id="add-parent-nav-button" primary="View Profile" />
			</ListItemButton>
		</React.Fragment>
	);
}
