import { ejerciciosCatalogo } from "../data/ejerciciosCatalogo";

function Ejercicios() {
    return (
        <div style = {{marginTop: "24 px"}}>
            <h2>Ejercicios</h2>

            <div style = {{display:"grid", gap: "12px", marginTop: "12px"}}>
                {ejerciciosCatalogo.map ((e) => (
                    <div
                        key = {e.id}
                        style = {{
                            border: "1px solid #333",
                            borderRadius: "10px",
                            padding: "12px",
                            display: "flex",
                            grap: "12px",
                            alignItems: "center",
                        }}
                        >
                            <img 
                                src = {e.gif}
                                alt = {e.nombre}
                                width={90}
                                height={90}
                                style = {{objectFit: "cover", borderRadius: "8px"}}
                            />
                            <div>
                                <div style = {{fontWeight: "700"}}> {e.nombre}</div>
                                <div style = {{opacity: 0.8, fontSize: "14px"}}>{e.grupo}</div>
                            </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Ejercicios;