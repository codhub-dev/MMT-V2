import React, { useState } from "react";
import { Menu, Button } from "antd";
import {
    HomeOutlined,
    BarChartOutlined,
    SettingOutlined,
    QuestionCircleOutlined,
    LogoutOutlined,
    TruckOutlined,
    CloseOutlined,
    BankOutlined,
    FireOutlined,
    WalletOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useMobile } from "../MobileContext/MobileContext";

const SideBar = ({ isOpen = true, setIsOpen }) => {
    const [current, setCurrent] = useState();
    const [logoLoading, setLogoLoading] = useState(true);
    const { isMobile } = useMobile();
    const nav = useNavigate();

    const items = [
        {
            type: "group",
            label: "MENU",
            children: [
                { label: "Dashboard", key: "dashboard", icon: <HomeOutlined /> },
                { label: "Trucks", key: "trucks", icon: <TruckOutlined /> },
                { label: "Fuel Expense", key: "expenseSummary/fuelExpenses", icon: <FireOutlined /> },
                { label: "Def Expense", key: "expenseSummary/defExpenses", icon: <WalletOutlined /> },
                { label: "Other Expense", key: "expenseSummary/otherExpenses", icon: <BarChartOutlined /> },
                { label: "Income", key: "incomeSummary/income", icon: <BankOutlined /> }
            ]
        },
        {
            type: "group",
            label: "GENERAL",
            children: [
                { label: "Settings", key: "settings", icon: <SettingOutlined /> },
                { label: "Help", key: "help", icon: <QuestionCircleOutlined /> },
                { label: "Logout", key: "logout", icon: <LogoutOutlined /> }
            ]
        }
    ];

    const onClick = (e) => {
        nav(`/${e.key}`);
        setCurrent(e.key);

        // Close sidebar on mobile after navigation
        if (isMobile && setIsOpen) {
            setIsOpen(false);
        }
    };

    const handleCloseMobile = () => {
        if (setIsOpen) {
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Mobile overlay - rendered outside sidebar */}
            {isMobile && isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={handleCloseMobile}
                />
            )}

            <div className={`sidebar-container rounded-4 ${isMobile && isOpen ? 'sidebar-mobile' : ''}`}>
            {/* Mobile close button */}
            {isMobile && (
                <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={handleCloseMobile}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        zIndex: 1001,
                        color: '#666'
                    }}
                />
            )}

            <div className="sidebar-top" style={{ paddingLeft: "20px", paddingRight: "20px" }}>
                {/* Logo */}
                <div className="d-flex gap-2 align-items-center mb-4">
                    <div style={{ width: 50, height: 50, position: "relative" }}>
                        {logoLoading && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: "#f0f0f0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "8px"
                                }}
                            >
                                <div style={{
                                    width: "16px",
                                    height: "16px",
                                    border: "2px solid #ccc",
                                    borderTop: "2px solid #007bff",
                                    borderRadius: "50%",
                                    animation: "spin 1s linear infinite"
                                }}></div>
                            </div>
                        )}
                        <img
                            src="/favicon.png"
                            alt=""
                            style={{
                                width: 50,
                                height: 50,
                                opacity: logoLoading ? 0 : 1,
                                transition: "opacity 0.3s ease"
                            }}
                            onLoad={() => setLogoLoading(false)}
                            onError={() => setLogoLoading(false)}
                        />
                    </div>
                    <div><b className="fs-8">Manage My Truck</b></div>
                </div>

                {/* Menu */}
                <Menu
                    onClick={onClick}
                    selectedKeys={[current]}
                    mode="vertical"
                    items={items}
                    className="custom-sidebar-menu"
                />
            </div>

            <div className="sidebar-bottom" style={{ paddingLeft: "20px", paddingRight: "20px" }}>
                {/* Contact Card */}
                <div className="sidebar-contact-card">
                    <div className="sidebar-contact-overlay"></div>

                    <div className="contact-card-content">
                        <div className="contact-title">Need Tweaks?</div>
                        <div className="contact-subtitle">
                            Reach out to us for customizations or tailored solutions.
                        </div>

                        <button className="contact-btn">Contact Us</button>
                    </div>
                </div>
            </div>

        </div>
        </>
    );
};

export default SideBar;
