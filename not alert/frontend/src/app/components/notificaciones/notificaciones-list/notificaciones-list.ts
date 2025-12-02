import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificacionesService, Notificacion } from '../../../services/notificaciones.service';

@Component({
  selector: 'app-notificaciones-list',
  imports: [CommonModule],
  templateUrl: './notificaciones-list.html',
  styleUrl: './notificaciones-list.css',
})
export class NotificacionesList implements OnInit {
  notificaciones: Notificacion[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private notificacionesService: NotificacionesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadNotificaciones();
  }

  loadNotificaciones() {
    this.loading = true;
    this.error = null;
    console.log('🔄 Cargando notificaciones...');
    this.notificacionesService.getAll().subscribe({
      next: (response) => {
        console.log('✅ Respuesta recibida:', response);
        if (response && response.success && response.data) {
          this.notificaciones = response.data;
          console.log(`📋 Notificaciones cargadas: ${this.notificaciones.length}`);
        } else if (response && response.success && Array.isArray(response.data) && response.data.length === 0) {
          // Si la respuesta es exitosa pero no hay datos
          this.notificaciones = [];
          console.log('ℹ️ No hay notificaciones en la base de datos');
        } else {
          this.error = response?.message || 'Error al cargar notificaciones';
          console.error('❌ Error en respuesta:', response);
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = `Error al conectar con el servidor: ${err.message || 'Error desconocido'}`;
        this.loading = false;
        console.error('❌ Error HTTP:', err);
        console.error('🔍 Detalles del error:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          url: err.url
        });
      }
    });
  }

  crearNotificacion() {
    this.router.navigate(['/notificaciones/nueva']);
  }

  editarNotificacion(id: number) {
    this.router.navigate(['/notificaciones/editar', id]);
  }

  eliminarNotificacion(id: number) {
    if (confirm('¿Está seguro de eliminar esta notificación?')) {
      this.notificacionesService.delete(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadNotificaciones();
          } else {
            alert(response.message || 'Error al eliminar');
          }
        },
        error: (err) => {
          alert('Error al eliminar la notificación');
          console.error(err);
        }
      });
    }
  }

  marcarComoLeido(notificacion: Notificacion) {
    this.notificacionesService.update(notificacion.id_notificacion, {
      leido: true
    }).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadNotificaciones();
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getTipoClass(tipo: string): string {
    switch (tipo) {
      case 'error': return 'tipo-error';
      case 'alerta': return 'tipo-alerta';
      case 'info': return 'tipo-info';
      default: return '';
    }
  }

  formatFecha(fecha: Date | string): string {
    const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}
