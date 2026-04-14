import React, { useState } from 'react';
import axios from 'axios';

const NuevoCliente = () => {
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/clientes', { nombre, telefono });
            alert("✅ Cliente registrado: Ahora ya puedes fiarle productos.");
            setNombre('');
            setTelefono('');
        } catch (error) {
            alert("❌ Error al registrar cliente");
        }
    };

    return (
        <div className="content-area">
            <div className="app-header">
                <h2>👤 Registro de Clientes</h2>
                <p>Agrega nuevos clientes para habilitar sus cuentas de fiado.</p>
            </div>

            <form className="card" onSubmit={handleSubmit}>
                <label>Nombre del Cliente</label>
                <input 
                    type="text" 
                    placeholder="Ej: Juan Pérez" 
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />

                <label>Teléfono / Contacto (Opcional)</label>
                <input 
                    type="text" 
                    placeholder="Ej: 0414-1234567" 
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                />

                <button type="submit">Guardar Cliente</button>
            </form>
        </div>
    );
};

export default NuevoCliente;