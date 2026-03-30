import { useState, useEffect } from 'react';
import axios from 'axios';

const ResumenClientes = () => {
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        const obtenerResumen = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/clientes/resumen-deudas');
                setClientes(res.data);
            } catch (error) {
                console.error("Error cargando resumen");
            }
        };
        obtenerResumen();
    }, []);

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
                            <th style={{ padding: '12px' }}>Total Pagado</th>
                            <th style={{ padding: '12px', textAlign: 'right' }}>Saldo Pendiente</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map(c => (
                            <tr key={c.id_cliente} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px' }}>{c.id_cliente}</td>
                                <td style={{ padding: '12px', fontWeight: 'bold' }}>{c.nombre}</td>
                                <td style={{ padding: '12px' }}>${Number(c.total_fiado).toFixed(2)}</td>
                                <td style={{ padding: '12px' }}>${Number(c.total_pagado).toFixed(2)}</td>
                                <td style={{
                                    padding: '12px',
                                    textAlign: 'right',
                                    fontWeight: 'bold',
                                    color: c.saldo_pendiente > 0 ? '#e11d48' : '#059669'
                                }}>
                                    ${Number(c.saldo_pendiente).toFixed(2)}
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