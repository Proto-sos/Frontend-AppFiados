import Dexie from 'dexie';

export const db_local = new Dexie('SistemaFiadosOffline');

// Definimos las tablas y los campos que queremos indexar
db_local.version(1).stores({
    productos: 'id_producto, nombre',
    fiados_pendientes: '++id, id_cliente, id_producto, cantidad',
    pagos_pendientes: '++id, id_cliente, monto'
});