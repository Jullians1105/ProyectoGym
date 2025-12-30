import  {useState} from "react";
import RutinaDeHoy from "./components/RutinaDeHoy";
import Historial from "./components/Historial";
import "./App.css";
// import Ejercicios from "./components/Ejercicios";

function App() {

  const [refreshHistorial, setRefreshHistorial] = useState (0)

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1 className="title">Gym Tracker</h1>
          <p className="subtitle"> Rutina + Historial + Pesos (local)</p>
        </div>

        <div className="grid">
          <div className="card">
            <RutinaDeHoy onSaved={() => setRefreshHistorial((v) => v + 1)} />
          </div>

          <div className="card">
            <Historial refresh={refreshHistorial} />
          </div>
    </div>

    {/* aqui se podria meter otra tarjeta (ejercicios) */}
  </div>
</div>
  );
}

export default App;