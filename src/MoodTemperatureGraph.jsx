import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define mood data with colors and emojis
const moods = [
  { label: "Happy", emoji: "😊", bgColor: "bg-green-300" },
  { label: "Sad", emoji: "😞", bgColor: "bg-blue-300" },
  { label: "Angry", emoji: "😠", bgColor: "bg-red-300" },
  { label: "Relaxed", emoji: "😌", bgColor: "bg-teal-300" },
  { label: "Thoughtful", emoji: "🤔", bgColor: "bg-purple-300" },
];

const MoodTemperatureGraph = ({ moodEntries }) => {
  // Define mood numeric values
  const moodValues = {
    Happy: 5,
    Sad: 1,
    Angry: 2,
    Relaxed: 4,
    Thoughtful: 3,
  };

  // Process and validate data
  const processData = () => {
    try {
      return moodEntries
        .filter((entry) => {
          // Validate entry structure
          if (!entry || !entry.weather || !entry.mood) return false;

          // Validate temperature
          const temp = parseFloat(entry.weather.temperature);
          if (isNaN(temp) || entry.weather.temperature === "N/A") return false;

          // Validate mood
          if (!moodValues.hasOwnProperty(entry.mood.label)) return false;

          // Validate date
          const entryDate = new Date(entry.date);
          return !isNaN(entryDate.getTime());
        })
        .map((entry) => ({
          date: new Date(entry.date).toLocaleDateString(),
          fullDate: new Date(entry.date),
          temperature: parseFloat(entry.weather.temperature),
          moodValue: moodValues[entry.mood.label],
          moodLabel: entry.mood.label,
          moodEmoji: entry.mood.emoji,
          moodColor: entry.mood.bgColor,
          weatherDescription: entry.weather.description || "Unknown",
          note: entry.note || "",
        }))
        .sort((a, b) => a.fullDate - b.fullDate);
    } catch (error) {
      console.error("Error processing mood entries:", error);
      return [];
    }
  };

  const chartData = processData();

  // Chart configuration
  const data = {
    labels: chartData.map((item) => item.date),
    datasets: [
      {
        label: "Temperature (°C)",
        data: chartData.map((item) => item.temperature),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.3,
        yAxisID: "y",
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Mood (1-5 scale)",
        data: chartData.map((item) => item.moodValue),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 0.3,
        yAxisID: "y1",
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            if (label) {
              return `${label}: ${context.parsed.y}`;
            }
            return null;
          },
          afterBody: (context) => {
            const dataIndex = context[0].dataIndex;
            const entry = chartData[dataIndex];
            return [
              `Mood: ${entry.moodLabel} ${entry.moodEmoji}`,
              `Date: ${entry.date}`,
              `Temperature: ${entry.temperature}°C`,
            ];
          },
          footer: (context) => {
            const dataIndex = context[0].dataIndex;
            const entry = chartData[dataIndex];
            return [
              `Weather: ${entry.weatherDescription}`,
              `Note: ${
                entry.note
                  ? entry.note.substring(0, 30) +
                    (entry.note.length > 30 ? "..." : "")
                  : "None"
              }`,
            ];
          },
        },
        displayColors: true,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1a202c",
        bodyColor: "#2d3748",
        footerColor: "#4a5568",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
      legend: {
        position: "top",
        labels: {
          boxWidth: 12,
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      title: {
        display: true,
        text: "Mood vs Temperature Correlation",
        font: {
          size: 16,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Temperature (°C)",
          font: {
            weight: "bold",
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        min: 0,
        max: 6,
        title: {
          display: true,
          text: "Mood (1-5 scale)",
          font: {
            weight: "bold",
          },
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          stepSize: 1,
          callback: (value) => {
            const moodMap = {
              1: "😞 Sad",
              2: "😠 Angry",
              3: "🤔 Thoughtful",
              4: "😌 Relaxed",
              5: "😊 Happy",
            };
            return moodMap[value] || value;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      {chartData.length > 1 ? (
        <>
          <div className="h-96">
            <Line options={options} data={data} />
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Mood Scale</h3>
              {[5, 4, 3, 2, 1].map((value) => (
                <div key={value} className="flex items-center gap-2 mb-1">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                    style={{
                      backgroundColor: moods
                        .find((m) => moodValues[m.label] === value)
                        .bgColor.replace("bg-", "")
                        .replace("-300", "-500"),
                    }}
                  >
                    {moods.find((m) => moodValues[m.label] === value).emoji}
                  </span>
                  <span className="text-gray-600">
                    {value} ={" "}
                    {moods.find((m) => moodValues[m.label] === value).label}
                  </span>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Key</h3>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded-full bg-teal-400"></div>
                <span className="text-gray-600">Temperature (°C)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-400"></div>
                <span className="text-gray-600">Mood Level (1-5)</span>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                <p>Hover over points to see details</p>
                <p>Click and drag to zoom (on desktop)</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-1">
            Not enough data
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {chartData.length === 1
              ? "You need at least 2 mood entries with weather data to generate the graph."
              : "No entries with valid weather data found in your mood history."}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Track more moods with weather information to see correlations.
          </p>
        </div>
      )}
    </div>
  );
};

export default MoodTemperatureGraph;
