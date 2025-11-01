import React, { useContext } from 'react'
import { Navigate, Route, Routes as Switch } from 'react-router-dom'
import { UserContext } from '../App'
import Dashboard from '../Pages/Dashboard/Dashboard'
import NavBar from '../Components/NavBar/NavBar'
import ExpenseSummary from '../Pages/ExpenseSummary/ExpenseSummary'
import CalculateLoan from '../Pages/CalculateLoan/CalculateLoan'
import AdminPortal from '../Pages/AdminPortal/AdminPortal'

const Home = () => {

    const { user } = useContext(UserContext)

    return (
        <div style={{ height: "100vh", width: "100vw", padding: 16}}>
            <NavBar />
            <Switch>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminPortal />} />,
                <Route path="/calculateLoan/:vehicleId?" element={<CalculateLoan />} />
                <Route path="/expenseSummary/:catalog/:vehicleId?" element={<ExpenseSummary />} />
                <Route path="/*"  element={<Navigate to="/dashboard" replace />} />
            </Switch>
        </div>
    )
}

export default Home