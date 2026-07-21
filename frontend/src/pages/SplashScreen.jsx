import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SplashScreen.css";

import logo from "../assets/logo.png";

export default function SplashScreen() {

  const navigate = useNavigate();

  useEffect(() => {

    const timer = setTimeout(() => {
      navigate("/home");
    }, 3000);

    return () => clearTimeout(timer);

  }, [navigate]);

  return (

    <div className="splash">

      <img
        src={logo}
        alt="Mytrix"
        className="splash-logo"
      />

      <h1>MYTRIX</h1>

      <p>Turn Repositories Into Intelligence.</p>

    </div>

  );

}