import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const EXPENSE_URL = "/api/expenses/user/";

const Home = () => {
  const { auth } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axiosPrivate.get(
          `${EXPENSE_URL}${encodeURIComponent(auth.userId)}`,
          {
            headers: { Authorization: `Bearer ${auth.accessToken}` },
          }
        );
        setExpenses(response.data);
        console.log("Expenses fetched successfully");
      } catch (error) {
        console.error("Failed to fetch expenses", error);
      }
    };

    fetchExpenses();
  }, [auth.userId, auth.accessToken, axiosPrivate]);

  const gasExpenses = expenses.filter((expense) => expense.isGasExpense);
  const regularExpenses = expenses.filter((expense) => !expense.isGasExpense);

  const totalGasCost = gasExpenses.reduce((total, expense) => total + expense.cost, 0);
    const totalOtherCost = regularExpenses.reduce((total, expense) => total + expense.cost, 0);
    const totalCost = totalGasCost + totalOtherCost;

  const averageMpgAllTime =
    gasExpenses.length > 0
      ? gasExpenses.reduce(
          (total, expense) => total + (expense.milesPerGallon || 0),
          0
        ) / gasExpenses.length
      : 0;

      const totalGasGallons = gasExpenses.reduce((total, expense) => total + (expense.gasGallons || 0), 0);
      const totalMilesTraveledForGas = gasExpenses.reduce((total, expense) => total + (expense.milesTraveledForGas || 0), 0);

      return (
        <>
          {auth.user ? (
            <>
              <div className="flex justify-center mt-8">
                <div className="stats stats-vertical bg-base-200 justify-stretch w-2/3 lg:stats-horizontal shadow">
                  <div className="stat flex flex-col items-center justify-center">
                    <div className="stat-title">Total Spent</div>
                    <div className="stat-value">{`${totalCost.toFixed(2)}`}</div>
                    <div className="stat-desc">Dollars ($)</div>
                  </div>
    
                  <div className="stat flex flex-col items-center justify-center">
                    <div className="stat-title">Gallons of Gas Bought</div>
                    <div className="stat-value">{totalGasGallons}</div>
                    <div className="stat-desc">Gallons</div>
                  </div>
    
                  <div className="stat flex flex-col items-center justify-center">
                    <div className="stat-title">Miles Tracked</div>
                    <div className="stat-value">{totalMilesTraveledForGas.toFixed(1)}</div>
                    <div className="stat-desc">Miles</div>
                  </div>

                  <div className="stat flex flex-col items-center justify-center">
                    <div className="stat-title">Average Miles per Gallon</div>
                    <div className="stat-value">{averageMpgAllTime.toFixed(1)}</div>
                    <div className="stat-desc">MPG</div>
                  </div>
                </div>
              </div>
    
              <div className="flex justify-center mt-20">
                <div className="card lg:card-side w-2/3 bg-base-200 shadow-xl">
                  <figure>
                    <img
                      src="https://images.unsplash.com/photo-1615238359019-c8de4242e083?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="Car on Highway"
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">Track Your Spending</h2>
                    <p>Keep an eye on all your car-related expenses. From fuel to maintenance, get a detailed view of where your money is going.</p>
                    <div className="card-actions justify-end">
                    <Link to="/viewexpenses" className="px-4 py-2 btn btn-primary">View Expenses</Link>
                    </div>
                  </div>
                </div>
              </div>
    
              <div className="flex justify-center mb-20 mt-20">
                <div className="card lg:card-side w-2/3 bg-base-200 shadow-xl">
                  <figure>
                    <img
                      src="https://images.unsplash.com/photo-1602853175733-5ad62dc6a2c8?q=80&w=2039&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="Gas Pump"
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">Add a New Expense</h2>
                    <p>Quickly and easily log all your car-related expenses. Make sure to keep your records up to date for accurate tracking.</p>
                    <div className="card-actions justify-end">
                    <Link to="/addexpense" className="px-4 py-2 btn btn-secondary">Add Expense</Link>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-center mt-8">
                <div className="hero bg-base-200 p-8 rounded shadow-lg w-2/3">
                  <div className="hero-content text-center">
                    <div className="max-w-md">
                      <h1 className="text-5xl font-bold">Welcome to Car Expense Tracker</h1>
                      <p className="py-6">
                        Keep track of your car-related expenses, monitor your fuel usage, and stay on top of maintenance. Sign in or sign up to get started!
                      </p>
                      <div className="flex justify-center space-x-4">
                      <Link to="/login" className="px-4 py-2 btn btn-primary">Sign In</Link>
                      <Link to="/register" className="px-4 py-2 btn btn-secondary">Sign Up</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
    
              <div className="flex justify-center mt-20">
                <div className="card lg:card-side w-2/3 bg-base-200 shadow-xl">
                  <figure>
                    <img
                      src="https://images.unsplash.com/photo-1665740338853-cafe410687fb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="Expense Tracking"
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">Track Your Expenses</h2>
                    <p>Log all your car-related expenses and keep track of your spending over time, so you can focus on what really matters.</p>
                  </div>
                </div>
              </div>
    
              <div className="flex justify-center mb-20 mt-20">
                <div className="card lg:card-side w-2/3 bg-base-200 shadow-xl">
                  <figure>
                    <img
                      src="https://images.unsplash.com/photo-1487803556724-cb9f0b8151d1?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="Fuel Usage"
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">Monitor Fuel Usage</h2>
                    <p>Keep a detailed record of your fuel consumption and optimize your car's performance.</p>
                  </div>
                </div>
              </div>
    
              <div className="flex justify-center mb-20">
                <div className="card lg:card-side w-2/3 bg-base-200 shadow-xl">
                  <figure>
                    <img
                      src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="Maintenance Tracking"
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">Stay on Top of Maintenance</h2>
                    <p>Keep a detailed record of all your car's maintenance activities. Track services, repairs, and upkeep to ensure your vehicle runs smoothly and efficiently.</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center space-x-4 mb-10">
                      <Link to="/login" className="px-4 py-2 btn btn-primary">Sign In</Link>
                      <Link to="/register" className="px-4 py-2 btn btn-secondary">Sign Up</Link>
                      </div>
            </>
          )}
        </>
      );
    };

export default Home;
