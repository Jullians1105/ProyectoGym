import {useMemo, useState} from "react"
import { ejerciciosPorDia } from "../data/ejercicios"

const normFecha = (s) => String (s ?? "").trim();

const normDia = (s) =>
    String (s ?? "")
        .trim()
        .replace(/^[\s-]+/, "")   // quita guiones/espacios al inicio
        .replace(/[\s-]+$/, "")   // quita guiones/espacios al final
        .replace(/\s+/g, " ");    // espacios dobles -> 1

function parseDiaEntreoKey (key) {
    //"Dia entreno - 2023 - 09 - 15  Lunes"
    const m = key.match(/^Dia entreno -\s*(\d{4}-\d{2}-\d{2})\s*-\s*(.+)\s*$/);
    if(!m) return null;
    return {fecha: normFecha(m[1]), dia: normDia(m[2])};
}

function Historial ({refresh, setRefresh}) {

    const especiales = useMemo(() => {
    const map = {};

    Object.keys (localStorage)
        .filter((k) => k.startsWith ("SesionEspecial-"))
        .forEach((k) => {
            const obj = JSON.parse (localStorage.getItem (k) || "null");
            if (!obj) return;

            const fechaKey = normFecha(k.replace("SesionEspecial-", ""));
            const desde = (obj.reprogramadoDesde || obj.desde)?.trim();

            const cleaned = {
                ...obj,
                reprogramadoDesde: desde || fechaKey,
                nuevaFecha: normFecha(obj.nuevaFecha),
                diaRutina: normDia(obj.diaRutina),
            };

            //1. indexar por fecha del key
            if(fechaKey) map[fechaKey] = cleaned;

            //2. indexar por fecha "desde" que es la original, si aplica

            if (desde) map[desde] = cleaned;
        });
    return map;
}, [refresh]);

    const sesiones =useMemo (() => {
        const sesionesMap= new Map();

        //1. sesiones normales
        for (let i= 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key.startsWith("Dia entreno -")) continue;

            const parsed = parseDiaEntreoKey (key);
            if (!parsed) continue;

            const {fecha, dia} = parsed;

            const ejercicios= JSON.parse(localStorage.getItem(key) || "[]") || [];
            const pesosKey = `PesosDia-${fecha}-${dia}`;
            const pesos = JSON.parse(localStorage.getItem(pesosKey) || "{}") || {};

            const total = (ejerciciosPorDia[dia] || []).length;
            const hechos = ejercicios.length;
            const pct = total > 0 ? Math.round((hechos / total)*100) : 0;
            
            sesionesMap.set (fecha, {fecha, dia, ejercicios, pesos, total, hechos, pct})
        }

        //2. placeholders para especiales que no tengan sesion normal ese dia
        Object.entries(especiales).forEach(([fechaOriginal, sp]) => {
            if (sesionesMap.has(fechaOriginal)) return;

            const dia= sp.diaRutina || "Día";
            const total = (ejerciciosPorDia[dia] || []).length;

            sesionesMap.set (fechaOriginal, {
                fecha: fechaOriginal,
                dia,
                ejercicios: [],
                pesos: {},
                total,
                hechos: 0,
                pct: 0,
                _placeholder: true,
            });
        });

        const result = Array.from(sesionesMap.values());
        result.sort((a,b) => b.fecha.localeCompare(a.fecha));
        return result;
}, [refresh, especiales])

    const [q, setQ] = useState ("");
    const [desde, setDesde] = useState ("");
    const [hasta, setHasta] = useState ("");

                const sesionesFiltradas = sesiones.filter((s) => {
                if (desde && s.fecha < desde) return false;
                if (hasta && s.fecha > hasta) return false;

                if(q.trim()){
                    const needle = q.trim().toLowerCase();
                    const enDia=
                        s.dia.toLoweCase().includes(needle) ||
                        s.ejercicios.some((e) => e.toLowerCase().includes(needle));

                    if (!enDia) return false;
                }

                return true;
            })

    return (
        <div className="historial">
            <h2>Historial de entrenamientos</h2>

            <div
            style={{display: "flex", gap: 10, flexWrap: "wrap", margin: "12px 0"}}>
                <input
                placeholder="Buscar Ejercicio"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                style={{padding: "10px 12px", borderRadius: 10, width: 260}}
                />

                <input
                type="date"
                value={desde}
                onChange={(e) => setDesde(e.target.value)}
                style={{padding: "10px 12px", borderRadius: 10}}
                />

                <input
                type="date"
                value={hasta}
                onChange={(e) => setHasta(e.target.value)}
                style={{padding: "10px 12px", borderRadius: 10}}
                />

                <button
                className="btn"
                onClick={() => {
                    setQ("");
                    setDesde("");
                    setHasta("");
                }}
                >
                    Limpiar filtros
                </button>
            </div>

            {sesiones.length === 0 && <p> No hay entrenamientos aún</p>}

            {sesionesFiltradas.map((sesion) => {

                const special = especiales[sesion.fecha] || null;

                return (
                    <div
                    key={`${sesion.fecha}-${sesion.dia}`}
                    style={{marginBottom: "1rem"}}
                    >
                        <div>
                            <strong>{sesion.fecha}</strong> - {sesion.dia}
                        </div>

                        {special && (
                            <p style={{color: "#facc15", margin: "4px 0"}}>
                                Reprogramado para {special.nuevaFecha}
                            </p>
                        )}

                        <button
                        className="btn"
                        onClick={() => {
                            const k= `SesionEspecial-${sesion.fecha}`;
                            localStorage.removeItem(k);
                        }}
                        style={{marginTop: "6px"}}
                        >
                            Eliminar reprogramación
                        </button>

                        <div>
                            Progreso: <strong>{sesion.hechos}</strong> / {sesion.total} ({sesion.pct}%)
                        </div>

                        <button
                        className="btn"
                        onClick={() => {
                            const entrenoKey = `Dia entreno -${sesion.fecha}-${sesion.dia}`;
                            const pesosKey= `PesosDia-${sesion.fecha}-${sesion.dia}`;
                            setRefresh ((v) => v + 1);

                            localStorage.removeItem(entrenoKey);
                            localStorage.removeItem(pesosKey);
                            localStorage.removeItem(`SesionEspecial-${sesion.fecha}`);
                        }}
                        style={{marginTop: "6px", marginLeft: "8px"}}
                        >
                            Borrar dia
                        </button>
                        
                        <ul>
                            {sesion.ejercicios.map ((e) => {
                                const p = sesion.pesos?.[e];

                                return (
                                    <li key={e}>
                                        ✅ {e}
                                        {p?.valor !== "" && p?.valor != null ? (
                                            <span style={{opacity: 0.85}}>
                                            {" "}- {p.tipo}: {p.valor} lbs
                                        </span>
                                        ) : null}
                                    </li>
                                )
                            })}
                        </ul>
                </div>
            )})}
        </div>
    )
}

export default Historial