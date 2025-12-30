import Historial from "../components/Historial";
export default function HistorialPage ({refresh}) {

    return(
        <div>
            <Historial refresh={refresh} />
        </div>
    );
}