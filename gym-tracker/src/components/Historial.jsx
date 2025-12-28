import {useMemo} from "react"

function Historial ({refresh}) {
    const sesiones =useMemo (() => {
        const result = []

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)

        if (key.startsWith ("Dia entreno -")) {
            const [, fecha, dia] = key.split("-")
            const ejercicios = JSON.parse(localStorage.getItem(key))

            result.push({
                fecha,
                dia,
                ejercicios,
            })
        }
    }

    // Ordenar por fecha, de más reciente a más antigua
    result.sort ((a,b) => b.fecha.localeCompare(a.fecha))

    return result
}, [refresh])

    return (
        <div>
            <h2>Historial de entrenamientos</h2>

            {sesiones.length === 0 && <p> No hay entrenamientos aún</p>}

            {sesiones. map ((sesion) => (
                <div
                    key={`${sesion.fecha}-${sesion.dia}`}
                    style={{marginBottom: "1rem"}}
                    >
                    <strong>{sesion.fecha}</strong> - {sesion.dia}
                    <ul>
                        {sesion.ejercicios.map((e) => (
                            <li key={e}>✅  {e}</li>
                        ))}
                    </ul>
                </div>
            ))}

        </div>
    )
}

export default Historial