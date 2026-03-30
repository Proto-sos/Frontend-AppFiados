import { useState } from 'react';
import axios from 'axios';

const Clientes = () => {
    const [busquedaId, setBusquedaId] = useState('');
    const [busquedaNombre, setBusquedaNombre] = useState('');
    const [sugerencias, setSugerencias] = useState([]);
    const [balance, setBalance] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [montoPago, setMontoPago] = useState('');
    const [metodoPago, setMetodoPago] = useState('Efectivo');

    const cargarDatosCliente = async (id) => {
        const idFinal = id || busquedaId;
        if (!idFinal) return;
        try {
            const [resBal, resHis] = await Promise.all([
                axios.get(`http://localhost:3000/api/clientes/${idFinal}/balance`),
                axios.get(`http://localhost:3000/api/clientes/${idFinal}/historial`)
            ]);
            setBalance(resBal.data);
            setHistorial(resHis.data);
            setSugerencias([]);
            setBusquedaId(idFinal);
        } catch (error) {
            alert("Error al cargar datos");
        }
    };

    const buscarNombre = async (texto) => {
        setBusquedaNombre(texto);
        if (texto.length > 2) {
            const res = await axios.get(`http://localhost:3000/api/clientes/buscar/${texto}`);
            setSugerencias(res.data);
        } else setSugerencias([]);
    };

    const registrarPago = async () => {
        if (!montoPago) return alert("Ingrese monto");
        try {
            await axios.post('http://localhost:3000/api/pagos', {
                id_cliente: busquedaId,
                monto: montoPago,
                metodo_pago: metodoPago
            });
            setMontoPago('');
            alert("Pago exitoso");
            cargarDatosCliente(busquedaId);
        } catch (error) { alert("Error al pagar"); }
    };

    return (
        <div className="page-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2>👥 Gestión de Clientes</h2>

            {/* BUSCADOR */}
            <div className="card shadow" style={{ padding: '20px', marginBottom: '20px', position: 'relative' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input style={{ width: '80px' }} type="number" placeholder="ID" value={busquedaId} onChange={e => setBusquedaId(e.target.value)} />
                    <div style={{ flex: 1, position: 'relative' }}>
                        <input type="text" placeholder="Buscar por nombre..." value={busquedaNombre} onChange={e => buscarNombre(e.target.value)} />
                        {sugerencias.length > 0 && (
                            <div style={{ position: 'absolute', background: 'white', width: '100%', border: '1px solid #ccc', zIndex: 10 }}>
                                {sugerencias.map(s => (
                                    <div key={s.id_cliente} onClick={() => cargarDatosCliente(s.id_cliente)} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }}>
                                        {s.nombre} (ID: {s.id_cliente})
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={() => cargarDatosCliente()}>🔍 Consultar</button>
                </div>
            </div>

            {balance && (
                <>
                    <div className="card" style={{ borderLeft: '5px solid #10b981', padding: '20px', marginBottom: '20px' }}>
                        <h3>{balance.cliente}</h3>
                        <p>Deuda: <span style={{ color: 'red' }}>${balance.deuda.toFixed(2)}</span> | Pagado: <span style={{ color: 'green' }}>${balance.pagado.toFixed(2)}</span></p>
                        <h2 style={{ margin: '10px 0' }}>Pendiente: ${balance.saldo_pendiente.toFixed(2)}</h2>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px', padding: '15px', background: '#f3f4f6', borderRadius: '8px' }}>
                            <input type="number" placeholder="Monto $" value={montoPago} onChange={e => setMontoPago(e.target.value)} />
                            <select value={metodoPago} onChange={e => setMetodoPago(e.target.value)}>
                                <option value="Efectivo">Efectivo</option>
                                <option value="Transferencia">Transferencia</option>
                            </select>
                            <button onClick={registrarPago} style={{ background: '#10b981', color: 'white' }}>Pagar</button>
                        </div>
                    </div>

                    <div className="card">
                        <h4>📜 Historial</h4>
                        <table style={{ width: '100%', textAlign: 'left' }}>
                            <thead><tr><th>Fecha</th><th>Tipo</th><th>Monto</th></tr></thead>
                            <tbody>
                                {historial.map((h, i) => (
                                    <tr key={i}>
                                        <td>{new Date(h.fecha).toLocaleDateString()}</td>
                                        <td><small style={{ background: h.tipo === 'FIADO' ? '#fee2e2' : '#dcfce7', padding: '2px 5px' }}>{h.tipo}</small></td>
                                        <td style={{ textAlign: 'right', color: h.tipo === 'FIADO' ? 'red' : 'green' }}>
                                            {h.tipo === 'FIADO' ? '-' : '+'}${Number(h.monto).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default Clientes;