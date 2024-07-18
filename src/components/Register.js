import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../api/axios";
import { Link } from "react-router-dom";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const REGISTER_URL = "/users";

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ username: user, password: pwd, email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response?.data);
      console.log(response?.accessToken);
      console.log(JSON.stringify(response));
      setSuccess(true);

      setUser("");
      setPwd("");
      setMatchPwd("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg(`${JSON.stringify(err.response.data.message)}`);
      } else {
        setErrMsg("Registration Failed");
      }
    }
  };

  return (
    <>
      {success ? (
        <section className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="w-full max-w-md p-8 space-y-6 bg-base-200 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold">Success!</h1>
            <p>
              <Link to="/Login" className="text-blue-500 hover:text-blue-700">
                Log in
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
            <h1 className="text-2xl font-bold text-center">Register</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="input input-bordered flex items-center gap-2 w-full">
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validName ? "text-green-500 h-5 w-5" : "hidden"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={
                    validName || !user ? "hidden" : "text-red-500 h-5 w-5"
                  }
                />
                <input
                  type="text"
                  id="username"
                  ref={userRef}
                  autoComplete="off"
                  onChange={(e) => {
                    setUser(e.target.value);
                    setValidName(USER_REGEX.test(e.target.value));
                  }}
                  value={user}
                  required
                  placeholder="Username"
                  className="grow"
                />
              </label>

              <label className="input input-bordered flex items-center gap-2 w-full">
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validEmail ? "text-green-500 h-5 w-5" : "hidden"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={
                    validEmail || !email ? "hidden" : "text-red-500 h-5 w-5"
                  }
                />
                <input
                  type="email"
                  id="email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setValidEmail(EMAIL_REGEX.test(e.target.value));
                  }}
                  value={email}
                  required
                  placeholder="Email"
                  className="grow"
                />
              </label>

              <label className="input input-bordered flex items-center gap-2 w-full">
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validPwd ? "text-green-500 h-5 w-5" : "hidden"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={
                    validPwd || !pwd ? "hidden" : "text-red-500 h-5 w-5"
                  }
                />
                <input
                  type="password"
                  id="password"
                  onChange={(e) => {
                    setPwd(e.target.value);
                    setValidPwd(PWD_REGEX.test(e.target.value));
                  }}
                  value={pwd}
                  required
                  placeholder="Password"
                  className="grow"
                />
              </label>

              <label className="input input-bordered flex items-center gap-2 w-full">
                <FontAwesomeIcon
                  icon={faCheck}
                  className={
                    validMatch && matchPwd ? "text-green-500 h-5 w-5" : "hidden"
                  }
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={
                    validMatch || !matchPwd ? "hidden" : "text-red-500 h-5 w-5"
                  }
                />
                <input
                  type="password"
                  id="confirm_pwd"
                  onChange={(e) => {
                    setMatchPwd(e.target.value);
                    setValidMatch(e.target.value === pwd);
                  }}
                  value={matchPwd}
                  required
                  placeholder="Confirm Password"
                  className="grow"
                />
              </label>

              <button
                className="btn btn-primary w-full"
                disabled={!validName || !validEmail || !validPwd || !validMatch}
              >
                Sign Up
              </button>
            </form>
            <p className="text-center">
              Already registered?
              <br />
              <Link to="/Login" className="text-blue-500 hover:text-blue-700">
                Login
              </Link>
            </p>
          </div>
        </section>
      )}
    </>
  );
};

export default Register;
