import { useState, useEffect } from 'react';
import axios from 'axios';

const Inventario = () => {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        // Asegúrate de que tu backend esté corriendo en el puerto 3000
        axios.get('http://localhost:3000/api/products')
            .then(res => {
                setProductos(res.data);
            })
            .catch(err => {
                console.error("Error al cargar productos:", err);
            });
    }, []);

    return (
        <div className="page-content">
            <h2>📦 Inventario de Productos</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Producto</th>
                        <th>Stock Actual</th>
                        <th>Precio Venta</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.length > 0 ? (
                        productos.map(p => (
                            <tr key={p.id_producto}>
                                <td>{p.id_producto}</td>
                                <td>{p.nombre}</td>
                                <td style={{ fontWeight: 'bold', color: p.stock_actual < 5 ? 'red' : 'green' }}>
                                    {p.stock_actual}
                                </td>
                                <td>${p.precio_venta}</td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="4">Cargando productos o inventario vacío...</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Inventario;