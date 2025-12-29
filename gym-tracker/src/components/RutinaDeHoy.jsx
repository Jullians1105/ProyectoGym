import { ejerciciosPorDia } from "../data/ejercicios";
import { useEffect,useState } from "react";

function RutinaDeHoy({onSaved}) {
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

    const yyyy = hoy.getFullYear()
    const mm = String(hoy.getMonth () + 1).padStart (2, "0")
    const dd = String(hoy.getDate()).padStart(2, "0")
    const fechaISO = `${yyyy}-${mm}-${dd}` // "2025-06-15"
    
    const rutina = ejerciciosPorDia[diaNombre] || ["Descanso"];


    
    
    const storageKey = `Dia entreno -${fechaISO}-${diaNombre}`
    const pesosDiaKey = `PesosDia-${fechaISO}-${diaNombre}`

    const [completados, setCompletados] = useState (() => {
        const guardado = localStorage.getItem(storageKey)
        return guardado ? JSON.parse(guardado) : []
    })

    const [pesosHoy, setPesosHoy] = useState (() => {
        const guardado = localStorage.getItem(pesosDiaKey)
        return guardado ? JSON.parse (guardado) : {}
    })

        useEffect (() => {
        localStorage.setItem(pesosDiaKey, JSON.stringify(pesosHoy))
        if (onSaved) onSaved()
    }, [pesosDiaKey, pesosHoy, onSaved])

    const total = rutina.length
    const hechos = completados.length
    const pct = total > 0 ? Math.round ((hechos / total)* 100) : 0

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(completados))
        if (onSaved) onSaved()
    }, [storageKey, completados, onSaved])

    return (
        <div>
            <h2>Rutina de hoy</h2>
            <p>
                Hoy es: <strong>{diaNombre}</strong>
            </p>

            <p>
                Fecha: <strong>{fechaISO}</strong>
            </p>

            <p>
                Progreso hoy: <strong>{hechos}</strong> / {total} ({pct}%)
            </p>

            <p>Te toca:</p>

            <button onClick={() => setCompletados ([])}>
                Limpiar check de hoy
            </button>

            <ul>
                {rutina.map((item) => {
                    const hecho = completados.includes(item)
                    const dataPeso= pesosHoy[item] || {tipo: "Mancuerna", valor: ""}
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

                            <div style={{marginTop: "6px", display: "Flex", gap: "8px"}}>
                                <select
                                    Value={dataPeso.tipo}
                                    onChange = {(e) => {
                                        const nuevo = {...pesosHoy, [item]: {... dataPeso, tipo: e.target.value}}
                                        setPesosHoy (nuevo)
                                    }}
                                >
                                    <option value = "Mancuerna">Mancuerna</option>
                                    <option value = "Barra">Barra</option>
                                    <option value = "Máquina">Máquina</option>
                                    <option value = "Polea">Polea</option>
                                </select>

                                <input
                                    type="number"
                                    placeholder="Peso en libras"
                                    value={dataPeso.valor}
                                    onChange={(e) => {
                                        const nuevo = {...pesosHoy, [item]: {...dataPeso, valor: e.target.value}}
                                        setPesosHoy(nuevo)
                                    }}
                                    style={{width: "120px"}}
                                />
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default RutinaDeHoy;