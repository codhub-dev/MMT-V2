import React, { useContext, useEffect, useRef, useState } from "react";
import StatisticCard from "../../Components/StatisticCard/StatisticCard";
import dayjs from "dayjs";
import { useLocation, useParams } from "react-router-dom";
import { UserContext } from "../../App";
import { Axios } from "../../Config/Axios/Axios";
import { PlusOutlined, FileExcelOutlined } from "@ant-design/icons";
import LoaderOverlay from "../../Components/LoaderOverlay/LoaderOverlay";
import { ArrowRightIcon } from "@primer/octicons-react";
import ConfirmModal from "../../Components/ConfirmModal/ConfirmModal";
import { Button, FloatButton, Table } from "antd";
import CalculationsModal from "../../Components/CalculationsModal/CalculationsModal";

const CalculateLoan = () => {
  const [contentLoader, setContentLoader] = useState(true);
  const [calculationsList, setCalculationsList] = useState([]);
  const [totalCalculation, setTotalCalculation] = useState(0);
  const [metaData, setMetaData] = useState({});
  const [isError, setIsError] = useState(false);
  const [selectedDates, setSelectedDates] = useState([
    dayjs().startOf("month").format("YYYY-MM-DD"),
    dayjs().format("YYYY-MM-DD"),
  ]);

  const location = useLocation();
  const calculationModalRef = useRef();
  const { user } = useContext(UserContext);
  const { vehicleId } = useParams();

  const tableColumns = [
    {
      title: "Date",
      width: 50,
      dataIndex: "date",
      key: "date",
      fixed: "left",
    },
    {
      title: "Cost",
      width: 100,
      dataIndex: "cost",
      key: "cost",
    },
    {
      title: "Additional Charges",
      width: 100,
      dataIndex: "additionalCharges",
      key: "additionalCharges",
    },
    {
        title: "Notes",
        width: 100,
        dataIndex: "note",
        key: "note",
      },
    {
      title: "Action",
      key: "operation",
      width: 40,
      render: (text, record) => (
        <ConfirmModal
          title="Confirm Action"
          content="Are you sure you want to delete?"
          onOk={() => handleOk(record._id)}
          key={record._id}
          onCancel={() => {}}
        >
          <button
            type="button"
            className="btn btn-danger btn-rounded btn-floating"
          >
            Delete
          </button>
        </ConfirmModal>
      ),
    },
  ];

  const formFields = [
    {
      type: "date",
      name: "date",
      label: "Choose Date",
      rules: [{ required: true, message: "Please choose the date" }],
    },
    {
      type: "input",
      name: "cost",
      label: "Cost",
      textType: "number",
      rules: [{ required: true, message: "Please enter the cost" }],
    },
    { type: "input", name: "note", label: "Note", textType: "text" },
    {
      type: "switch",
      name: "isAdditionalCharges",
      label: "Additional Charges",
      textType: "switch",
    },
    {
      type: "input",
      name: "additionalCharges",
      label: "Amount",
      placeholder: "Enter if any additional charges paid",
      textType: "number",
    },
  ];

  useEffect(() => {
    setContentLoader(true);
      Axios.get(`/api/v1/app/calculateLoan/getAllLoanCalculationsByTruckId`, {
        params: {
          truckId: vehicleId,
          selectedDates,
        },
        headers: {
          authorization: `bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((res) => {
          setCalculationsList(res.data.calculations);
          setTotalCalculation(res.data.totalCalculation || 0);
          setMetaData({
            totalFinanceAmount: res.data.totalFinanceAmount,
            recentPayment: res.data.recentPayment,
            paymentLeft: res.data.paymentLeft,
            totalAdditionalCharges: res.data.totalAdditionalCharges,
          });
          setContentLoader(false);
        })
        .catch((err) => {
          setCalculationsList([]);
          setTotalCalculation(0);
          setIsError(true);
          setContentLoader(false);
        });
  }, []);

  const callCalcucationModal = () => {
    if (calculationModalRef.current) {
      calculationModalRef.current.showModal();
    }
  };

  const handleDateChange = (date, dateString, index) => {
    const newDates = [...selectedDates];
    newDates[index] = dateString;

    setSelectedDates(newDates);
    refreshCalculations();
  };

  const handleReportDownload = async () => {
    setContentLoader(true);
    try {
      let response;
      response = await Axios.get(
        `/api/v1/app/calculateLoan/downloadLoanCalculationExcel`,
        {
          params: {
            truckId: vehicleId,
            selectedDates,
          },
          responseType: "blob", // Important to receive response as Blob
          headers: {
            authorization: `bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setContentLoader(false);

      // Create a URL for the Blob
      const url = URL.createObjectURL(new Blob([response.data]));

      // Create a link element and simulate a click to download the file
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `loan.xlsx`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the file:", error);
      setContentLoader(false);
    }
  };

  const handleOk = (id) => {
    Axios.delete(`/api/v1/app/calculateLoan/deleteLoanCalculationById/${id}`, {
      params: { id },
      headers: {
        authorization: `bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(() => {
        refreshCalculations();
        // setSelectedDates([dayjs().subtract(1, "month"), dayjs()]);
      })
      .catch((err) => {
        console.error("Failed to delete calculation:", err);
      });
  };

  const refreshCalculations = () => {
    setContentLoader(true);
    Axios.get(`/api/v1/app/calculateLoan/getAllLoanCalculationsByTruckId`, {
        params: {
          truckId: vehicleId,
          selectedDates,
        },
        headers: {
          authorization: `bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((res) => {
          setCalculationsList(res.data.calculations);
          setTotalCalculation(res.data.totalCalculation || 0);
          setMetaData({
            totalFinanceAmount: res.data.totalFinanceAmount,
            recentPayment: res.data.recentPayment,
            paymentLeft: res.data.paymentLeft,
            totalAdditionalCharges: res.data.totalAdditionalCharges,
          });
          setContentLoader(false);
        })
        .catch((err) => {
          setCalculationsList([]);
          setTotalCalculation(0);
          setIsError(true);
          setContentLoader(false);
        });
  };

  return (
    <>
      <div className="dashboard-grid-container mb-5 display-grid w-100 justify-content-center">
        <StatisticCard
          title={
            <b>
              <span style={{ fontSize: 18, color: "#f6f6f6" }}>
                Total Finance Amount
              </span>
            </b>
          }
          value={metaData?.totalFinanceAmount}
          thisMonth={0}
          route={""}
        />
        <StatisticCard
          title={
            <b>
              <span style={{ fontSize: 18, color: "#f6f6f6" }}>
                Total Additional Charges
              </span>
            </b>
          }
          value={metaData?.totalAdditionalCharges}
          thisMonth={0}
          route={""}
        />
        <StatisticCard
          title={
            <b>
              <span style={{ fontSize: 18, color: "#f6f6f6" }}>
                Recent Payment{""}
              </span>
              <span style={{ fontSize: 10, fontStyle: "oblique" }}>
                {" "}
                {metaData.recentPayment?.date?.split("T")[0]}
              </span>
            </b>
          }
          value={metaData.recentPayment?.cost}
          thisMonth={0}
          route={""}
        />
        <StatisticCard
          title={
            <b>
              <span style={{ fontSize: 18, color: "#f6f6f6" }}>
                Payment left
              </span>
            </b>
          }
          value={metaData?.paymentLeft}
          thisMonth={0}
          route={""}
        />
      </div>
      <hr></hr>
      <>
        <LoaderOverlay isVisible={contentLoader} />
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <div className="d-flex flex-column flex-md-row gap-3 align-items-center mb-3 mb-md-0">
            <input
              type="date"
              className="form-control"
              style={{
                padding: "10px",
                borderRadius: "7px",
              }}
              onChange={(e) =>
                handleDateChange(e.target.value, e.target.value, 0)
              }
              value={selectedDates[0]}
            />
            <ArrowRightIcon size={16} />
            <input
              type="date"
              className="form-control"
              style={{
                padding: "10px",
                borderRadius: "7px",
              }}
              onChange={(e) =>
                handleDateChange(e.target.value, e.target.value, 1)
              }
              value={selectedDates[1]}
            />
          </div>

          <div
            className="d-flex border align-items-center p-2 ps-3 rounded gap-3 justify-content-between"
            style={{ background: "#fafafa" }}
          >
            <b>Total Payment</b>
            <div className="p-2 border bg-white rounded fw-bold text-danger">
              {totalCalculation.toFixed(2)}
            </div>
          </div>
        </div>
        <hr></hr>
        <Table
          columns={tableColumns}
          dataSource={calculationsList}
          scroll={{
            x: 1500,
            y: 500,
          }}
        />
        <hr></hr>
        <div className="w-100 d-flex justify-content-center mt-5">
          <Button
            type="primary"
            style={{ background: "green", marginBottom: 30 }}
            icon={<FileExcelOutlined style={{ fontSize: 22 }} size={32} />}
            size={"large"}
            disabled={calculationsList.length ? false : true}
            onClick={handleReportDownload}
          >
            <b>Download Report</b>
          </Button>
        </div>
        {vehicleId && (
          <FloatButton
            shape="circle"
            type="primary"
            style={{
              insetInlineEnd: "6%",
              height: 80,
              width: 80,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={callCalcucationModal}
            icon={<PlusOutlined style={{ fontSize: 20 }} />}
          />
        )}
        <CalculationsModal
          ref={calculationModalRef}
          setCalculationsList={setCalculationsList}
          calculationsList={calculationsList}
          category={"Loan Calculations"}
          formFields={formFields}
          onSuccess={refreshCalculations}
        />
      </>
    </>
  );
};

export default CalculateLoan;
