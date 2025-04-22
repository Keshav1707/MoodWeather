import React, { useState, useEffect } from "react";
import ReactCalendar from "react-calendar";
import useWeather from "./useWeather";
import "react-calendar/dist/Calendar.css";

const moods = [
  { id: 1, emoji: "😊", label: "Happy", bgColor: "bg-yellow-300" },
  { id: 2, emoji: "😞", label: "Sad", bgColor: "bg-blue-300" },
  { id: 3, emoji: "😠", label: "Angry", bgColor: "bg-red-300" },
  { id: 4, emoji: "😌", label: "Relaxed", bgColor: "bg-green-300" },
  { id: 5, emoji: "🤔", label: "Thoughtful", bgColor: "bg-purple-300" },
];

function MoodSelector() {
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [moodEntries, setMoodEntries] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeView, setActiveView] = useState("mood");

  // Fetching weather using useWeather hook
  const { weather, loading, error } = useWeather(latitude, longitude);

  // Load past entries from localStorage when component mounts
  useEffect(() => {
    const savedEntries = localStorage.getItem("moodEntries");
    if (savedEntries) {
      setMoodEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save entries to localStorage whenever moodEntries change
  useEffect(() => {
    if (moodEntries.length > 0) {
      localStorage.setItem("moodEntries", JSON.stringify(moodEntries));
    }
  }, [moodEntries]);

  const isTodayEntryExisting = moodEntries.some(
    (entry) => new Date(entry.date).toDateString() === new Date().toDateString()
  );

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };

  const handleSave = () => {
    if (selectedMood && note) {
      const newEntry = {
        id: Date.now(),
        mood: selectedMood,
        note: note,
        date: new Date().toISOString(),
        weather: weather || {
          description: "Unknown",
          temperature: "N/A",
          icon: "",
        },
      };

      const updatedEntries = [newEntry, ...moodEntries];
      setMoodEntries(updatedEntries); // Update state
      setSelectedMood(null);
      setNote("");
      setActiveView("entries");
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const getWeatherGradient = () => {
    if (!weather) return "bg-gradient-to-t from-orange-500 to-purple-500";
    const temp = parseFloat(weather.temperature);
    if (isNaN(temp)) return "bg-gradient-to-t from-blue-500 to-purple-500";
    if (temp < 10) {
      return "bg-gradient-to-t from-blue-500 to-cyan-500";
    } else if (temp < 25) {
      return "bg-gradient-to-t from-yellow-400 to-orange-500";
    } else {
      return "bg-gradient-to-t from-red-500 to-yellow-500";
    }
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Geolocation logic for fetching the user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLatitude(lat);
          setLongitude(lon);
        },
        (error) => {
          console.error("Geolocation failed:", error);
          setLatitude(37.7749); // Fallback location (San Francisco)
          setLongitude(-122.4194);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLatitude(37.7749); // Fallback location (San Francisco)
      setLongitude(-122.4194);
    }
  }, []);

  // Format today's date
  const todayDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div
      className={`min-h-screen ${getWeatherGradient()} p-6 flex items-center justify-center`}
    >
      <div className="w-full max-w-6xl bg-white bg-opacity-90 p-6 rounded-xl shadow-sm flex flex-col md:flex-row gap-6">
        {activeView === "mood" ? (
          <>
            {/* Left Column */}
            <div className="w-full md:w-1/2 flex flex-col">
              {/* Weather Display */}
              {weather && (
                <div className="self-end mb-4 p-3 bg-white bg-opacity-80 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    {weather.icon && (
                      <img
                        src={weather.icon}
                        alt={weather.description}
                        className="w-8"
                      />
                    )}
                    <div>
                      <p className="capitalize text-sm font-medium">
                        {weather.description}
                      </p>
                      <p className="text-sm">{weather.temperature}°C</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Content */}
              <div className="flex-1 flex flex-col items-center text-center">
                <p className="text-xl font-medium text-gray-600 mb-4">
                  {todayDate}
                </p>

                <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                  How are you feeling today?
                </h1>
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {moods.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => handleMoodSelect(mood)}
                      className={`p-3 rounded-full ${
                        mood.bgColor
                      } text-2xl transition-all 
                      ${
                        selectedMood?.id === mood.id
                          ? "scale-125 shadow-md"
                          : "hover:scale-110"
                      }`}
                    >
                      {mood.emoji}
                    </button>
                  ))}
                </div>

                <textarea
                  value={note}
                  onChange={handleNoteChange}
                  placeholder="Write a short note about your day..."
                  className="w-full h-48 p-3 border-2 border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                  rows="4"
                />

                <div className="w-full space-y-3">
                  <button
                    onClick={handleSave}
                    disabled={!selectedMood || !note || isTodayEntryExisting}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all 
                    ${
                      selectedMood && note && !isTodayEntryExisting
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Save Mood
                  </button>
                  <button
                    onClick={() => setActiveView("entries")}
                    className="w-full py-3 px-6 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    View Past Entries
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Calendar */}
            <div className="w-full md:w-1/2 flex flex-col gap-6">
              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <ReactCalendar
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="custom-calendar"
                  tileClassName={({ date }) =>
                    `p-2 ${
                      moodEntries.some(
                        (e) =>
                          new Date(e.date).toDateString() ===
                          date.toDateString()
                      )
                        ? "relative bg-blue-50"
                        : ""
                    }`
                  }
                  tileContent={({ date }) =>
                    moodEntries.some(
                      (e) =>
                        new Date(e.date).toDateString() === date.toDateString()
                    ) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                          {date.getDate()}
                        </div>
                      </div>
                    )
                  }
                />
              </div>
            </div>
          </>
        ) : (
          // Past Entries View (Full Width)
          <div className="w-full flex flex-col">
            <div className="flex justify-between items-center w-full mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Past Entries
              </h2>
              <button
                onClick={() => setActiveView("mood")}
                className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
              >
                <span>←</span>
                <span>Back</span>
              </button>
            </div>

            <div className="w-full h-[500px] overflow-y-auto space-y-4 pr-2 grid grid-cols-2 gap-6">
              {moodEntries.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className="group bg-white p-4 rounded-lg border border-gray-100 
                  hover:border-blue-200 cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-2xl ${entry.mood.bgColor} p-2 rounded-full`}
                      >
                        {entry.mood.emoji}
                      </span>
                      <span className="font-medium text-gray-700">
                        {entry.mood.label}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 line-clamp-2 text-left">
                    {entry.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Entry Detail Modal */}
        {selectedEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white max-w-2xl w-full rounded-xl p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold">
                  {selectedEntry.mood.label}
                </h3>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-500">
                  <span
                    className={`text-2xl ${selectedEntry.mood.bgColor} p-2 rounded-full`}
                  >
                    {selectedEntry.mood.emoji}
                  </span>
                  <span>
                    {new Date(selectedEntry.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {selectedEntry.note}
                </p>
                {selectedEntry.weather && (
                  <div className="flex items-center gap-2 text-gray-500">
                    {selectedEntry.weather.icon && (
                      <img
                        src={selectedEntry.weather.icon}
                        alt={selectedEntry.weather.description}
                        className="w-6"
                      />
                    )}
                    <span>
                      {selectedEntry.weather.description},{" "}
                      {selectedEntry.weather.temperature}°C
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MoodSelector;
