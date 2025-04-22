# MoodWeather

MoodWeather is a simple yet powerful React application designed to help users track their moods alongside weather-related data, like temperature. The app dynamically changes the background color based on the selected mood and stores the user's entries locally for future reference. Users can view mood trends over time with a visual graph that plots their mood against temperature data.

## Features

### 1. Mood Selector
MoodWeather allows users to track their current emotional state by selecting one of five predefined moods:
![MoodWeather App Screenshot 1](https://github.com/Keshav1707/MoodWeather/blob/master/assets/images/Screenshot%202025-04-22%20213840.png?raw=true)
- **Happy**: A bright, warm background color like yellow or orange.
- **Sad**: A cool, darker background color such as blue or grey.
- **Neutral**: A balanced background color, like green, to indicate neither positive nor negative emotion.
- **Angry**: A strong, red background color to reflect frustration or anger.
- **Relaxed**: A calm, soothing background color like light blue or teal.

Once a user selects their mood, the app automatically changes the background color to match the mood's theme. This feature provides a visual cue for the user, making it easy to track their emotional states at a glance.

### 2. Entries Page
The Entries Page is where all the user's past mood entries are stored. The app allows the user to:
![MoodWeather App Screenshot 2](https://github.com/Keshav1707/MoodWeather/blob/master/assets/images/Screenshot%202025-04-22%20213851.png?raw=true) 
- View all past mood entries.
- Update an entry if necessary (e.g., editing a mood or adding additional notes).
- Delete an entry to remove it from the list.

Each entry records the mood, temperature (if available), and any additional notes the user may want to add.

### 3. Mood Graph
The Mood Graph is a visual representation of how the user's mood has fluctuated over time. The graph plots mood data against temperature, allowing the user to see the correlation between their emotional state and the temperature at the time of the entry.
![MoodWeather App Screenshot 3](https://github.com/Keshav1707/MoodWeather/blob/master/assets/images/Screenshot%202025-04-22%20213909.png?raw=true)

- **Mood vs Temperature**: The X-axis of the graph represents the dates or times when entries were made, and the Y-axis represents the mood intensity or temperature. This visualization helps users identify patterns between their mood changes and the weather.

- **Graphing Details**: Each data point on the graph corresponds to a specific entry, showing how mood and temperature evolved. This helps users identify patterns, such as whether warmer temperatures correlate with happiness or cooler temperatures with sadness.

### 4. Responsive Design
The app is designed to be fully responsive, ensuring that it works seamlessly across various screen sizes, including both mobile and desktop devices.

- **Mobile Optimization**: On mobile devices, the app uses a compact design to make navigation easier, with the mood selector and entries being scrollable and touch-friendly.

- **Desktop Layout**: On desktop, the app leverages the additional screen real estate to display mood trends, the graph, and the entries in a more spacious layout.

### 5. Persistent Data
All user entries are saved in the browser's localStorage, so data persists even after a page refresh or browser restart.

- **Saving Data**: Whenever a user adds a new mood entry, the data is stored locally in the browser.

- **Automatic Loading**: When the app is reopened, the previous entries are automatically loaded from localStorage.

### 6. Add Old Entries
Users can manually add old mood entries from the past. This feature is useful for users who want to track their mood history but may not have entered data regularly.




## Setup

### Prerequisites
Before you begin, ensure you have the following software installed:

- Node.js: Version 16.x or higher (to install Node.js, visit nodejs.org).
- Yarn (optional, you can also use npm): A package manager for JavaScript that simplifies the management of dependencies.

### Install Dependencies
To install the required dependencies for the project, run:

```bash
yarn install
```

Alternatively, if you prefer to use npm, run:

```bash
npm install
```

### Run the App Locally
Once the dependencies are installed, start the development server:

```bash
yarn dev
```

or:

```bash
npm run dev
```

This will start the app on http://localhost:3000.

### Build for Production
To build the app for production, run:

```bash
yarn build
```

or:

```bash
npm run build
```

### Deploy to GitHub Pages
To deploy your app to GitHub Pages:

1. Update the homepage field in package.json
2. Run the deploy command:

```bash
yarn deploy
```

or:

```bash
npm run deploy
```

This will make your app publicly available at:
```
[https://your-username.github.io/your-repository-name/](https://keshav1707.github.io/MoodWeather/)
```

## Contributing
Contributions are welcome! If you'd like to improve the app or fix issues, please follow these steps:

1. Fork the repository.
2. Create a new branch.
3. Make your changes and commit them.
4. Open a pull request with a clear description of what you've changed.

## License
This project is licensed under the MIT License.

## Contact
For any questions or suggestions, feel free to reach out at keshavdewaker@gmail.com
