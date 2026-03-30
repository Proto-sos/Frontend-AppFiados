import { useState } from 'react';
import axios from 'axios';
import { db_local } from '../db_local'; // Asegúrate de que la ruta sea correcta

const NuevoFiado = () => {
    const [form, setForm] = useState({
        id_cliente: '',
        id_producto: '',
        cantidad: '',
        descripcion: ''
    });

    const registrarFiado = async (e) => {
        e.preventDefault();

        try {
            // 1. Intentamos enviar al servidor de forma normal
            const res = await axios.post('http://localhost:3000/api/fiados', form);
            alert("✅ " + res.data.message);
            setForm({ id_cliente: '', id_producto: '', cantidad: '', descripcion: '' });

        } catch (error) {
            // 2. Si no hay respuesta del servidor (error de red/servidor apagado)
            if (!error.response) {
                try {
                    // Guardamos en la tabla 'fiados_pendientes' de Dexie
                    await db_local.fiados_pendientes.add({
                        ...form,
                        fecha: new Date().toISOString(),
                        sincronizado: 0 // Marcamos que está pendiente de subir
                    });

                    alert("⚠️ Sin conexión al servidor. Datos guardados localmente en el celular.");
                    setForm({ id_cliente: '', id_producto: '', cantidad: '', descripcion: '' });
                } catch (dexieError) {
                    console.error("Error en Dexie:", dexieError);
                    alert("❌ Error crítico al guardar localmente");
                }
            } else {
                // 3. Si el servidor SÍ respondió pero con un error (ej: Stock insuficiente)
                alert("❌ Error: " + (error.response.data.message || "No se pudo registrar"));
            }
        }
    };

    return (
        <div className="page-content">
            <h2>📝 Registrar Nueva Deuda (Fiado)</h2>
            {/* ... (el resto de tu HTML/JSX se mantiene igual) ... */}
            <div className="card shadow" style={{ maxWidth: '500px', margin: 'auto' }}>
                <form onSubmit={registrarFiado} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label>ID del Cliente:</label>
                        <input
                            type="number"
                            required
                            value={form.id_cliente}
                            onChange={e => setForm({ ...form, id_cliente: e.target.value })}
                            placeholder="Ej: 1"
                        />
                    </div>

                    <div>
                        <label>ID del Producto:</label>
                        <input
                            type="number"
                            required
                            value={form.id_producto}
                            onChange={e => setForm({ ...form, id_producto: e.target.value })}
                            placeholder="Ej: 10"
                        />
                    </div>

                    <div>
                        <label>Cantidad:</label>
                        <input
                            type="number"
                            required
                            value={form.cantidad}
                            onChange={e => setForm({ ...form, cantidad: e.target.value })}
                            placeholder="¿Cuántos lleva?"
                        />
                    </div>

                    <div>
                        <label>Nota / Descripción:</label>
                        <input
                            type="text"
                            value={form.descripcion}
                            onChange={e => setForm({ ...form, descripcion: e.target.value })}
                            placeholder="Ej: Para el desayuno"
                        />
                    </div>

                    <button type="submit" style={{ background: '#646cff', color: 'white', marginTop: '10px' }}>
                        Guardar Fiado
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NuevoFiado;