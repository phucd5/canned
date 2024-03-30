import './App.css';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

const gMapsApi = "AIzaSyBJnQgOyRfOmaXUJS-uZP7KrcFKdAjZFok";

function App() {
  const position = { lat: 53.54992, lng: 10.00678 };
  return (
    <div className="App">

      <APIProvider apiKey={gMapsApi}>

        <Map
          defaultZoom={3}
          defaultCenter={{ lat: 22.54992, lng: 0 }}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        />
      </APIProvider>

    </div>
  );
}

export default App;
