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
    const [mostrarForm, setMostrarForm] = useState(false);
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [nuevoTelefono, setNuevoTelefono] = useState('');

    const cargarDatosCliente = async (id) => {
        const idFinal = id || busquedaId;
        if (!idFinal) return;
        
        try {
            // Usamos Promise.allSettled para que si una falla, la otra pueda cargar
            const [resBal, resHis] = await Promise.all([
                axios.get(`http://localhost:3000/api/clientes/${idFinal}/balance`).catch(e => ({ data: null, error: true })),
                axios.get(`http://localhost:3000/api/clientes/${idFinal}/historial`).catch(e => ({ data: [], error: true }))
            ]);

            if (resBal.error || resHis.error) {
                console.warn("Algunas rutas no están implementadas en el backend aún (404)");
            }

            setBalance(resBal.data);
            setHistorial(resHis.data || []);
            setSugerencias([]);
            setBusquedaId(idFinal);
            setBusquedaNombre('');
        } catch (error) {
            console.error("Error crítico al cargar datos:", error);
            alert("No se pudieron cargar los datos. Verifica que el servidor tenga las rutas de balance e historial.");
        }
    };

    const buscarNombre = async (texto) => {
        setBusquedaNombre(texto);
        if (texto.length > 2) {
            try {
                const res = await axios.get(`http://localhost:3000/api/clientes/buscar/${texto}`);
                setSugerencias(res.data);
            } catch (e) { console.error("Error en búsqueda"); }
        } else setSugerencias([]);
    };

    const registrarPago = async () => {
        if (!montoPago || montoPago <= 0) return alert("Ingrese un monto válido");
        try {
            await axios.post('http://localhost:3000/api/pagos', {
                id_cliente: busquedaId,
                monto: montoPago,
                metodo_pago: metodoPago
            });
            setMontoPago('');
            alert("✅ Pago registrado exitosamente");
            cargarDatosCliente(busquedaId);
        } catch (error) { alert("Error al registrar el pago"); }
    };

    const registrarNuevoCliente = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/api/clientes', { 
                nombre: nuevoNombre, 
                telefono: nuevoTelefono 
            });
            const nuevoId = res.data.id_cliente || res.data.id;
            alert(`✅ Cliente registrado con ID: ${nuevoId}`);
            setNuevoNombre('');
            setNuevoTelefono('');
            setMostrarForm(false);
            cargarDatosCliente(nuevoId);
        } catch (error) {
            alert("Error al registrar el cliente");
        }
    };

    return (
        /* CAMBIO: Usamos una clase única para no romper el inventario */
        <div className="clientes-section-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>👥 Gestión de Clientes</h2>
                <button 
                    onClick={() => setMostrarForm(!mostrarForm)}
                    style={{ 
                        borderRadius: '50%', width: '45px', height: '45px', 
                        fontSize: '24px', background: mostrarForm ? '#64748b' : '#646cff',
                        color: 'white', border: 'none', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    {mostrarForm ? '×' : '+'}
                </button>
            </div>

            {mostrarForm && (
                <div className="card shadow" style={{ padding: '20px', marginBottom: '20px', borderTop: '4px solid #646cff', background: 'white', borderRadius: '8px' }}>
                    <h4 style={{ marginTop: 0 }}>👤 Registrar Nuevo Cliente</h4>
                    <form onSubmit={registrarNuevoCliente} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input type="text" placeholder="Nombre Completo" value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)} required />
                        <input type="text" placeholder="Teléfono (Opcional)" value={nuevoTelefono} onChange={e => setNuevoTelefono(e.target.value)} />
                        <button type="submit" style={{ background: '#646cff', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Guardar Cliente</button>
                    </form>
                </div>
            )}

            <div className="card shadow" style={{ padding: '20px', marginBottom: '20px', position: 'relative', background: 'white', borderRadius: '8px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input style={{ width: '80px' }} type="number" placeholder="ID" value={busquedaId} onChange={e => setBusquedaId(e.target.value)} />
                    <div style={{ flex: 1, position: 'relative' }}>
                        <input style={{ width: '100%' }} type="text" placeholder="Buscar por nombre..." value={busquedaNombre} onChange={e => buscarNombre(e.target.value)} />
                        {sugerencias.length > 0 && (
                            <div style={{ position: 'absolute', background: 'white', width: '100%', border: '1px solid #ccc', zIndex: 10, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                                {sugerencias.map(s => (
                                    <div key={s.id_cliente} onClick={() => cargarDatosCliente(s.id_cliente)} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }}>
                                        {s.nombre} <small style={{ color: '#666' }}>(ID: {s.id_cliente})</small>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={() => cargarDatosCliente()}>🔍 Consultar</button>
                </div>
            </div>

            {balance ? (
                <>
                    <div className="card shadow" style={{ borderLeft: '5px solid #10b981', padding: '20px', marginBottom: '20px', background: 'white', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ margin: 0 }}>{balance.cliente}</h3>
                                <small style={{ color: '#64748b' }}>ID Cliente: #{busquedaId}</small>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ margin: 0 }}>Saldo Pendiente</p>
                                <h2 style={{ margin: 0, color: (balance.saldo_pendiente || 0) > 0 ? '#ef4444' : '#10b981' }}>
                                    ${(Number(balance.saldo_pendiente) || 0).toFixed(2)}
                                </h2>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px', padding: '15px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                            <div style={{ color: '#ef4444' }}><strong>Total Fiado:</strong> ${(Number(balance.deuda) || 0).toFixed(2)}</div>
                            <div style={{ color: '#10b981' }}><strong>Total Pagado:</strong> ${(Number(balance.pagado) || 0).toFixed(2)}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                            <input type="number" placeholder="Monto a abonar $" value={montoPago} onChange={e => setMontoPago(e.target.value)} />
                            <select value={metodoPago} onChange={e => setMetodoPago(e.target.value)}>
                                <option value="Efectivo">Efectivo</option>
                                <option value="Transferencia">Transferencia</option>
                                <option value="Pago Móvil">Pago Móvil</option>
                            </select>
                            <button onClick={registrarPago} style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' }}>Registrar Pago</button>
                        </div>
                    </div>

                    <div className="card shadow" style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
                        <h4>📜 Historial de Movimientos</h4>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #eee', color: '#64748b', fontSize: '0.8rem' }}>
                                    <th style={{ padding: '10px 5px', textAlign: 'left' }}>FECHA</th>
                                    <th style={{ padding: '10px 5px', textAlign: 'left' }}>TIPO</th>
                                    <th style={{ padding: '10px 5px', textAlign: 'right' }}>MONTO</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historial.map((h, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '10px 5px' }}>{new Date(h.fecha).toLocaleDateString()}</td>
                                        <td style={{ padding: '10px 5px' }}>
                                            <span style={{ 
                                                background: h.tipo === 'FIADO' ? '#fee2e2' : '#dcfce7', 
                                                color: h.tipo === 'FIADO' ? '#991b1b' : '#166534',
                                                padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold'
                                            }}>
                                                {h.tipo}
                                            </span>
                                        </td>
                                        <td style={{ padding: '10px 5px', textAlign: 'right', color: h.tipo === 'FIADO' ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
                                            {h.tipo === 'FIADO' ? '-' : '+'}${(Number(h.monto) || 0).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <p style={{ textAlign: 'center', color: '#94a3b8' }}>Busca un cliente para ver su estado de cuenta.</p>
            )}
        </div>
    );
};

export default Clientes;