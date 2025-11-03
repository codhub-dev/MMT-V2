import React, { useContext } from 'react'
import { Navigate, Route, Routes as Switch } from 'react-router-dom'
import { UserContext } from '../App'
import Dashboard from '../Pages/Dashboard/Dashboard'
import NavBar from '../Components/NavBar/NavBar'
import ExpenseSummary from '../Pages/ExpenseSummary/ExpenseSummary'
import CalculateLoan from '../Pages/CalculateLoan/CalculateLoan'
import AdminPortal from '../Pages/AdminPortal/AdminPortal'
import SideBar from '../Components/SideBar/SideBar'
import Trucks from '../Pages/Trucks/Trucks'

const Home = () => {

    const { user } = useContext(UserContext)

    return (
        <div style={{ height: "100vh", width: "100vw", padding: 16 }}>
            <div className='h-100 d-flex gap-3'>
                <SideBar />
                <div className='h-100 w-100 d-flex flex-column gap-3'>
                    <NavBar />
                    <Switch>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/trucks" element={<Trucks />} />
                        <Route path="/admin" element={<AdminPortal />} />,
                        <Route path="/calculateLoan/:vehicleId?" element={<CalculateLoan />} />
                        <Route path="/expenseSummary/:catalog/:vehicleId?" element={<ExpenseSummary />} />
                        <Route path="/*" element={<Navigate to="/dashboard" replace />} />
                    </Switch>
                </div>
            </div>
        </div>
    )
}

export default Home