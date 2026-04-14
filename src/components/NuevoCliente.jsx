import { useState } from 'react';
import axios from 'axios';

const NuevoCliente = () => {
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');

    const guardarCliente = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/clientes', { nombre, telefono });
            alert("✅ Cliente registrado correctamente");
            setNombre('');
            setTelefono('');
        } catch (error) {
            alert("❌ Error al registrar");
        }
    };

    return (
        <div className="content-area">
            <div className="app-header">
                <h2>👤 Nuevo Cliente</h2>
                <p>Registra a una persona para asignarle fiados.</p>
            </div>
            
            <form className="card" onSubmit={guardarCliente}>
                <label>Nombre Completo</label>
                <input 
                    type="text" 
                    placeholder="Ej: Victor Rivas" 
                    value={nombre} 
                    onChange={e => setNombre(e.target.value)} 
                    required 
                />

                <label>Teléfono (Opcional)</label>
                <input 
                    type="text" 
                    placeholder="Ej: 0412-1234567" 
                    value={telefono} 
                    onChange={e => setTelefono(e.target.value)} 
                />

                <button type="submit">Registrar Cliente</button>
            </form>
        </div>
    );
};

export default NuevoCliente;