import React, { useEffect, useState } from "react";
import { Button, Space } from "antd";
import { MenuFoldOutlined, LeftOutlined } from "@ant-design/icons";
import { PersonIcon } from "@primer/octicons-react";
import ProfileDrawer from "../ProfileDrawer/ProfileDrawer";
import MenuDrawer from "../MenuDrawer/MenuDrawer";
import { useLocation, useNavigate } from "react-router-dom";
import { Axios } from "../../Config/Axios/Axios";
import { useContext } from "react";
import { UserContext } from "../../App";

const NavBar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [truckDetails, setTruckDetails] = useState({});
  const [isError, setIsError] = useState(false);
  const [expenses, setExpenses] = useState({
    fuelExpenses: "Fuel Expenses",
    defExpenses: "Def Expenses",
    otherExpenses: "Other Expenses",
    totalExpenses: "Total Expenses",
    totalFuelExpenses: "Total Fuel Expenses",
    totalDefExpenses: "Total Def Expenses",
    totalOtherExpenses: "Total Other Expenses",
  });

  const { user } = useContext(UserContext);
  const loc = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setTruckDetails({});
    const locPath = loc.pathname.split("/")
    const truckId = locPath[1] === "calculateLoan" ? locPath[2] : locPath[3];
    if (truckId) {
      Axios.get(
        `/api/v1/app/truck/getTruckById/${truckId}`,
        {
          headers: {
            authorization: `bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((res) => {
          setTruckDetails(res.data);
        })
        .catch((err) => {
          setTruckDetails({});
          setIsError(true);
        });
    }
  }, [loc.pathname]);

  const showNavDrawer = () => {
    setNavOpen(true);
  };

  const showProfileDrawer = () => {
    setProfileOpen(true);
  };

  const registrationNo = truckDetails.registrationNo;

  return (
    <div>
      {(loc.pathname.startsWith("/expenseSummary/") || loc.pathname.startsWith("/calculateLoan/")) ? (
        <Space style={{ background: "#f6f6f6" }} className="p-4 w-100 rounded-3 d-flex justify-content-between">
          <Button
            type="dark"
            className="p-2"
            style={{
              border: "1px solid white",
              borderRadius: "160px",
              height: "40px",
              width: "40px",
            }}
            onClick={() => navigate(-1)}
          >
            <LeftOutlined style={{ color: "white", fontSize: 18 }} />
          </Button>
          <div>
            <b className="text-white fw-800 fs-5">
              {registrationNo ? registrationNo : "All Trucks"} -{" "}
              {loc.pathname.split("/")[1] === "calculateLoan" ? "Calculate Loan" : expenses[loc.pathname.split("/")[2]]}
            </b>
          </div>
        </Space>
      ) : (
        <Space style={{ background: "#f6f6f6" }} className="p-4 w-100 rounded-4 d-flex justify-content-between">
          <div></div>
          <div className="d-flex gap-3">
            <Button
              type="dark"
              className="p-2"
              style={{
                background: "white",
                borderRadius: "100%",
                height: "40px",
                width: "40px",
              }}
              onClick={showNavDrawer}
            >
              <MenuFoldOutlined style={{ color: "black", fontSize: 18 }} />
            </Button>

            <div className="d-flex">
              <Button
                type="dark"
                style={{
                  border: "1px solid black",
                  borderRadius: "100%",
                  height: "40px",
                  width: "40px",
                }}
                onClick={showProfileDrawer}
              >
                <img
                  src={
                    user?.picture
                      ? user.picture
                      : "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                  }
                  className="rounded-circle"
                  style={{
                    height: "40px",
                    width: "40px",
                  }}
                  alt="User"
                />
              </Button>
              <div className="ms-2 d-flex flex-column">
                <b style={{ fontSize: "14px" }} >{user?.name}</b>
                <span style={{ fontSize: "10px" }}>{user?.email}</span>
              </div>
            </div>
          </div>
        </Space>
      )}

      <MenuDrawer navOpen={navOpen} setNavOpen={setNavOpen} />
      <ProfileDrawer
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
      />
    </div>
  );
};

export default NavBar;
