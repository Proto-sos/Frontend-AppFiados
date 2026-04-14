import { useState, useRef } from 'react';
import axios from 'axios';
import './NuevoFiado.css'; 

const NuevoFiado = () => {
    const inputProdRef = useRef(null);
    const [busquedaCli, setBusquedaCli] = useState('');
    const [sugerenciasCli, setSugerenciasCli] = useState([]);
    const [clienteSel, setClienteSel] = useState(null);
    const [busquedaProd, setBusquedaProd] = useState('');
    const [sugerenciasProd, setSugerenciasProd] = useState([]);
    const [carrito, setCarrito] = useState([]);

    // --- BÚSQUEDAS ---
    const buscarCliente = async (query) => {
        setBusquedaCli(query);
        if (query.length > 1) {
            try {
                const res = await axios.get(`http://localhost:3000/api/clientes/buscar/${query}`);
                setSugerenciasCli(res.data);
            } catch (err) { console.error(err); }
        } else setSugerenciasCli([]);
    };

    const buscarProducto = async (query) => {
        setBusquedaProd(query);
        if (query.length > 0) {
            try {
                const res = await axios.get(`http://localhost:3000/api/products/buscar/${query}`);
                setSugerenciasProd(res.data);
            } catch (err) { console.error(err); }
        } else setSugerenciasProd([]);
    };

    // --- CARRITO ---
    const agregarAlCarrito = (p) => {
        const existe = carrito.find(item => item.id_producto === p.id_producto);
        if (p.stock_actual <= 0) return alert("Sin stock disponible");
        
        if (existe) {
            actualizarCantidad(p.id_producto, existe.cantidad + 1);
        } else {
            setCarrito([...carrito, { ...p, cantidad: 1 }]);
        }
        setBusquedaProd('');
        setSugerenciasProd([]);
    };

    const actualizarCantidad = (id, nuevaCant) => {
        const cantidadNumerica = parseInt(nuevaCant);
        if (isNaN(cantidadNumerica) || cantidadNumerica < 1) return;
        setCarrito(carrito.map(item => {
            if (item.id_producto === id) {
                if (cantidadNumerica > item.stock_actual) {
                    alert(`Solo quedan ${item.stock_actual} unidades`);
                    return item;
                }
                return { ...item, cantidad: cantidadNumerica };
            }
            return item;
        }));
    };

    const aceptarYSeguir = () => {
        setBusquedaProd('');
        setSugerenciasProd([]);
        inputProdRef.current?.focus();
    };

    // --- ENVÍO AL BACKEND ---
    const confirmarFiadoMasivo = async () => {
        if (!clienteSel) return alert("Selecciona un cliente");
        if (carrito.length === 0) return alert("El carrito está vacío");

        try {
            await axios.post('http://localhost:3000/api/fiados/multiples', {
                id_cliente: clienteSel.id_cliente,
                productos: carrito
            });
            alert(`✅ Fiado registrado a ${clienteSel.nombre}`);
            setCarrito([]);
            setClienteSel(null);
            setBusquedaCli('');
        } catch (error) {
            alert("Error: " + (error.response?.data?.message || "No se pudo conectar con el servidor"));
        }
    };

    const totalCarrito = carrito.reduce((acc, item) => acc + (item.precio_venta * item.cantidad), 0);

    return (
        <div className="fiados-screen"> 
            <div className="fiados-card shadow">
                <h3>🔍 Selección</h3>
                <div className="search-box-container">
                    <label className="search-label">Cliente:</label>
                    <input 
                        type="text" 
                        value={busquedaCli} 
                        onChange={(e) => buscarCliente(e.target.value)} 
                        placeholder="Buscar cliente..." 
                        style={{ border: clienteSel ? '2px solid #10b981' : '1px solid #ccc' }}
                        autoComplete="off"
                    />
                    {sugerenciasCli.length > 0 && (
                        <ul className="sugerencias-lista">
                            {sugerenciasCli.map(c => (
                                <li key={c.id_cliente} onClick={() => { setClienteSel(c); setBusquedaCli(c.nombre); setSugerenciasCli([]); }}>
                                    {c.nombre}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="search-box-container">
                    <label className="search-label">Agregar Producto:</label>
                    <input 
                        ref={inputProdRef}
                        type="text" 
                        value={busquedaProd} 
                        onChange={(e) => buscarProducto(e.target.value)} 
                        placeholder="Escribe nombre de producto..." 
                        autoComplete="off"
                    />
                    {sugerenciasProd.length > 0 && (
                        <ul className="sugerencias-lista">
                            {sugerenciasProd.map(p => (
                                <li key={p.id_producto} className="sugerencia-item">
                                    <div className="info-prod">
                                        <span>{p.nombre}</span>
                                        <small>Stock: {p.stock_actual} | ${p.precio_venta}</small>
                                    </div>
                                    <button className="btn-add-cart" onClick={() => agregarAlCarrito(p)}>Añadir +</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="fiados-card shadow">
                <h3>🛒 Carrito {clienteSel && <span style={{ color: '#646cff' }}>- {clienteSel.nombre}</span>}</h3>
                <table className="tabla-carrito">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cant.</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {carrito.map(item => (
                            <tr key={item.id_producto}>
                                <td>{item.nombre}</td>
                                <td>
                                    <div className="cantidad-control">
                                        <button className="btn-qty" onClick={() => actualizarCantidad(item.id_producto, item.cantidad - 1)}>-</button>
                                        <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.cantidad}</span>
                                        <button className="btn-qty" onClick={() => actualizarCantidad(item.id_producto, item.cantidad + 1)}>+</button>
                                    </div>
                                </td>
                                <td>${(item.precio_venta * item.cantidad).toFixed(2)}</td>
                                <td>
                                    <button className="btn-check" onClick={aceptarYSeguir} title="Aceptar y buscar otro">✅</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {carrito.length > 0 && (
                    <div className="cart-footer">
                        <div className="total-row" style={{ marginTop: '20px', borderTop: '2px solid #eee', paddingTop: '10px' }}>
                            <span style={{ fontSize: '1.2rem' }}>Total:</span>
                            <span className="total-amount" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                                ${totalCarrito.toFixed(2)}
                            </span>
                        </div>
                        <button className="btn-confirm" onClick={confirmarFiadoMasivo}>
                            CONFIRMAR TODO EL FIADO
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NuevoFiado;