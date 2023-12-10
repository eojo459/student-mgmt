import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import EmailIcon from "@mui/icons-material/Email";
import Calendar from "@mui/icons-material/CalendarMonth";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import ViewListIcon from "@mui/icons-material/ViewList";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import ClassIcon from "@mui/icons-material/Class";
import EscalatorWarningIcon from "@mui/icons-material/EscalatorWarning";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import SchoolTwoToneIcon from "@mui/icons-material/SchoolTwoTone";
import MenuBookTwoToneIcon from "@mui/icons-material/MenuBookTwoTone";
import WcTwoToneIcon from "@mui/icons-material/WcTwoTone";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SettingsIcon from "@mui/icons-material/Settings";

export function MainListItems() {
	const navigate = useNavigate();

	return (
		<React.Fragment>
			<ListItemButton onClick={() => navigate("/admin-dashboard")}>
				<ListItemIcon>
					<HomeIcon />
				</ListItemIcon>
				<ListItemText primary="Dashboard" />
			</ListItemButton>
			<ListItemButton id="add-student-nav-button" onClick={() => navigate("/student-form")}>
				<ListItemIcon>
					<PersonAddAlt1Icon />
				</ListItemIcon>
				<ListItemText primary="Add Student" />
			</ListItemButton>
			<ListItemButton onClick={() => navigate("/parent-form")}>
				<ListItemIcon>
					<EscalatorWarningIcon />
				</ListItemIcon>
				<ListItemText id="add-parent-nav-button" primary="Add Parent" />
			</ListItemButton>
			<ListItemButton onClick={() => navigate("/teacher-form")}>
				<ListItemIcon>
					<PersonAddAltIcon />
				</ListItemIcon>
				<ListItemText id="add-teacher-nav-button" primary="Add Teacher" />
			</ListItemButton>
			<ListItemButton onClick={() => navigate("/course-form")}>
				<ListItemIcon>
					<ClassIcon />
				</ListItemIcon>
				<ListItemText primary="Create Course" />
			</ListItemButton>
			<ListItemButton onClick={() => navigate("/student-list")}>
				<ListItemIcon>
					<SchoolTwoToneIcon />
				</ListItemIcon>
				<ListItemText primary="View Students" />
			</ListItemButton>
			<ListItemButton onClick={() => navigate("/teacher-list")}>
				<ListItemIcon>
					<WcTwoToneIcon />
				</ListItemIcon>
				<ListItemText primary="View Teachers" />
			</ListItemButton>
			<ListItemButton onClick={() => navigate("/course-list")}>
				<ListItemIcon>
					<MenuBookTwoToneIcon />
				</ListItemIcon>
				<ListItemText primary="View Course" />
			</ListItemButton>
			<ListItemButton onClick={() => navigate("/parent-list")}>
				<ListItemIcon>
					<FamilyRestroomIcon />
				</ListItemIcon>
				<ListItemText primary="View Parents" />
			</ListItemButton>

			<ListItemButton onClick={() => navigate("/send-email")}>
				<ListItemIcon>
					<EmailIcon />
				</ListItemIcon>
				<ListItemText primary="Send Email" />
			</ListItemButton>
			<ListItemButton onClick={() => navigate("/calendar")}>
				<ListItemIcon>
					<Calendar />
				</ListItemIcon>
				<ListItemText primary="Calendar" />
			</ListItemButton>
			<ListItemButton onClick={() => navigate("/create-newsletter")}>
				<ListItemIcon>
					<NewspaperIcon />
				</ListItemIcon>
				<ListItemText primary="Create Newsletter" />
			</ListItemButton>
			<ListItemButton onClick={() => navigate("/newsletter/latest/")}>
				<ListItemIcon>
					<VisibilityIcon />
				</ListItemIcon>
				<ListItemText primary="Check Newsletter" />
			</ListItemButton>
			<ListItemButton onClick={() => navigate("/admin/settings")}>
				<ListItemIcon>
					<SettingsIcon />
				</ListItemIcon>
				<ListItemText primary="Settings" />
			</ListItemButton>
		</React.Fragment>
	);
}
/*
export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItemButton>
  </React.Fragment>
);*/
