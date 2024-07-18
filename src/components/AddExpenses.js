import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosPrivate } from "../api/axios";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuth from "../hooks/useAuth";

const CATEGORY_REGEX = /^[A-Za-z\s]{1,}$/; // Allows alphabetic characters and spaces, at least 1 character long
const COST_REGEX = /^\d+(\.\d{1,2})?$/; // Allows numbers with up to two decimal places
const MILEAGE_REGEX = /^\d+$/; // Allows only positive integers
const DATE_REGEX = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{2}$/; // Simple date format MM/DD/YY
const MILES_TRAVELED_FOR_GAS_REGEX = /^\d+$/; // Allows only positive integers
const GAS_GALLONS_REGEX = /^\d+(\.\d{1,3})?$/; // Allows numbers with up to three decimal places
const ADD_EXPENSE_URL = "/expenses";

const AddExpenses = () => {
  const errRef = useRef();
  const { auth } = useAuth();

  const [category, setCategory] = useState("");
  const [validCategory, setValidCategory] = useState(false);

  const [cost, setCost] = useState("");
  const [validCost, setValidCost] = useState(false);

  const [mileage, setMileage] = useState("");
  const [validMileage, setValidMileage] = useState(false);

  const [date, setDate] = useState("");
  const [validDate, setValidDate] = useState(false);

  const [notes, setNotes] = useState("");

  const [isGasExpense, setIsGasExpense] = useState(false);

  const [milesTraveledForGas, setMilesTraveledForGas] = useState("");
  const [validMilesTraveledForGas, setValidMilesTraveledForGas] =
    useState(false);

  const [gasGallons, setGasGallons] = useState("");
  const [validGasGallons, setValidGasGallons] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    errRef.current && errRef.current.focus();
  }, []);

  useEffect(() => {
    setValidCategory(CATEGORY_REGEX.test(category));
  }, [category]);

  useEffect(() => {
    setValidCost(COST_REGEX.test(cost));
  }, [cost]);

  useEffect(() => {
    setValidMileage(MILEAGE_REGEX.test(mileage));
  }, [mileage]);

  useEffect(() => {
    setValidDate(DATE_REGEX.test(date));
  }, [date]);

  useEffect(() => {
    if (isGasExpense) {
      setValidMilesTraveledForGas(
        MILES_TRAVELED_FOR_GAS_REGEX.test(milesTraveledForGas)
      );
      setValidGasGallons(GAS_GALLONS_REGEX.test(gasGallons));
    }
  }, [milesTraveledForGas, gasGallons, isGasExpense]);

  useEffect(() => {
    setErrMsg("");
  }, [
    category,
    cost,
    mileage,
    date,
    notes,
    isGasExpense,
    milesTraveledForGas,
    gasGallons,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValidCategory = CATEGORY_REGEX.test(category);
    const isValidCost = COST_REGEX.test(cost);
    const isValidMileage = MILEAGE_REGEX.test(mileage);
    const isValidDate = DATE_REGEX.test(date);

    if (!isValidCategory || !isValidCost || !isValidMileage || !isValidDate) {
      setErrMsg("Invalid Entry in required fields");
      return;
    }

    if (isGasExpense) {
      const isValidMilesTraveledForGas =
        MILES_TRAVELED_FOR_GAS_REGEX.test(milesTraveledForGas);
      const isValidGasGallons = GAS_GALLONS_REGEX.test(gasGallons);

      if (!isValidMilesTraveledForGas || !isValidGasGallons) {
        setErrMsg("Invalid Entry in gas-related fields");
        return;
      }
    }

    try {
      const response = await axiosPrivate.post(
        ADD_EXPENSE_URL,
        JSON.stringify({
          userId: auth.userId,
          category,
          cost,
          mileage,
          date,
          notes,
          isGasExpense,
          milesTraveledForGas,
          gasGallons,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
          withCredentials: true,
        }
      );
      console.log(response?.data);
      console.log(JSON.stringify(response));
      setSuccess(true);

      setCategory("");
      setCost("");
      setMileage("");
      setDate("");
      setNotes("");
      setIsGasExpense(false);
      setMilesTraveledForGas("");
      setGasGallons("");
    } catch (err) {
      console.error(err);
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 403) {
        setErrMsg("Forbidden");
      } else if (err.response?.status === 409) {
        setErrMsg(`${JSON.stringify(err.response.data.message)}`);
      } else {
        setErrMsg("Submission Failed");
      }
    }
  };

  return (
    <>
      {success ? (
        <section className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="w-full max-w-md p-8 space-y-6 bg-base-200  rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold">Success!</h1>
            <p>
              <Link
                to="/ViewExpenses"
                className="text-blue-500 hover:text-blue-700"
              >
                View Expenses
              </Link>
            </p>
            <p>Or</p>
            <p>
              <Link
                to="/addexpense"
                className="text-blue-500 hover:text-blue-700"
              >
                Add Another Expense
              </Link>
            </p>
          </div>
        </section>
      ) : (
        <section className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="w-full max-w-md p-8 space-y-6 bg-base-200 rounded-lg shadow-md">
            <p
              ref={errRef}
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <h1 className="text-2xl font-bold text-center">Add Car Expense</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="input input-bordered flex items-center gap-2 w-full">
                <FontAwesomeIcon
                  icon={faCheck}
                  className={
                    validCategory ? "text-green-500 h-5 w-5" : "hidden"
                  }
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={
                    validCategory || !category
                      ? "hidden"
                      : "text-red-500 h-5 w-5"
                  }
                />
                <input
                  type="text"
                  id="category"
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setValidCategory(CATEGORY_REGEX.test(e.target.value));
                  }}
                  value={category}
                  required
                  placeholder="Category"
                  className="grow"
                />
              </label>

              <label className="input input-bordered flex items-center gap-2 w-full">
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validCost ? "text-green-500 h-5 w-5" : "hidden"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={
                    validCost || !cost ? "hidden" : "text-red-500 h-5 w-5"
                  }
                />
                <input
                  type="text"
                  id="cost"
                  onChange={(e) => {
                    setCost(e.target.value);
                    setValidCost(COST_REGEX.test(e.target.value));
                  }}
                  value={cost}
                  required
                  placeholder="Cost"
                  className="grow"
                />
              </label>

              <label className="input input-bordered flex items-center gap-2 w-full">
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validMileage ? "text-green-500 h-5 w-5" : "hidden"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={
                    validMileage || !mileage ? "hidden" : "text-red-500 h-5 w-5"
                  }
                />
                <input
                  type="text"
                  id="mileage"
                  onChange={(e) => {
                    setMileage(e.target.value);
                    setValidMileage(MILEAGE_REGEX.test(e.target.value));
                  }}
                  value={mileage}
                  required
                  placeholder="Mileage"
                  className="grow"
                />
              </label>

              <label className="input input-bordered flex items-center gap-2 w-full">
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validDate ? "text-green-500 h-5 w-5" : "hidden"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={
                    validDate || !date ? "hidden" : "text-red-500 h-5 w-5"
                  }
                />
                <input
                  type="text"
                  id="date"
                  onChange={(e) => {
                    setDate(e.target.value);
                    setValidDate(DATE_REGEX.test(e.target.value));
                  }}
                  value={date}
                  required
                  placeholder="Date (MM/DD/YY)"
                  className="grow"
                />
              </label>

              <textarea
                className="textarea textarea-bordered gap-2 w-full"
                id="notes"
                onChange={(e) => setNotes(e.target.value)}
                value={notes}
                placeholder="Notes"
              />

              <label className="flex items-center justify-center gap-2">
                <input
                  type="checkbox"
                  id="isGasExpense"
                  onChange={(e) => setIsGasExpense(e.target.checked)}
                  checked={isGasExpense}
                  className="checkbox checkbox-primary"
                />
                <span>Is Gas Expense</span>
              </label>

              {isGasExpense && (
                <>
                  <label className="input input-bordered flex items-center gap-2 w-full">
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={
                        validMilesTraveledForGas
                          ? "text-green-500 h-5 w-5"
                          : "hidden"
                      }
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={
                        validMilesTraveledForGas || !milesTraveledForGas
                          ? "hidden"
                          : "text-red-500 h-5 w-5"
                      }
                    />
                    <input
                      type="text"
                      id="milesTraveledForGas"
                      onChange={(e) => {
                        setMilesTraveledForGas(e.target.value);
                        setValidMilesTraveledForGas(
                          MILES_TRAVELED_FOR_GAS_REGEX.test(e.target.value)
                        );
                      }}
                      value={milesTraveledForGas}
                      required={isGasExpense}
                      placeholder="Miles Traveled For Gas"
                      className="grow"
                    />
                  </label>

                  <label className="input input-bordered flex items-center gap-2 w-full">
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={
                        validGasGallons ? "text-green-500 h-5 w-5" : "hidden"
                      }
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={
                        validGasGallons || !gasGallons
                          ? "hidden"
                          : "text-red-500 h-5 w-5"
                      }
                    />
                    <input
                      type="text"
                      id="gasGallons"
                      onChange={(e) => {
                        setGasGallons(e.target.value);
                        setValidGasGallons(
                          GAS_GALLONS_REGEX.test(e.target.value)
                        );
                      }}
                      value={gasGallons}
                      required={isGasExpense}
                      placeholder="Gas Gallons"
                      className="grow"
                    />
                  </label>
                </>
              )}

              <button
                className="btn btn-primary w-full"
                disabled={
                  !validCategory ||
                  !validCost ||
                  !validMileage ||
                  !validDate ||
                  (isGasExpense &&
                    (!validMilesTraveledForGas || !validGasGallons))
                }
              >
                Add Expense
              </button>
            </form>
            <p className="text-center">
              <br />
              <Link
                to="/ViewExpenses"
                className="text-blue-500 hover:text-blue-700"
              >
                View Expenses
              </Link>
            </p>
          </div>
        </section>
      )}
    </>
  );
};

export default AddExpenses;
