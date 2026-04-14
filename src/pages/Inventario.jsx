import { useState, useEffect } from 'react';
import axios from 'axios';
import FormularioProducto from '../components/FormularioProducto';
import './Inventario.css'; 

const Inventario = () => {
    const [productos, setProductos] = useState([]);

    // 1. Cargar productos
    const cargarProductos = () => {
        axios.get('http://localhost:3000/api/products')
            .then(res => setProductos(res.data))
            .catch(err => console.error("Error al cargar productos:", err));
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    // 2. Función para agregar stock
    const agregarStock = async (id, nombre) => {
        const cantidad = window.prompt(`📦 ¿Cuántas unidades de "${nombre}" llegaron?`);
        if (cantidad && !isNaN(cantidad) && parseInt(cantidad) > 0) {
            try {
                await axios.patch(`http://localhost:3000/api/products/${id}/stock`, { 
                    cantidad: parseInt(cantidad) 
                });
                cargarProductos(); 
            } catch (error) {
                alert("Error al actualizar el stock");
            }
        }
    };

    // 3. Función para editar producto
    const editarProducto = async (p) => {
        const nuevoNombre = window.prompt("Editar nombre del producto:", p.nombre);
        const nuevoPrecio = window.prompt("Editar precio de venta:", p.precio_venta);
        
        if (nuevoNombre && nuevoPrecio && !isNaN(nuevoPrecio)) {
            try {
                await axios.put(`http://localhost:3000/api/products/${p.id_producto}`, {
                    nombre: nuevoNombre,
                    precio_venta: parseFloat(nuevoPrecio)
                });
                cargarProductos();
            } catch (error) {
                alert("Error al actualizar el producto");
            }
        }
    };

    // 4. Función para eliminar producto
    const eliminarProducto = async (id, nombre) => {
        if (window.confirm(`⚠️ ¿Eliminar "${nombre}"?\nSolo si no tiene deudas registradas.`)) {
            try {
                const res = await axios.delete(`http://localhost:3000/api/products/${id}`);
                alert("✅ " + res.data.message);
                cargarProductos();
            } catch (error) {
                const msg = error.response?.data?.message || "Error al eliminar";
                alert("❌ " + msg);
            }
        }
    };

    return (
        <div className="page-content">
            <h2 className="titulo-pagina">📦 Inventario de Productos</h2>

            <div className="formulario-seccion" style={{ marginBottom: '30px' }}>
                <FormularioProducto onProductoAgregado={cargarProductos} />
            </div>

            <div className="card shadow tabla-contenedor">
                <table className="tabla-inventario">
                    <thead>
                        <tr>
                            <th style={{ width: '30px', textAlign: 'center' }}>ID</th>
                            <th>Producto</th>
                            <th style={{ width: '60px' }}>Stock</th>
                            <th style={{ width: '70px' }}>Precio</th>
                            <th style={{ width: '110px', textAlign: 'center' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.length > 0 ? (
                            productos.map(p => (
                                <tr key={p.id_producto}>
                                    <td style={{ textAlign: 'center', color: '#94a3b8' }}>{p.id_producto}</td>
                                    <td style={{ fontWeight: '500' }}>{p.nombre}</td>
                                    <td style={{ 
                                        fontWeight: 'bold', 
                                        color: p.stock_actual < 5 ? '#ef4444' : '#10b981' 
                                    }}>
                                        {p.stock_actual}
                                    </td>
                                    <td>${Number(p.precio_venta).toFixed(2)}</td>
                                    <td className="acciones-celda">
                                        <button 
                                            onClick={() => agregarStock(p.id_producto, p.nombre)}
                                            className="btn-accion btn-stock" 
                                            title="Sumar Stock"
                                        >
                                            📦
                                        </button>
                                        <button 
                                            onClick={() => editarProducto(p)}
                                            className="btn-accion btn-edit" 
                                            title="Editar"
                                        >
                                            ✏️
                                        </button>
                                        <button 
                                            onClick={() => eliminarProducto(p.id_producto, p.nombre)}
                                            className="btn-accion btn-delete" 
                                            title="Borrar"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>
                                    Cargando inventario...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Inventario;