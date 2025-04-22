import React, { useState, useEffect } from "react";
import ReactCalendar from "react-calendar";
import useWeather from "./useWeather";
import "react-calendar/dist/Calendar.css";
import MoodTemperatureGraph from "./MoodTemperatureGraph";

// Mood options with emojis and colors
const moodOptions = [
  { id: 1, emoji: "😊", label: "Happy", color: "bg-green-300" },
  { id: 2, emoji: "😞", label: "Sad", color: "bg-blue-300" },
  { id: 3, emoji: "😠", label: "Angry", color: "bg-red-300" },
  { id: 4, emoji: "😌", label: "Relaxed", color: "bg-teal-300" },
  { id: 5, emoji: "🤔", label: "Thoughtful", color: "bg-purple-300" },
];

function MoodTracker() {
  // State for tracking user's mood entries
  const [moodEntries, setMoodEntries] = useState([]);
  const [currentMood, setCurrentMood] = useState(null);
  const [journalNote, setJournalNote] = useState("");

  // Location and date state
  const [userLocation, setUserLocation] = useState({ lat: null, lon: null });
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date());
  const [entryDate, setEntryDate] = useState(new Date());

  // UI state
  const [activeView, setActiveView] = useState("mood");
  const [isEditingPastEntry, setIsEditingPastEntry] = useState(false);
  const [showGraphModal, setShowGraphModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Get weather data based on location
  const { weather } = useWeather(userLocation.lat, userLocation.lon);

  // Load saved entries when component mounts
  useEffect(() => {
    const savedEntries = localStorage.getItem("moodJournalEntries");
    if (savedEntries) {
      setMoodEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save entries whenever they change
  useEffect(() => {
    if (moodEntries.length > 0) {
      localStorage.setItem("moodJournalEntries", JSON.stringify(moodEntries));
    }
  }, [moodEntries]);

  // Get user's location on first load
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          () => {
            // Fallback to San Francisco if location access is denied
            setUserLocation({ lat: 37.7749, lon: -122.4194 });
          }
        );
      } else {
        // Fallback if geolocation isn't supported
        setUserLocation({ lat: 37.7749, lon: -122.4194 });
      }
    };

    getLocation();
  }, []);

  // Check if an entry exists for a specific date
  const hasEntryForDate = (date) => {
    return moodEntries.some(
      (entry) => new Date(entry.date).toDateString() === date.toDateString()
    );
  };

  // Handle saving a new mood entry
  const saveEntry = () => {
    if (!currentMood || !journalNote) return;

    const newEntry = {
      id: Date.now(),
      mood: currentMood,
      note: journalNote,
      date: entryDate.toISOString(),
      weather: weather || {
        description: "Unknown",
        temperature: "N/A",
        icon: "",
      },
    };

    // Check if we're updating an existing entry
    const existingEntryIndex = moodEntries.findIndex(
      (entry) =>
        new Date(entry.date).toDateString() === entryDate.toDateString()
    );

    let updatedEntries;
    if (existingEntryIndex >= 0) {
      updatedEntries = [...moodEntries];
      updatedEntries[existingEntryIndex] = newEntry;
    } else {
      updatedEntries = [newEntry, ...moodEntries].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    }

    setMoodEntries(updatedEntries);
    resetForm();
    setActiveView("entries");
  };

  // Reset the form to its initial state
  const resetForm = () => {
    setCurrentMood(null);
    setJournalNote("");
    setEntryDate(new Date());
    setIsEditingPastEntry(false);
  };

  // Handle selecting a date from the calendar
  const handleCalendarDateSelect = (date) => {
    setSelectedCalendarDate(date);
    setEntryDate(date);
    setIsEditingPastEntry(true);
    setActiveView("mood");
  };

  // Get background gradient based on current temperature
  const getBackgroundGradient = () => {
    if (!weather) return "bg-gradient-to-t from-orange-500 to-purple-500";

    const temp = parseFloat(weather.temperature);
    if (isNaN(temp)) return "bg-gradient-to-t from-blue-500 to-purple-500";

    if (temp < 10) return "bg-gradient-to-t from-blue-500 to-cyan-500";
    if (temp < 25) return "bg-gradient-to-t from-yellow-400 to-orange-500";
    return "bg-gradient-to-t from-red-500 to-yellow-500";
  };

  // Format date nicely for display
  const formatDisplayDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div
      className={`min-h-screen ${getBackgroundGradient()} p-6 flex items-center justify-center`}
    >
      <div className="w-full max-w-6xl p-6 rounded-xl shadow-sm flex flex-col md:flex-row gap-6 justify-center items-center border-4 border-gray-300 bg-white">
        {activeView === "mood" ? (
          // Mood Entry View
          <>
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
              {/* Weather Display */}
              {weather && (
                <div className="self-end mb-4 p-3 bg-white bg-opacity-80 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    {weather.icon && (
                      <img
                        src={weather.icon}
                        alt={weather.description}
                        className="w-12 h-12"
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

              {/* Main Entry Form */}
              <div className="flex-1 flex flex-col items-center text-center">
                <div className="flex items-center justify-between w-full mb-4">
                  <p className="text-xl font-medium text-gray-600">
                    {isEditingPastEntry ? (
                      <span className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
                          Past Entry
                        </span>
                        {formatDisplayDate(entryDate)}
                      </span>
                    ) : (
                      formatDisplayDate(new Date())
                    )}
                  </p>

                  {isEditingPastEntry && (
                    <button
                      onClick={resetForm}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                  How {isEditingPastEntry ? "were" : "are"} you feeling{" "}
                  {isEditingPastEntry ? "on this day" : "today"}?
                </h1>

                {/* Mood Selection */}
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => setCurrentMood(mood)}
                      className={`p-6 rounded-full bg-gray-100 hover:bg-gray-200 text-3xl transition-all ${
                        currentMood?.id === mood.id
                          ? "scale-125 shadow-md"
                          : "hover:scale-110"
                      }`}
                    >
                      {mood.emoji}
                    </button>
                  ))}
                </div>

                {/* Journal Note */}
                <textarea
                  value={journalNote}
                  onChange={(e) => setJournalNote(e.target.value)}
                  placeholder={`Write a note about ${
                    isEditingPastEntry ? "this day" : "your day"
                  }...`}
                  className="w-full h-48 p-3 border-2 border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                  rows="4"
                />

                {/* Action Buttons */}
                <div className="w-full space-y-3">
                  <button
                    onClick={saveEntry}
                    disabled={!currentMood || !journalNote}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all 
                    ${
                      currentMood && journalNote
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {hasEntryForDate(entryDate) ? "Update Entry" : "Save Entry"}
                  </button>

                  {!isEditingPastEntry && (
                    <button
                      onClick={() => setActiveView("entries")}
                      className="w-full py-3 px-6 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      View Past Entries
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Calendar Sidebar */}
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center gap-6">
              <div className="bg-white p-4 rounded-xl border border-gray-100 w-full md:w-auto">
                <p className="text-center text-gray-600 mb-4">
                  {isEditingPastEntry
                    ? "Select a different date to add entry"
                    : "Select a date to add a past entry"}
                </p>
                <ReactCalendar
                  value={selectedCalendarDate}
                  onChange={handleCalendarDateSelect}
                  className="custom-calendar"
                  tileClassName={({ date }) =>
                    `p-2 ${
                      moodEntries.some(
                        (entry) =>
                          new Date(entry.date).toDateString() ===
                          date.toDateString()
                      )
                        ? "relative bg-blue-50"
                        : ""
                    }`
                  }
                  tileContent={({ date }) =>
                    moodEntries.some(
                      (entry) =>
                        new Date(entry.date).toDateString() ===
                        date.toDateString()
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

              {/* View Graph Button */}
              {moodEntries.length > 1 && (
                <button
                  onClick={() => setShowGraphModal(true)}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 3v18h18" />
                    <path d="M18 17V9" />
                    <path d="M13 17V5" />
                    <path d="M8 17v-3" />
                  </svg>
                  View Mood Temperature Graph
                </button>
              )}
            </div>
          </>
        ) : (
          // Past Entries List View
          <div className="w-full flex flex-col">
            <div className="flex justify-between items-center w-full mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Your Mood Journal
              </h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowGraphModal(true)}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                  disabled={moodEntries.length <= 1}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 3v18h18" />
                    <path d="M18 17V9" />
                    <path d="M13 17V5" />
                    <path d="M8 17v-3" />
                  </svg>
                  View Graph
                </button>
                <button
                  onClick={() => {
                    setEntryDate(new Date());
                    setIsEditingPastEntry(false);
                    setActiveView("mood");
                  }}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  New Entry
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {moodEntries.length > 0 ? (
                moodEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedEntry(entry);
                      setEntryDate(new Date(entry.date));
                      setCurrentMood(
                        moodOptions.find((m) => m.id === entry.mood.id)
                      );
                      setJournalNote(entry.note);
                      setIsEditingPastEntry(true);
                      setActiveView("mood");
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{entry.mood.emoji}</span>
                      <div>
                        <p className="font-medium">{entry.mood.label}</p>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {entry.note}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No entries yet</p>
                  <button
                    onClick={() => setActiveView("mood")}
                    className="mt-4 text-blue-500 hover:text-blue-700"
                  >
                    Add your first entry
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Graph Modal */}
      {showGraphModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Your Mood & Weather Patterns
              </h2>
              <button
                onClick={() => setShowGraphModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>
            <div className="p-6">
              <MoodTemperatureGraph moodEntries={moodEntries} />
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowGraphModal(false)}
                className="py-2 px-6 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MoodTracker;
