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

    const rutinasPorDia = {
        Lunes: ["Pecho", "Tríceps"],
        Martes: ["Pierna"],
        Miércoles: ["Hombro", "Antebrazo"],
        Jueves: ["Espalda", "Bíceps"],
        Viernes: ["Pierna"],
        Sábado: ["Descanso"],
        Domingo: ["Descanso"],
    };

    const rutina = rutinasPorDia[diaNombre] || ["Descanso"];

    return (
        <div>
            <h2>Rutina de hoy</h2>
            <p>
                Hoy es: <strong>{diaNombre}</strong>
            </p>

            <p>Te toca:</p>
            <ul>
                {rutina.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        </div>
    );
}

export default RutinaDeHoy;