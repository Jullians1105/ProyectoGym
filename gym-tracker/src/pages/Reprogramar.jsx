import {useEffect, useState} from "react";

const pendientesKey = "PendientesEntreno";

export default function Reprogramar (){

    const [toast,setToast] = useState (null);
    function showToast(message, type = "Cambios guardados") {
        setToast({message, type});
        setTimeout(() => setToast(null),2200);
    }

    const [pendientes, setPendientes] = useState(() => {
        const guardado= localStorage.getItem(pendientesKey);
        return guardado ? JSON.parse(guardado) : [];
    })
    
    const [fechaObjetivo, setFechaObjetivo] = useState ("")

    useEffect (() =>{
        localStorage.setItem(pendientesKey, JSON.stringify(pendientes))
    }, [pendientes])

    const aplicar = (p) => {
        if (!fechaObjetivo) return

        //Guardar una "sesion especial" para la fecha objetivo

        localStorage.setItem(
            `SesionEspecial-${fechaObjetivo}`,
            JSON.stringify ({
                diaRutina: p.diaRutina,
                reprogramadoDesde: p.fechaOriginal,
            })
        )

        //Quitar de pendientes
        setPendientes(pendientes.filter((x) => x.fechaOriginal !== p.fechaOriginal))
        setFechaObjetivo("")
    }

    return(
        <>
        {toast && (
            <div
                style={{
                    position: "fixed",
                    top: "16px",
                    left: "50%",
                    transform: "transLatex(-50%)",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    background: toast.type === "success" ? "#16a34a" : "dc2626",
                    color: "white",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                    zIndex: 9999,
                    fontWeight: 600,
                    letterSpacing: "0.2px",
                }}
            >
                {toast.message}
            </div>
        )}

        <div>
            <h2>Reprogramar entrenos pendientes</h2>
            {pendientes.length === 0 &&<p>No hay entrenos pendientes para reprogramar.</p>}

            <div style = {{
                display: "grid", grap: 12}}>
                    {pendientes.map((p) => (
                        <div key={p.fecha} className= "card">
                            <div style={{fontWeight: 700}}>
                                Pendiente: {p.diaRutina} (desde{p.fechaOriginal})
                            </div>

                            <div style= {{display: "flex", gap: 10, marginTop: 10, alignItems: "center"}}>
                                <input 
                                    type="date"
                                    value={fechaObjetivo}
                                    onChange={(e) => {setFechaObjetivo(e.target.value);
                                        showToast("Fecha Seleccionada ", "success");
                                    }}
                                    style={{
                                        background: "rgba(255,255,255,0.07)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        color: "white",
                                        padding: "10px 12px",
                                        borderRadius: 12,
                                    }}
                                />

                                <button className="btn" onClick={() => {
                                    if (!fechaObjetivo) {
                                        showToast("Seleccione una fecha válida ⚠️", "error");
                                        return;
                                    }

                                    aplicar (p);
                                    showToast("Entreno reprogramado con éxito ✅", "success");
                                }}>
                                    Reprogramar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
        </div>
        </>
        
    )
}