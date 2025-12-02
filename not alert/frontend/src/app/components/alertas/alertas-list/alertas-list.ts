import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertasService, Alerta } from '../../../services/alertas.service';

@Component({
  selector: 'app-alertas-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './alertas-list.html',
  styleUrl: './alertas-list.css',
})
export class AlertasList implements OnInit {
  alertas: Alerta[] = [];
  loading = false;
  error: string | null = null;
  filtroProducto: string = '';

  constructor(
    private alertasService: AlertasService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAlertas();
  }

  loadAlertas() {
    this.loading = true;
    this.error = null;
    console.log('🔄 Cargando alertas...');
    this.alertasService.getAll().subscribe({
      next: (response) => {
        console.log('✅ Respuesta recibida:', response);
        if (response && response.success && response.data) {
          this.alertas = response.data;
          console.log(`📋 Alertas cargadas: ${this.alertas.length}`);
        } else if (response && response.success && Array.isArray(response.data) && response.data.length === 0) {
          this.alertas = [];
          console.log('ℹ️ No hay alertas en la base de datos');
        } else {
          this.error = response?.message || 'Error al cargar alertas';
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

  filtrarPorProducto() {
    const idProducto = parseInt(this.filtroProducto, 10);
    if (isNaN(idProducto) || idProducto <= 0) {
      this.loadAlertas();
      return;
    }

    this.loading = true;
    this.error = null;
    this.alertasService.getByProducto(idProducto).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.alertas = response.data;
        } else {
          this.error = response.message || 'Error al cargar alertas';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al conectar con el servidor';
        this.loading = false;
        console.error(err);
      }
    });
  }

  limpiarFiltro() {
    this.filtroProducto = '';
    this.loadAlertas();
  }

  crearAlerta() {
    this.router.navigate(['/alertas/nueva']);
  }

  editarAlerta(id: number) {
    this.router.navigate(['/alertas/editar', id]);
  }

  eliminarAlerta(id: number) {
    if (confirm('¿Está seguro de eliminar esta alerta?')) {
      this.alertasService.delete(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadAlertas();
          } else {
            alert(response.message || 'Error al eliminar');
          }
        },
        error: (err) => {
          alert('Error al eliminar la alerta');
          console.error(err);
        }
      });
    }
  }

  toggleNotificar(alerta: Alerta) {
    this.alertasService.update(alerta.id_alerta, {
      notificar: !alerta.notificar
    }).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadAlertas();
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
