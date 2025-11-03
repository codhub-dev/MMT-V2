import React from "react";
import { VersionsIcon } from "@primer/octicons-react";

const SideBar = ({ navOpen, setNavOpen }) => {
    return (
        <div style={{background: "#f6f6f6", minWidth: "280px"}} className="rounded-4 p-3 pt-4">
            <div className="d-flex gap-2 align-items-center">
                <img src="favicon.png" alt="Logo" style={{ width: 50, height: 50 }} />
                <div>
                    <b className="fs-8">Manage My Truck</b>
                </div>
            </div>
        </div>
    );
};

export default SideBar;
