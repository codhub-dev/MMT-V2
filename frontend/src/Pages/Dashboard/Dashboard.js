import React, { useContext, useEffect, useRef, useState } from "react";
import { Axios } from "../../Config/Axios/Axios";
import { UserContext } from "../../App";
import { Button, Divider, Spin } from "antd";
import StatisticCard from "../../Components/StatisticCard/StatisticCard";
import VehicleCard from "../../Components/VehicleCard/VehicleCard";
import { PlusCircleFilled } from "@ant-design/icons";
import VehicleModal from "../../Components/VehicleModal/VehicleModal";
import LoaderOverlay from "../../Components/LoaderOverlay/LoaderOverlay";
import "../../Styles/Dashboard.css";
import { PlusIcon } from "@primer/octicons-react";

const Dashboard = () => {
  const [contentLoader, setContentLoader] = useState(true);
  const [analyticsLoader, setAnalyticsLoader] = useState(true);
  const [isError, setIsError] = useState(false);
  const [trucks, setTrucks] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const { user } = useContext(UserContext);


  useEffect(() => {
    setContentLoader(true);
    Axios.get(`/api/v1/app/truck/getAllTrucksByUser/${user.userId}`, {
      params: {
        addedBy: user.userId,
      },
      headers: {
        authorization: `bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        setTrucks(res.data);
        setContentLoader(false);
      })
      .catch((err) => {
        setIsError(true);
        setContentLoader(false);
      });

    return () => { };
  }, []);

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
      })
      .catch((err) => {
        setIsError(true);
        // setContentLoader(false);
      });
  }, []);

  const vehicleModalRef = useRef();

  const callVehicleModal = () => {
    if (vehicleModalRef.current) {
      vehicleModalRef.current.showLoading();
    }
  };

  return (
    <div className="p-4 rounded-4" style={{ background: "#f6f6f6" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex flex-column">
          <b style={{ fontSize: "26px" }}>Dashboard</b>
          <span style={{ fontSize: "14px", color: "#939393" }}>Overview of your truck's performance</span>
        </div>
        <div>
          <Button className="primary rounded-5 p-4" onClick={callVehicleModal}><PlusIcon /> Add Vehicle</Button>
        </div>
      </div>
      <LoaderOverlay isVisible={contentLoader} />
      {analyticsLoader ? (
        <div className="w-100 my-5 d-flex align-items-center justify-content-center">
          <b className="me-3">Analyzing metrics</b>
          <Spin size="large" />
        </div>
      ) : (
        <div className="dashboard-container">
          <StatisticCard
            cardType="primary"
            title={
              <span>
                <span style={{ fontSize: 16, fontWeight: 500, color: "#f6f6f6" }}>
                  Total Expense{" "}
                </span>
                {/* <span style={{ fontSize: 10, fontStyle: "oblique" }}>
                  {" "}
                  this month
                </span> */}
              </span>
            }
            value={metadata.monthlyExpenses?.monthlyGrandTotal}
            thisMonth={metadata.grandTotal}
            route={'/expenseSummary/totalExpenses'}
          />
          <StatisticCard
            cardType="primary"
            title={
              <span>
                <span style={{ fontSize: 16, fontWeight: 500, color: "#f6f6f6" }}>
                  Fuel Expense{" "}
                </span>
                {/* <span style={{ fontSize: 10, fontStyle: "oblique" }}>
                  {" "}
                  this month
                </span> */}
              </span>
            }
            thisMonth={metadata.fuelTotal}
            value={metadata.monthlyExpenses?.fuel}
            route={'/expenseSummary/fuelExpenses'}
          />
          <StatisticCard
            cardType="primary"
            title={
              <span>
                <span style={{ fontSize: 16, fontWeight: 500, color: "#f6f6f6" }}>
                  Def Expense{" "}
                </span>
                {/* <span style={{ fontSize: 10, fontStyle: "oblique" }}>
                  {" "}
                  this month
                </span> */}
              </span>
            }
            thisMonth={metadata.defTotal}
            value={metadata.monthlyExpenses?.def}
            route={'/expenseSummary/defExpenses'}
          />
          <StatisticCard
            cardType="primary"
            title={
              <span>
                <span style={{ fontSize: 16, fontWeight: 500, color: "#f6f6f6" }}>
                  Other Expense{" "}
                </span>
                {/* <span style={{ fontSize: 10, fontStyle: "oblique" }}>
                  {" "}
                  this month
                </span> */}
              </span>
            }
            thisMonth={metadata.otherTotal}
            value={metadata.monthlyExpenses?.other}
            route={'/expenseSummary/otherExpenses'}
          />
          <StatisticCard
            cardType="primary"
            title={
              <span>
                <span style={{ fontSize: 16, fontWeight: 500, color: "#f6f6f6" }}>
                  Fuel Consumed{" "}
                </span>
                {/* <span style={{ fontSize: 10, fontStyle: "oblique" }}>
                  {" "}
                  this month
                </span> */}
              </span>
            }
            thisMonth={metadata.fuelUsedTotal}
            value={metadata.monthlyExpenses?.fuelUsed}
            route={null}
          />
        </div>
      )}

      <Divider
        style={{
          borderColor: "#000",
          margin: "50px 0px",
        }}
      >
        Manage Vehicles
      </Divider>
      <div className="dashboard-container vehicleCard px-4 pb-5">
        {trucks?.map((truck) => {
          return <VehicleCard key={truck._id} data={truck} />;
        })}

        <button
          className="bg-light rounded d-flex align-items-center justify-content-center"
          style={{ border: "2px dashed #cbcbcb", minHeight: 150 }}
          onClick={callVehicleModal}
        >
          <PlusCircleFilled style={{ fontSize: 76, color: "#d6d6d6" }} />
        </button>
      </div>
      <VehicleModal
        ref={vehicleModalRef}
        setTrucks={setTrucks}
        trucks={trucks}
        vehicleData={null}
      />
    </div>
  );
};

export default Dashboard;
