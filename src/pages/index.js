import Link from "next/link";

export default function Home() {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Network and Communication Simulations</h1>
      <p>Select a simulation to explore:</p>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        <li>
          <Link href="/mcs" style={linkStyle}>
            MCS Simulation (Modulation and Coding Schemes)
          </Link>
        </li>
        <li>
          <Link href="/mimo" style={linkStyle}>
            Massive MIMO Simulation
          </Link>
        </li>
        <li>
          <Link href="/beamforming" style={linkStyle}>
            Beamforming Simulation
          </Link>
        </li>
        <li>
          <Link href="/mmwave" style={linkStyle}>
            mmWave Propagation Simulation
          </Link>
        </li>
        <li>
          <Link href="/slicing" style={linkStyle}>
            Network Slicing Simulation
          </Link>
        </li>
      </ul>
    </div>
  );
}

// Styling for links
const linkStyle = {
  display: "block",
  margin: "10px 0",
  padding: "10px",
  backgroundColor: "#0070f3",
  color: "white",
  borderRadius: "8px",
  textDecoration: "none",
  width: "300px",
  marginLeft: "auto",
  marginRight: "auto",
};
