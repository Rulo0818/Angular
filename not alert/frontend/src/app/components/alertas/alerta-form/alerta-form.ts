import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertasService } from '../../../services/alertas.service';

@Component({
  selector: 'app-alerta-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './alerta-form.html',
  styleUrl: './alerta-form.css',
})
export class AlertaForm implements OnInit {
  form: FormGroup;
  isEditMode = false;
  alertaId: number | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private alertasService: AlertasService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      id_producto: ['', [Validators.required, Validators.min(1)]],
      stock_minimo: ['', [Validators.required, Validators.min(0)]],
      stock_maximo: ['', [Validators.required, Validators.min(0)]],
      notificar: [true]
    }, { validators: this.stockValidator });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.alertaId = parseInt(id, 10);
      this.loadAlerta(this.alertaId);
    }
  }

  stockValidator(form: FormGroup) {
    const stockMin = form.get('stock_minimo')?.value;
    const stockMax = form.get('stock_maximo')?.value;
    if (stockMin !== null && stockMax !== null && stockMin > stockMax) {
      form.get('stock_maximo')?.setErrors({ stockInvalid: true });
      return { stockInvalid: true };
    }
    return null;
  }

  loadAlerta(id: number) {
    this.loading = true;
    this.alertasService.getById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const alerta = response.data;
          this.form.patchValue({
            id_producto: alerta.id_producto,
            stock_minimo: alerta.stock_minimo,
            stock_maximo: alerta.stock_maximo,
            notificar: alerta.notificar
          });
        } else {
          this.error = response.message || 'Error al cargar alerta';
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
      const data = {
        id_producto: parseInt(formValue.id_producto, 10),
        stock_minimo: parseFloat(formValue.stock_minimo),
        stock_maximo: parseFloat(formValue.stock_maximo),
        notificar: formValue.notificar
      };

      const observable = this.isEditMode && this.alertaId
        ? this.alertasService.update(this.alertaId, data)
        : this.alertasService.create(data);

      observable.subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/alertas']);
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
    this.router.navigate(['/alertas']);
  }
}
