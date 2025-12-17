import { useContext, useEffect, useState } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Dashboard.module.css";

// Chart imports
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Job {
  _id: string;
  company: string;
  role: string;
  status: string;
}

const Dashboard = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredStatus, setFilteredStatus] = useState("All");

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");

  const fetchJobs = async () => {
    try {
      const res = await api.get("/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
    } catch {
      alert("Failed to load jobs");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchJobs();
  }, [token, navigate]);

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(
        "/jobs",
        { company, role, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompany("");
      setRole("");
      setStatus("Applied");
      fetchJobs();
    } catch {
      alert("Failed to add job");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchJobs();
    } catch {
      alert("Failed to delete job");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // FILTER LOGIC
  const displayedJobs =
    filteredStatus === "All"
      ? jobs
      : jobs.filter((job) => job.status === filteredStatus);

  // CHART DATA
  const statusCount = {
    Applied: jobs.filter((j) => j.status === "Applied").length,
    Interview: jobs.filter((j) => j.status === "Interview").length,
    Offer: jobs.filter((j) => j.status === "Offer").length,
    Rejected: jobs.filter((j) => j.status === "Rejected").length,
  };

  const chartData = {
    labels: ["Applied", "Interview", "Offer", "Rejected"],
    datasets: [
      {
        data: Object.values(statusCount),
        backgroundColor: ["#007bff", "#ff9800", "#4caf50", "#f44336"],
      },
    ],
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Job Application Dashboard</h2>
        <button className={styles.button} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* CHART */}
      <div className={styles.chartWrapper}>
  <Pie
  data={chartData}
  options={{
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1200,
      easing: "easeInOutQuart",
    },
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  }}
/>

</div>


      {/* FILTER */}
      <div className={styles.filter}>
        <label>Filter by Status: </label>
        <select
          value={filteredStatus}
          onChange={(e) => setFilteredStatus(e.target.value)}
        >
          <option>All</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
      </div>

      {/* ADD JOB */}
      <form className={styles.form} onSubmit={handleAddJob}>
        <input
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
        <input
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
        <button className={styles.button} type="submit">
          Add Job
        </button>
      </form>

      {/* JOB LIST */}
      {displayedJobs.length === 0 && <p>No jobs found</p>}

      {displayedJobs.map((job) => (
        <div key={job._id} className={styles.card}>
          <div>
            <strong>{job.company}</strong> — {job.role}{" "}
            <span
              className={`${styles.badge} ${
                styles[job.status.toLowerCase()]
              }`}
            >
              {job.status}
            </span>
          </div>
          <button
            className={styles.button}
            onClick={() => handleDelete(job._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
