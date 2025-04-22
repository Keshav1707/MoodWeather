import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EntriesPage = ({ moodEntries, onUpdateEntry, onDeleteEntry }) => {
  const navigate = useNavigate();
  const [editingEntry, setEditingEntry] = useState(null);
  const [editedNote, setEditedNote] = useState("");

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setEditedNote(entry.note);
  };

  const handleSaveEdit = () => {
    onUpdateEntry(editingEntry.id, { ...editingEntry, note: editedNote });
    setEditingEntry(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      onDeleteEntry(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-purple-600 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Your Mood Journal</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors"
          >
            Back to Mood Tracker
          </button>
        </div>

        <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-4 md:p-6">
          {moodEntries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">
                No entries yet. Start tracking your moods!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {moodEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="border-b border-gray-200 pb-4 last:border-0"
                >
                  {editingEntry?.id === entry.id ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-2xl ${entry.mood.bgColor} p-2 rounded-full`}
                          >
                            {entry.mood.emoji}
                          </span>
                          <span className="text-lg font-medium">
                            {entry.mood.label}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>
                      <textarea
                        value={editedNote}
                        onChange={(e) => setEditedNote(e.target.value)}
                        className="w-full h-32 p-3 border border-gray-300 rounded-md"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingEntry(null)}
                          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-2xl ${entry.mood.bgColor} p-2 rounded-full`}
                          >
                            {entry.mood.emoji}
                          </span>
                          <span className="text-lg font-medium">
                            {entry.mood.label}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-3 mb-3 pl-14">
                        <p className="whitespace-pre-wrap">{entry.note}</p>
                      </div>
                      {entry.weather && (
                        <div className="flex items-center gap-2 pl-14">
                          {entry.weather.icon && (
                            <img
                              src={entry.weather.icon}
                              alt={entry.weather.description}
                              className="w-6"
                            />
                          )}
                          <span className="text-sm text-gray-600">
                            {entry.weather.description},{" "}
                            {entry.weather.temperature}°C
                          </span>
                        </div>
                      )}
                      <div className="flex justify-end gap-2 mt-3">
                        <button
                          onClick={() => handleEdit(entry)}
                          className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EntriesPage;
