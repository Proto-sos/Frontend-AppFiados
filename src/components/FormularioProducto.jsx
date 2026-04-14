import React, { useState } from 'react';

const FormularioProducto = ({ onProductoAgregado }) => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // OBJETO CORREGIDO: Los nombres coinciden con las columnas de tu DB
    const nuevoProducto = {
      nombre: nombre,
      precio_venta: parseFloat(precio), // Mapeado correctamente
      stock_actual: parseInt(stock),    // Mapeado correctamente
      precio_costo: 0                   // Valor base para evitar errores
    };

    try {
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto),
      });

      if (response.ok) {
        alert("✅ ¡Producto agregado correctamente!");
        // Limpiar los campos después de guardar
        setNombre(''); 
        setPrecio(''); 
        setStock('');
        
        // Avisar al componente Inventario que debe recargar la tabla
        if (onProductoAgregado) onProductoAgregado();
      } else {
        const errorData = await response.json();
        alert("❌ Error del servidor: " + (errorData.error || "No se pudo guardar"));
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("❌ Error de conexión con el servidor");
    }
  };

  // --- Estilos ---
  const estiloInput = {
    width: '100%',
    padding: '10px',
    margin: '5px 0 15px 0',
    borderRadius: '6px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    color: '#333',
    fontSize: '16px'
  };

  const estiloLabel = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#555',
    display: 'block'
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '20px auto',
      padding: '20px',
      backgroundColor: '#fdfdfd',
      borderRadius: '12px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      border: '1px solid #eee'
    }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>
        ➕ Nuevo Producto
      </h2>
      
      <form onSubmit={handleSubmit}>
        <label style={estiloLabel}>Nombre del Producto</label>
        <input
          style={estiloInput}
          type="text"
          placeholder="Ej. Harina de Maíz"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={estiloLabel}>Precio de Venta ($)</label>
            <input
              style={estiloInput}
              type="number"
              step="0.01"
              placeholder="0.00"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={estiloLabel}>Stock Inicial</label>
            <input
              style={estiloInput}
              type="number"
              placeholder="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '10px',
            transition: 'background 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          Guardar en Inventario
        </button>
      </form>
    </div>
  );
};

export default FormularioProducto;