import React from 'react'
import { Link } from 'react-router-dom';

const AddExpenses = () => {
  return (
    <div>AddExpenses <br/>
        <Link to="/viewexpenses">View Expenses</Link>
        <Link to="/unauthorized">TetstThing</Link>
    </div>
  )
}

export default AddExpenses