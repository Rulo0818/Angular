import { Routes } from '@angular/router';
import { NotificacionesList } from './components/notificaciones/notificaciones-list/notificaciones-list';
import { NotificacionForm } from './components/notificaciones/notificacion-form/notificacion-form';
import { AlertasList } from './components/alertas/alertas-list/alertas-list';
import { AlertaForm } from './components/alertas/alerta-form/alerta-form';

export const routes: Routes = [
  { path: '', redirectTo: '/notificaciones', pathMatch: 'full' },
  { path: 'notificaciones', component: NotificacionesList },
  { path: 'notificaciones/nueva', component: NotificacionForm },
  { path: 'notificaciones/editar/:id', component: NotificacionForm },
  { path: 'alertas', component: AlertasList },
  { path: 'alertas/nueva', component: AlertaForm },
  { path: 'alertas/editar/:id', component: AlertaForm },
  { path: '**', redirectTo: '/notificaciones' }
];
