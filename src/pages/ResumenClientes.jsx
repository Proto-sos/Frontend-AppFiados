import { useState, useEffect } from 'react';
import axios from 'axios';

const ResumenClientes = () => {
    const [clientes, setClientes] = useState([]);

    const obtenerResumen = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/clientes/resumen-deudas');
            setClientes(res.data);
        } catch (error) {
            console.error("Error cargando resumen");
        }
    };

    useEffect(() => {
        obtenerResumen();
    }, []);

    const eliminarCliente = async (id, nombre) => {
        if (window.confirm(`¿Estás seguro de eliminar a ${nombre}?`)) {
            try {
                const respuesta = await axios.delete(`http://localhost:3000/api/clientes/${id}`);
                alert(respuesta.data.message);
                obtenerResumen(); 
            } catch (error) {
                const mensajeError = error.response?.data?.message || "Error desconocido";
                alert("⚠️ " + mensajeError);
            }
        }
    };

    const editarCliente = async (cliente) => {
        const nuevoNombre = window.prompt("Editar nombre del cliente:", cliente.nombre);
        if (nuevoNombre !== null && nuevoNombre.trim() !== "") {
            try {
                await axios.put(`http://localhost:3000/api/clientes/${cliente.id_cliente}`, {
                    nombre: nuevoNombre
                });
                obtenerResumen();
            } catch (error) {
                alert("Error al actualizar el nombre");
            }
        }
    };

    return (
        <div className="page-content">
            <h2>📋 Listado General de Deudas</h2>
            <div className="card shadow">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f3f4f6', textAlign: 'left' }}>
                            <th style={{ padding: '12px' }}>ID</th>
                            <th style={{ padding: '12px' }}>Cliente</th>
                            <th style={{ padding: '12px' }}>Total Fiado</th>
                            <th style={{ padding: '12px', textAlign: 'right' }}>Saldo Pendiente</th>
                            <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map(c => (
                            <tr key={c.id_cliente} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px' }}>{c.id_cliente}</td>
                                <td style={{ padding: '12px', fontWeight: 'bold' }}>{c.nombre}</td>
                                
                                {/* CORRECCIÓN AQUÍ: Agregamos || 0 para evitar el NaN */}
                                <td style={{ padding: '12px' }}>
                                    ${(Number(c.total_fiado) || 0).toFixed(2)}
                                </td>
                                
                                <td style={{
                                    padding: '12px',
                                    textAlign: 'right',
                                    fontWeight: 'bold',
                                    color: (c.saldo_pendiente || 0) > 0 ? '#e11d48' : '#059669'
                                }}>
                                    ${(Number(c.saldo_pendiente) || 0).toFixed(2)}
                                </td>

                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                    <button 
                                        onClick={() => editarCliente(c)}
                                        style={{ backgroundColor: '#f59e0b', marginRight: '8px', padding: '5px 10px', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}
                                    >
                                        ✏️ Editar
                                    </button>
                                    <button 
                                        onClick={() => eliminarCliente(c.id_cliente, c.nombre)}
                                        style={{ backgroundColor: '#ef4444', padding: '5px 10px', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}
                                    >
                                        🗑️ Borrar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ResumenClientes;