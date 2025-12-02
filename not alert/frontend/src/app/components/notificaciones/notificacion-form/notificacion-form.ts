import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificacionesService, NotificacionTipo } from '../../../services/notificaciones.service';

@Component({
  selector: 'app-notificacion-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './notificacion-form.html',
  styleUrl: './notificacion-form.css',
})
export class NotificacionForm implements OnInit {
  form: FormGroup;
  isEditMode = false;
  notificacionId: number | null = null;
  loading = false;
  error: string | null = null;
  tipos: NotificacionTipo[] = ['info', 'alerta', 'error'];

  constructor(
    private fb: FormBuilder,
    private notificacionesService: NotificacionesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(150)]],
      mensaje: ['', [Validators.required]],
      tipo: ['info', Validators.required],
      fecha: [''],
      leido: [false]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.notificacionId = parseInt(id, 10);
      this.loadNotificacion(this.notificacionId);
    }
  }

  loadNotificacion(id: number) {
    this.loading = true;
    this.notificacionesService.getById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const notificacion = response.data;
          this.form.patchValue({
            titulo: notificacion.titulo,
            mensaje: notificacion.mensaje,
            tipo: notificacion.tipo,
            fecha: new Date(notificacion.fecha).toISOString().slice(0, 16),
            leido: notificacion.leido
          });
        } else {
          this.error = response.message || 'Error al cargar notificación';
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

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.error = null;
      
      const formValue = this.form.value;
      const data: any = {
        titulo: formValue.titulo,
        mensaje: formValue.mensaje,
        tipo: formValue.tipo,
        leido: formValue.leido
      };

      if (formValue.fecha) {
        data.fecha = new Date(formValue.fecha).toISOString();
      }

      const observable = this.isEditMode && this.notificacionId
        ? this.notificacionesService.update(this.notificacionId, data)
        : this.notificacionesService.create(data);

      observable.subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/notificaciones']);
          } else {
            this.error = response.message || 'Error al guardar';
            this.loading = false;
          }
        },
        error: (err) => {
          this.error = 'Error al conectar con el servidor';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  cancelar() {
    this.router.navigate(['/notificaciones']);
  }
}
