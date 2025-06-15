import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const defaultData = {
  followers: [1200, 1250, 1280, 1295, 1330, 1360, 1400],
  engagement: [
    { post: 1, likes: 320, comments: 25 },
    { post: 2, likes: 400, comments: 40 },
    { post: 3, likes: 290, comments: 10 },
    { post: 4, likes: 500, comments: 35 },
    { post: 5, likes: 450, comments: 30 },
  ],
  bestPostTime: "Wednesday 7 PM",
};

const AnalyticsDashboard = () => {
  const [data, setData] = useState(defaultData);

  const handleFileUpload = (e) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.followers && parsed.engagement && parsed.bestPostTime) {
          setData(parsed);
          alert("✅ Analytics data uploaded successfully!");
        } else {
          alert("⚠️ Uploaded file missing required fields.");
        }
      } catch {
        alert("❌ Invalid JSON file");
      }
    };
    fileReader.readAsText(e.target.files[0]);
  };

  const lineChartData = data.followers.map((followers, i) => ({
    day: `Day ${i + 1}`,
    followers,
  }));

  const barChartData = data.engagement.map((e) => ({
    post: `Post ${e.post}`,
    engagement: e.likes + e.comments,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-8">
      <div className="max-w-3xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-center items-center mb-10 mt-8 gap-6">
          <h2 className="text-4xl font-extrabold text-purple-800 drop-shadow-sm text-center ">
            📈 Instagram Analytics
          </h2>
          <label
            htmlFor="upload-json"
            className="cursor-pointer inline-block bg-purple-600 text-white font-semibold rounded-lg px-6 py-3 hover:bg-purple-700 transition shadow-md"
            title="Upload JSON file"
          >
            Upload JSON
          </label>
          <input
            id="upload-json"
            type="file"
            accept="application/json"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Follower Growth Card */}
        <section className="bg-white rounded-2xl shadow-xl p-6 mb-8 hover:shadow-purple-400 transition-shadow max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-purple-700 mb-4 border-b border-purple-200 pb-2">
            📊 Follower Growth
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d6bcfa" />
              <XAxis dataKey="day" stroke="#7c3aed" />
              <YAxis stroke="#7c3aed" />
              <Tooltip
                contentStyle={{ backgroundColor: '#fafafa', borderRadius: '8px', borderColor: '#7c3aed' }}
                itemStyle={{ color: '#7c3aed' }}
              />
              <Line
                type="monotone"
                dataKey="followers"
                stroke="#8b5cf6"
                strokeWidth={3}
                activeDot={{ r: 6 }}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* Engagement Rate Card */}
        <section className="bg-white rounded-2xl shadow-xl p-6 mb-8 hover:shadow-green-400 transition-shadow max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-green-700 mb-4 border-b border-green-200 pb-2">
            ❤️ Engagement Rate
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#a7f3d0" />
              <XAxis dataKey="post" stroke="#047857" />
              <YAxis stroke="#047857" />
              <Tooltip
                contentStyle={{ backgroundColor: '#f0fdf4', borderRadius: '8px', borderColor: '#047857' }}
                itemStyle={{ color: '#047857' }}
              />
              <Bar dataKey="engagement" fill="#34d399" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* Best Time to Post Card */}
        <section className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-yellow-400 transition-shadow max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-yellow-600 mb-2 border-b border-yellow-200 pb-2">
            ⏰ Best Time to Post
          </h3>
          <p className="text-gray-900 text-xl font-medium tracking-wide">{data.bestPostTime}</p>
        </section>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
