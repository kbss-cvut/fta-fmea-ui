import * as React from "react";
import AppBar from "@components/appBar/AppBar";
import DashboardContentProvider from "@hooks/DashboardContentProvider";
import DashboardContent from "@components/dashboard/content/DashboardContent";
import { CssBaseline } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import useStyles from "@components/dashboard/Dashboard.styles";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { classes } = useStyles();

  const { t } = useTranslation();

  return (
    <DashboardContentProvider>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar title={t("main.appBarHeader")} />
        <Toolbar />

        <DashboardContent />
      </div>
    </DashboardContentProvider>
  );
};

export default Dashboard;
