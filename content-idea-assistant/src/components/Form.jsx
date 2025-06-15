import React, { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";

const Form = () => {
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("fitness");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/analytics");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setSaveMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/generate-idea", {
        topic,
        niche,
      });

      setResult(response.data);

      try {
        await axios.post("http://localhost:5000/idea/save", {
          topic,
          niche,
          ...response.data,
        });
        setSaveMessage("✅ Idea saved to Content Bank!");
      } catch (saveError) {
        console.error("Save Error:", saveError);
        setSaveMessage("⚠️ Idea generated but could not be saved.");
      }
    } catch (err) {
      console.error("Generate Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById("result-card");
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10);
    pdf.save("idea.pdf");
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3 py-5 position-relative">
      
      {/* Top-Right Button */}
      <button
        className="btn btn-outline-primary position-absolute top-0 end-0 m-4"
        onClick={handleNavigation}
      >
        ➕ Analytics
      </button>

      <div className="bg-white rounded-4 shadow p-4 w-100" style={{ maxWidth: "800px" }}>
        <h2 className="text-center fw-bold mb-4 text-primary">🎯 Content Idea Generator</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter a topic..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <select
              className="form-select form-select-lg"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              required
            >
              <option value="">Select a niche...</option>
              <option value="fitness">🏋️‍♀️ Fitness</option>
              <option value="fashion">👗 Fashion</option>
              <option value="finance">💸 Finance</option>
              <option value="food">🍲 Food</option>
              <option value="technology">💻 Technology</option>
            </select>
          </div>

          <div className="d-grid mb-3">
            <button
              type="submit"
              className="btn btn-danger btn-lg"
              disabled={loading}
            >
              {loading ? "Generating..." : "✨ Generate Idea"}
            </button>
          </div>
        </form>

        {error && <p className="text-danger text-center mt-2">{error}</p>}
        {saveMessage && (
          <p className="text-success text-center fw-medium mt-2">{saveMessage}</p>
        )}

        {result && (
          <>
            <div className="row g-4 mt-4" id="result-card">
              <div className="col-md-6">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title fw-bold">📽 Reel Idea</h5>
                    <p className="card-text">{result.idea}</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title fw-bold">📝 Caption</h5>
                    <p className="card-text">{result.caption}</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title fw-bold">📢 Hook</h5>
                    <p className="card-text">{result.hook}</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title fw-bold">#️⃣ Hashtags</h5>
                    <p className="card-text">{result.hashtags}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-end mt-4">
              <button onClick={handleDownloadPDF} className="btn btn-primary">
                📥 Download as PDF
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Form;
