import { ejerciciosPorDia } from "../data/ejercicios";
import { useState } from "react";

function RutinaDeHoy() {
    const hoy = new Date();

    const dias = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
    ];

    const diaNombre = dias[hoy.getDay()];

    const rutina = ejerciciosPorDia[diaNombre] || ["Descanso"];

    const [completados, setCompletados] = useState([])

    return (
        <div>
            <h2>Rutina de hoy</h2>
            <p>
                Hoy es: <strong>{diaNombre}</strong>
            </p>

            <p>Te toca:</p>
            <ul>
                {rutina.map((item) => {
                    const hecho = completados.includes(item)
                    return (
                        <li 
                            key={item}
                            onClick={() => {
                            if (hecho) {
                                    setCompletados(completados.filter((e) => e !== item))
                                } else {
                                    setCompletados([...completados, item])
                                }
                            }}
                            style={{
                                cursor: "pointer",
                                textDecoration: hecho ? "line-through" : "none",
                                color: hecho ? "gray" : "white",
                            }}
                        >
                            {hecho ? "✅ " : "⬜ "} {item}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default RutinaDeHoy;