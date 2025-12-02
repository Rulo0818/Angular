import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type NotificacionTipo = 'info' | 'alerta' | 'error';

export interface Notificacion {
  id_notificacion: number;
  titulo: string;
  mensaje: string;
  tipo: NotificacionTipo;
  fecha: Date;
  leido: boolean;
}

export interface NotificacionCreate {
  titulo: string;
  mensaje: string;
  tipo?: NotificacionTipo;
  fecha?: Date;
  leido?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private apiUrl = 'http://localhost:3000/notificaciones';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Notificacion[]>> {
    return this.http.get<ApiResponse<Notificacion[]>>(this.apiUrl);
  }

  getById(id: number): Observable<ApiResponse<Notificacion>> {
    return this.http.get<ApiResponse<Notificacion>>(`${this.apiUrl}/${id}`);
  }

  create(notificacion: NotificacionCreate): Observable<ApiResponse<Notificacion>> {
    return this.http.post<ApiResponse<Notificacion>>(this.apiUrl, notificacion);
  }

  update(id: number, notificacion: Partial<NotificacionCreate>): Observable<ApiResponse<Notificacion>> {
    return this.http.put<ApiResponse<Notificacion>>(`${this.apiUrl}/${id}`, notificacion);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}

