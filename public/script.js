const { createApp } = Vue;
createApp({
    data() {
        return {
            datos: [],
            busqueda: '',
            filtroEstado: 'TODOS',
            cargando: false,
            errorMsg: '',
            colStatus: 'Connection Status',
            manufacturer: 'Amazon',
            colManufacturer: 'Manufacturer'
        }
    },
    computed: {
        columnas() {
            if (this.datos.length === 0) return [];
            return Object.keys(this.datos[0]);
        },
        stats() {
            let s = { online: 0, offline: 0, offline30: 0, total: this.datos.length };
            this.datos.forEach(row => {
                const status = row[this.colStatus];
                if (status === 'ONLINE') s.online++;
                else if (status === 'OFFLINE') s.offline++;
                else if (status === 'Offline +30') s.offline30++;
            });
            return s;
        },
        listaFiltrada() {
            return this.datos.filter(row => {
                const status = row[this.colStatus];
                if (this.filtroEstado !== 'TODOS' && status !== this.filtroEstado) return false;
                if (this.busqueda) {
                    const textoFila = Object.values(row).join(' ').toLowerCase();
                    if (!textoFila.includes(this.busqueda.toLowerCase())) return false;
                }
                return true;
            });
        }
    },
    methods: {
        async cargarDatos() {
            const archivo = this.$refs.fileInput.files[0];
            if (!archivo) return;

            this.cargando = true;
            this.errorMsg = '';
            const formData = new FormData();
            formData.append('archivoCsv', archivo);

            try {
                const res = await fetch('/api/obtener-datos', { method: 'POST', body: formData });
                const json = await res.json();

                if (res.ok) {
                    this.datos = json
                        .filter(row => row[this.colManufacturer] === this.manufacturer)
                        .map(row => {
                            const keys = Object.keys(row);
                            // Formatear fechas columnas RAW 5 y 6 (índices 4 y 5)
                            if (keys.length > 4) row[keys[4]] = this.formatearFecha(row[keys[4]]);
                            if (keys.length > 5) row[keys[5]] = this.formatearFecha(row[keys[5]]);

                            if (keys.length > 2) {
                                delete row[keys[2]];
                            }
                            if (row[this.colStatus] === 'OFFLINE for more than 30 days') row[this.colStatus] = 'Offline +30';
                            return row;
                        });
                } else {
                    this.errorMsg = json.error || 'Error al cargar';
                }
            } catch (e) {
                this.errorMsg = "Error de conexión con el servidor";
                console.error(e);
            } finally {
                this.cargando = false;
            }
        },
        formatearFecha(fechaStr) {
            if (!fechaStr) return fechaStr;
            const fecha = new Date(fechaStr);
            if (isNaN(fecha.getTime())) return fechaStr;

            const dia = String(fecha.getDate()).padStart(2, '0');
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const anio = fecha.getFullYear();
            const horas = String(fecha.getHours()).padStart(2, '0');
            const minutos = String(fecha.getMinutes()).padStart(2, '0');

            return `${dia}-${mes}-${anio} ${horas}:${minutos}`;
        },
        // Función actualizada para devolver clases de Tailwind
        getTailwindBadge(status) {
            if (status === 'ONLINE') return 'bg-green-500';
            if (status === 'OFFLINE') return 'bg-red-500';
            return 'bg-slate-600'; // +30 days
        }
    }
}).mount('#app');