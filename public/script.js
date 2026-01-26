const { createApp } = Vue;
createApp({
    data() {
        return {
            datos: [],
            busqueda: '',
            filtroEstado: 'TODOS',
            cargando: false,
            errorMsg: '',
            colStatus: 'Connection Status'
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
                else if (status === 'OFFLINE for more than 30 days') s.offline30++;
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
                    this.datos = json;
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
        // Función actualizada para devolver clases de Tailwind
        getTailwindBadge(status) {
            if (status === 'ONLINE') return 'bg-green-500';
            if (status === 'OFFLINE') return 'bg-red-500';
            return 'bg-slate-600'; // +30 days
        }
    }
}).mount('#app');