import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MoodSelector from "./MoodSelector";
import EntriesPage from "./EntriesPage";

function App() {
  const [moodEntries, setMoodEntries] = useState([]);

  const handleUpdateEntry = (id, updatedEntry) => {
    const updatedEntries = moodEntries.map((entry) =>
      entry.id === id ? updatedEntry : entry
    );
    setMoodEntries(updatedEntries);
    localStorage.setItem("moodEntries", JSON.stringify(updatedEntries));
  };

  const handleDeleteEntry = (id) => {
    const updatedEntries = moodEntries.filter((entry) => entry.id !== id);
    setMoodEntries(updatedEntries);
    localStorage.setItem("moodEntries", JSON.stringify(updatedEntries));
  };

  return (
    <Router basename="/MoodWeather">
      <Routes>
        <Route
          path="/"
          element={
            <MoodSelector
              moodEntries={moodEntries}
              setMoodEntries={setMoodEntries}
            />
          }
        />
        <Route
          path="/entries"
          element={
            <EntriesPage
              moodEntries={moodEntries}
              onUpdateEntry={handleUpdateEntry}
              onDeleteEntry={handleDeleteEntry}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
