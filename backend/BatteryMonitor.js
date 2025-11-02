import React, { useEffect, useState } from "react";

function BatteryMonitor() {
  const [batteryData, setBatteryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  // Fetch data from backend
  const fetchData = async () => {
    try {
      const response = await ffetch("http://10.0.0.43:5000/api/soh");
      const data = await response.json();
      setBatteryData(data);
      setError("");
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("⚠️ Unable to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 5 seconds
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
      setTime(new Date().toLocaleTimeString());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Healthy":
        return { color: "#a970ff", text: "Battery operating normally ✅" };
      case "Warning":
        return { color: "#ffb84d", text: "Battery health declining ⚠️" };
      case "Critical":
        return { color: "#ff4d4d", text: "Battery at critical level ❌" };
      default:
        return { color: "#bbb", text: "Unknown status" };
    }
  };

  const batteryStyle = {
    height: "200px",
    width: "90px",
    border: "3px solid #a970ff",
    borderRadius: "10px",
    position: "relative",
    backgroundColor: "#1a1a1a",
    margin: "20px auto",
  };

  const batteryLevel = {
    position: "absolute",
    bottom: 0,
    height: `${batteryData ? batteryData.SOH * 100 : 0}%`,
    width: "100%",
    background:
      batteryData && batteryData.SOH >= 0.7
        ? "#a970ff"
        : batteryData.SOH >= 0.4
        ? "#ffb84d"
        : "#ff4d4d",
    borderBottomLeftRadius: "6px",
    borderBottomRightRadius: "6px",
    transition: "height 0.5s ease",
  };

  const capStyle = {
    position: "absolute",
    top: "-10px",
    left: "25%",
    width: "50%",
    height: "10px",
    backgroundColor: "#a970ff",
    borderRadius: "2px",
  };

  return (
    <div
      style={{
        fontFamily: "Poppins, Arial, sans-serif",
        background: "linear-gradient(135deg, #0b0b0d, #1a001f)",
        color: "white",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          color: "#a970ff",
          marginBottom: "10px",
          textShadow: "0 0 10px #a970ff",
        }}
      >
        🔋 Battery Health Monitor
      </h1>
      <p style={{ color: "#ccc" }}>Last updated: {time}</p>

      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : batteryData ? (
        <div
          style={{
            backgroundColor: "#141414",
            padding: "40px 70px",
            borderRadius: "20px",
            boxShadow: "0 0 30px rgba(169, 112, 255, 0.2)",
            textAlign: "center",
            marginTop: "20px",
            border: "1px solid #2b003b",
          }}
        >
          <div style={batteryStyle}>
            <div style={capStyle}></div>
            <div style={batteryLevel}></div>
          </div>

          <h2 style={{ color: "#fff" }}>
            State of Health: {(batteryData.SOH * 100).toFixed(1)}%
          </h2>
          <h3 style={{ color: getStatusStyle(batteryData.status).color }}>
            {batteryData.status}
          </h3>
          <p style={{ color: "#aaa" }}>{getStatusStyle(batteryData.status).text}</p>

          <button
            onClick={fetchData}
            style={{
              marginTop: "20px",
              padding: "12px 30px",
              border: "none",
              borderRadius: "10px",
              backgroundColor: "#a970ff",
              color: "white",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              boxShadow: "0 0 15px #a970ff",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#caa3ff")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#a970ff")}
          >
            🔄 Refresh Now
          </button>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}

export default BatteryMonitor;
