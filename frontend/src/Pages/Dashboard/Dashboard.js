import React, { useContext, useEffect, useRef, useState } from "react";
import { Axios } from "../../Config/Axios/Axios";
import { UserContext } from "../../App";
import { Spin, Row, Col } from "antd";
import StatisticCard from "../../Components/StatisticCard/StatisticCard";
import LoaderOverlay from "../../Components/LoaderOverlay/LoaderOverlay";
import DashboardCard from "../../Components/DashboardCard/DashboardCard";
import { CARD_SIZES, getResponsiveProps } from "../../Utils/dashboardLayoutUtils";
import "../../Styles/Dashboard.css";
import MonthlyChart from "../../Components/Dashboard/MonthlyChart/MonthlyChart";
import AlertsWidget from "../../Components/Dashboard/AlertsWidget/AlertsWidget";
import DriverProfileWidget from "../../Components/Dashboard/DriverProfileWidget/DriverProfileWidget";
import SchedulerWidget from "../../Components/Dashboard/SchedulerWidget/SchedulerWidget";

const Dashboard = () => {
  const [contentLoader, setContentLoader] = useState(true);
  const [isError, setIsError] = useState(false);
  const [analyticsLoader, setAnalyticsLoader] = useState(true);
  const [metadata, setMetadata] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    setAnalyticsLoader(true);

    Axios.get(`/api/v1/app/metadata/getMetadataByUserId`, {
      params: {
        userId: user.userId,
      },
      headers: {
        authorization: `bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        setMetadata(res.data);
        setAnalyticsLoader(false);
        setContentLoader(false);
      })
      .catch((err) => {
        setIsError(true);
        // setContentLoader(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: '100%', overflowX: 'hidden', overflowY: 'visible' }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex flex-column">
          <b style={{ fontSize: "26px" }}>Dashboard</b>
          <span style={{ fontSize: "14px", color: "#939393" }}>Overview of your truck's performance</span>
        </div>
      </div>
      <LoaderOverlay isVisible={contentLoader} />
      {analyticsLoader ? (
        <div className="w-100 my-5 d-flex align-items-center justify-content-center">
          <b className="me-3">Analyzing metrics</b>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 8, marginTop: 16 }}>
            <span style={{ fontSize: "13px", color: "#6b6b6b", fontWeight: 500 }}>
              Monthly Statistics
            </span>
          </div>
          <div className="statistics-carousel-container">
            <div className="statistics-carousel">
              <StatisticCard
                cardType="primary"
                title="Total Expense"
                value={metadata.monthlyExpenses?.monthlyGrandTotal}
                thisMonth={metadata.grandTotal}
                route={'/expenses'}
              />
              <StatisticCard
                cardType="primary"
                title="Fuel Expense"
                thisMonth={metadata.fuelTotal}
                value={metadata.monthlyExpenses?.fuel}
                route={'/expenseSummary/fuelExpenses'}
              />
              <StatisticCard
                cardType="primary"
                title="Def Expense"
                thisMonth={metadata.defTotal}
                value={metadata.monthlyExpenses?.def}
                route={'/expenseSummary/defExpenses'}
              />
              <StatisticCard
                cardType="primary"
                title="Other Expense"
                thisMonth={metadata.otherTotal}
                value={metadata.monthlyExpenses?.other}
                route={'/expenseSummary/otherExpenses'}
              />
              <StatisticCard
                cardType="primary"
                title="Fuel Consumed"
                thisMonth={metadata.fuelUsedTotal}
                value={metadata.monthlyExpenses?.fuelUsed}
                route={null}
              />
            </div>
          </div>
        </>
      )}
      <Row gutter={[16, 16]} justify="start" align="stretch" className="dashboard-grid-row">
        <Col {...getResponsiveProps('medium')}>
          <MonthlyChart />
        </Col>

        <Col {...getResponsiveProps('medium')}>
          <DriverProfileWidget />
        </Col>

        <Col {...getResponsiveProps('medium')}>
          {/* <SchedulerWidget /> */}
          <AlertsWidget />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
