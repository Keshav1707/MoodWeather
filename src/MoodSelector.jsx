import React, { useState, useEffect } from "react";
import ReactCalendar from "react-calendar";
import useWeather from "./useWeather";
import "react-calendar/dist/Calendar.css";
import MoodTemperatureGraph from "./MoodTemperatureGraph";
const moods = [
  {
    id: 1,
    emoji: "😊",
    label: "Happy",
  },
  {
    id: 2,
    emoji: "😞",
    label: "Sad",
  },
  {
    id: 3,
    emoji: "😠",
    label: "Angry",
  },
  {
    id: 4,
    emoji: "😌",
    label: "Relaxed",
  },
  {
    id: 5,
    emoji: "🤔",
    label: "Thoughtful",
  },
];

function MoodSelector() {
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [moodEntries, setMoodEntries] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entryDate, setEntryDate] = useState(new Date());
  const [activeView, setActiveView] = useState("mood");
  const [isEditingPastEntry, setIsEditingPastEntry] = useState(false);

  const { weather } = useWeather(latitude, longitude);

  useEffect(() => {
    const savedEntries = localStorage.getItem("moodEntries");
    if (savedEntries) {
      setMoodEntries(JSON.parse(savedEntries));
    }
  }, []);

  useEffect(() => {
    if (moodEntries.length > 0) {
      localStorage.setItem("moodEntries", JSON.stringify(moodEntries));
    }
  }, [moodEntries]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        () => {
          setLatitude(37.7749);
          setLongitude(-122.4194);
        }
      );
    } else {
      setLatitude(37.7749);
      setLongitude(-122.4194);
    }
  }, []);

  const isDateEntryExisting = (date) => {
    return moodEntries.some(
      (entry) => new Date(entry.date).toDateString() === date.toDateString()
    );
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };

  const handleEntryDateChange = (date) => {
    setEntryDate(date);
    setIsEditingPastEntry(true);
  };

  const resetEntryForm = () => {
    setSelectedMood(null);
    setNote("");
    setEntryDate(new Date());
    setIsEditingPastEntry(false);
  };

  const handleSave = () => {
    if (selectedMood && note) {
      const newEntry = {
        id: Date.now(),
        mood: selectedMood,
        note: note,
        date: entryDate.toISOString(),
        weather: weather || {
          description: "Unknown",
          temperature: "N/A",
          icon: "",
        },
      };

      const dateExists = moodEntries.findIndex(
        (entry) =>
          new Date(entry.date).toDateString() === entryDate.toDateString()
      );

      let updatedEntries;
      if (dateExists >= 0) {
        updatedEntries = [...moodEntries];
        updatedEntries[dateExists] = newEntry;
      } else {
        updatedEntries = [newEntry, ...moodEntries].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
      }

      setMoodEntries(updatedEntries);
      resetEntryForm();
      setActiveView("entries");
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setEntryDate(date);
    setIsEditingPastEntry(true);
    setActiveView("mood");
  };

  const cancelPastEntry = () => {
    resetEntryForm();
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

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div
      className={`min-h-screen ${getWeatherGradient()} p-6 flex items-center justify-center`}
    >
      <div className="w-full max-w-6xl p-6 rounded-xl shadow-sm flex flex-col md:flex-row gap-6 justify-center items-center border-4 border-gray-300 bg-white">
        {activeView === "mood" ? (
          <>
            {/* Left Column */}
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
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

              {/* Main Content */}
              <div className="flex-1 flex flex-col items-center text-center">
                <div className="flex items-center justify-between w-full mb-4">
                  <p className="text-xl font-medium text-gray-600">
                    {isEditingPastEntry ? (
                      <span className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
                          Past Entry
                        </span>
                        {formatDate(entryDate)}
                      </span>
                    ) : (
                      formatDate(new Date())
                    )}
                  </p>

                  {isEditingPastEntry && (
                    <button
                      onClick={cancelPastEntry}
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

                {/* Mood Buttons */}
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {moods.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => handleMoodSelect(mood)}
                      className={`p-6 rounded-full bg-gray-100 hover:bg-gray-200 text-3xl transition-all ${
                        selectedMood?.id === mood.id
                          ? "scale-125 shadow-md"
                          : "hover:scale-110"
                      }`}
                    >
                      {mood.emoji}
                    </button>
                  ))}
                </div>

                {/* Note input */}
                <textarea
                  value={note}
                  onChange={handleNoteChange}
                  placeholder={`Write a note about ${
                    isEditingPastEntry ? "this day" : "your day"
                  }...`}
                  className="w-full h-48 p-3 border-2 border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                  rows="4"
                />

                {/* Save Button */}
                <div className="w-full space-y-3">
                  <button
                    onClick={handleSave}
                    disabled={!selectedMood || !note}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all 
                    ${
                      selectedMood && note
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isDateEntryExisting(entryDate)
                      ? "Update Entry"
                      : "Save Entry"}
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

            {/* Right Column - Calendar */}
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center gap-6">
              <div className="bg-white p-4 rounded-xl border border-gray-100 w-full md:w-auto">
                <p className="text-center text-gray-600 mb-4">
                  {isEditingPastEntry
                    ? "Select a different date to add entry"
                    : "Select a date to add a past entry"}
                </p>
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
          // Past Entries View
          <div className="w-full flex flex-col">
            <div className="flex justify-between items-center w-full mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Past Entries
              </h2>
              <div className="flex gap-4">
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
                <button
                  onClick={() => {
                    setActiveView("mood");
                    setIsEditingPastEntry(false);
                  }}
                  className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
                >
                  <span>←</span>
                  <span>Back</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {moodEntries.length > 0 ? (
                moodEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xl">{entry.mood.emoji}</span>
                      <p className="text-sm">{entry.note}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No entries yet</p>
              )}
            </div>
          </div>
        )}
      </div>
      <>
        <MoodTemperatureGraph moodEntries={moodEntries} />
      </>
    </div>
  );
}

export default MoodSelector;
