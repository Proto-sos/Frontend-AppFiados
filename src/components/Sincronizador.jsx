import { useEffect } from 'react';
import axios from 'axios';
import { db_local } from '../db_local';

const Sincronizador = () => {
    useEffect(() => {
        const procesarPendientes = async () => {
            // Buscamos todos los fiados guardados en el celular
            const pendientes = await db_local.fiados_pendientes.toArray();

            if (pendientes.length > 0) {
                console.log(`🔄 Intentando sincronizar ${pendientes.length} registros...`);

                for (const fiado of pendientes) {
                    try {
                        // Intentamos subirlo al servidor
                        await axios.post('http://localhost:3000/api/fiados', {
                            id_cliente: fiado.id_cliente,
                            id_producto: fiado.id_producto,
                            cantidad: fiado.cantidad,
                            descripcion: fiado.descripcion
                        });

                        // Si tiene éxito, lo borramos del celular para no duplicar
                        await db_local.fiados_pendientes.delete(fiado.id);
                        console.log("✅ Registro sincronizado y limpiado localmente");
                    } catch (error) {
                        console.log("📡 Aún sin conexión o error en servidor, se queda en el celular.");
                        break; // Si falla uno, paramos para intentar más tarde
                    }
                }
            }
        };

        // Se ejecuta al cargar la app
        procesarPendientes();

        // Opcional: Revisar cada 1 minuto automáticamente
        const intervalo = setInterval(procesarPendientes, 60000);
        return () => clearInterval(intervalo);
    }, []);

    return null; // Este componente no renderiza nada visual
};

export default Sincronizador;