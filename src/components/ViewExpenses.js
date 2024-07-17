import React, { useEffect, useState } from 'react';
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useNavigate, useLocation } from 'react-router-dom';

import '../index.css';

const EXPENSE_URL = '/api/expenses/user/';

const ViewExpenses = () => {
    const { auth } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axiosPrivate.get(`${EXPENSE_URL}${encodeURIComponent(auth.userId)}`, {
                    headers: { Authorization: `Bearer ${auth.accessToken}` }
                });
                setExpenses(response.data);
                console.log("Expenses fetched successfully");
            } catch (error) {
                console.error("Failed to fetch expenses", error);
                navigate('/login', {state: {from: location}, replace: true})
            }
        };

        fetchExpenses();
    }, [auth.userId, auth.accessToken, axiosPrivate]);

    const gasExpenses = expenses.filter(expense => expense.isGasExpense);
    const regularExpenses = expenses.filter(expense => !expense.isGasExpense);

    const totalGasCost = gasExpenses.reduce((total, expense) => total + expense.cost, 0);
    const totalOtherCost = regularExpenses.reduce((total, expense) => total + expense.cost, 0);
    const totalCost = totalGasCost + totalOtherCost;

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const gasExpensesLastMonth = gasExpenses.filter(expense => new Date(expense.date) > lastMonth);
    const regularExpensesLastMonth = regularExpenses.filter(expense => new Date(expense.date) > lastMonth);

    const totalGasCostLastMonth = gasExpensesLastMonth.reduce((total, expense) => total + expense.cost, 0);
    const totalOtherCostLastMonth = regularExpensesLastMonth.reduce((total, expense) => total + expense.cost, 0);
    const totalCostLastMonth = totalGasCostLastMonth + totalOtherCostLastMonth;

    const averageMpgAllTime = gasExpenses.length > 0 ? gasExpenses.reduce((total, expense) => total + (expense.milesPerGallon || 0), 0) / gasExpenses.length : 0;
    const averageMpgLastMonth = gasExpensesLastMonth.length > 0 ? gasExpensesLastMonth.reduce((total, expense) => total + (expense.milesPerGallon || 0), 0) / gasExpensesLastMonth.length : 0;

    return (
        <>
        <div className="flex flex-col items-center justify-center flex-1 w-full p-4">
        <h1 className="text-2xl font-bold">Expense Summary</h1>
        <div className="flex flex-col w-full max-w-4xl overflow-x-auto mt-8">
  <table className="table w-full">
    <thead className="bg-base-200">
      <tr>
        <th className="text-sm lg:text-base rounded-tl-lg p-2"> </th>
        <th className="text-sm lg:text-base p-2">All Time</th>
        <th className="text-sm lg:text-base rounded-tr-lg p-2">Last Month</th>
      </tr>
    </thead>
    <tbody>
      <tr className="hover">
        <td className="p-2">Total Gas Cost</td>
        <td className="p-2">${totalGasCost.toFixed(2)}</td>
        <td className="p-2">${totalGasCostLastMonth.toFixed(2)}</td>
      </tr>
      <tr className="hover">
        <td className="p-2">Total Other Costs</td>
        <td className="p-2">${totalOtherCost.toFixed(2)}</td>
        <td className="p-2">${totalOtherCostLastMonth.toFixed(2)}</td>
      </tr>
      <tr className="hover">
        <td className="p-2">Total Cost</td>
        <td className="p-2">${totalCost.toFixed(2)}</td>
        <td className="p-2">${totalCostLastMonth.toFixed(2)}</td>
      </tr>
      <tr className="hover">
        <td className="p-2">Average MPG</td>
        <td className="p-2">{averageMpgAllTime.toFixed(2)}</td>
        <td className="p-2">{averageMpgLastMonth.toFixed(2)}</td>
      </tr>
    </tbody>
  </table>
</div>

  
<h1 className="text-2xl font-bold mt-8">Gas Expenses</h1>
<div className="flex flex-col w-full max-w-4xl overflow-x-auto mt-8">
  <table className="table w-full">
    <thead className="bg-base-200">
      <tr>
        <th className="text-sm lg:text-base p-2">Cost ($)</th>
        <th className="text-sm lg:text-base p-2">Miles Traveled</th>
        <th className="text-sm lg:text-base p-2">Gallons</th>
        <th className="text-sm lg:text-base p-2">Miles per Gallon</th>
        <th className="text-sm lg:text-base p-2">Notes</th>
      </tr>
    </thead>
    <tbody>
      {gasExpenses.map(expense => (
        <tr className="hover" key={expense._id}>
          <td className="p-2">{expense.cost}</td>
          <td className="p-2">{expense.milesTraveledForGas}</td>
          <td className="p-2">{expense.gasGallons}</td>
          <td className="p-2">{expense.milesPerGallon ? expense.milesPerGallon.toFixed(1) : 'N/A'}</td>
          <td className="p-2">{expense.notes}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

<h1 className="text-2xl font-bold mt-8">Regular Expenses</h1>
<div className="flex flex-col w-full max-w-4xl overflow-x-auto mt-8">
  <table className="table w-full">
    <thead className="bg-base-200">
      <tr>
        <th className="text-sm lg:text-base p-2">Category</th>
        <th className="text-sm lg:text-base p-2">Cost</th>
        <th className="text-sm lg:text-base p-2">Notes</th>
        <th className="text-sm lg:text-base p-2">Mileage</th>
        <th className="text-sm lg:text-base p-2">Date</th>
      </tr>
    </thead>
    <tbody>
      {regularExpenses.map(expense => (
        <tr className="hover" key={expense._id}>
          <td className="p-2">{expense.category}</td>
          <td className="p-2">${expense.cost}</td>
          <td className="p-2">{expense.notes}</td>
          <td className="p-2">{expense.mileage} miles</td>
          <td className="p-2">{new Date(expense.date).toLocaleDateString()}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
  
        </div>
      </>
    );
}

export default ViewExpenses;
