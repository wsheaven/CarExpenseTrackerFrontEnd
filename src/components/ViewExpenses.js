import React, { useEffect, useState } from 'react';
import useAuth from "../hooks/useAuth";
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const EXPENSE_URL = '/api/expenses/user/';

const ViewExpenses = () => {
    const { auth } = useAuth();
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axios.get(`${EXPENSE_URL}${encodeURIComponent(auth.userId)}`, {
                    headers: { Authorization: `Bearer ${auth.accessToken}` }
                });
                setExpenses(response.data);
                console.log("Expenses fetched successfully");
            } catch (error) {
                console.error("Failed to fetch expenses", error);
            }
        };

        fetchExpenses();
    }, [auth.userId, auth.accessToken]);

    const gasExpenses = expenses.filter(expense => expense.isGasExpense);
    const regularExpenses = expenses.filter(expense => !expense.isGasExpense);

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '20px'
    };

    const cellStyle = {
        border: '1px solid black',
        padding: '8px',
        textAlign: 'left',
    };

    return (
        <div>
            <h1>Gas Expenses</h1>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={cellStyle}>Cost ($)</th>
                        <th style={cellStyle}>Miles Traveled</th>
                        <th style={cellStyle}>Gallons</th>
                        <th style={cellStyle}>Miles per Gallon</th>
                        <th style={cellStyle}>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {gasExpenses.map(expense => (
                        <tr key={expense._id}>
                            <td style={cellStyle}>{expense.cost}</td>
                            <td style={cellStyle}>{expense.milesTraveledForGas}</td>
                            <td style={cellStyle}>{expense.gasGallons}</td>
                            <td style={cellStyle}>{expense.milesPerGallon ? expense.milesPerGallon.toFixed(1) : 'N/A'}</td>
                            <td style={cellStyle}>{expense.notes}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h1>Regular Expenses</h1>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={cellStyle}>Category</th>
                        <th style={cellStyle}>Cost</th>
                        <th style={cellStyle}>Notes</th>
                        <th style={cellStyle}>Mileage</th>
                        <th style={cellStyle}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {regularExpenses.map(expense => (
                        <tr key={expense._id}>
                            <td style={cellStyle}>{expense.category}</td>
                            <td style={cellStyle}>${expense.cost}</td>
                            <td style={cellStyle}>{expense.notes}</td>
                            <td style={cellStyle}>{expense.mileage} miles</td>
                            <td style={cellStyle}>{new Date(expense.date).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to="/addexpense">Add Expense</Link>
        </div>
    );
}

export default ViewExpenses;
