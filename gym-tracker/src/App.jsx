import  {useState} from "react";
import RutinaDeHoy from "./components/RutinaDeHoy";
import Historial from "./components/Historial";
import Ejercicios from "./components/Ejercicios";

function App() {

  const [refreshHistorial, setRefreshHistorial] = useState (0)

  return (
    <div style ={{maxWidth: "900px", margin: "0 auto", padding: "24px"}}>
      <h1> Gym Tracker</h1>
      <RutinaDeHoy  onSaved = {() => setRefreshHistorial ((v) => v + 1)}/>

      <hr />
      
      <Historial refresh={refreshHistorial} />
      <Ejercicios />
    </div>
  )
}

export default App;