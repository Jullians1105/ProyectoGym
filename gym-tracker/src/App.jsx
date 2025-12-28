import  {useState} from "react";
import RutinaDeHoy from "./components/RutinaDeHoy";
import Historial from "./components/Historial";

function App() {

  const [refreshHistorial, setRefreshHistorial] = useState (0)

  return (
    <div>
      <h1> Gym Tracker</h1>
      <RutinaDeHoy  onSaved = {() => setRefreshHistorial ((v) => v + 1)}/>

      <hr />
      
      <Historial refresh={refreshHistorial} />
    </div>
  )
}

export default App;