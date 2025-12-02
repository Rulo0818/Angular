import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Alerta {
  id_alerta: number;
  id_producto: number;
  stock_minimo: number;
  stock_maximo: number;
  notificar: boolean;
}

export interface AlertaCreate {
  id_producto: number;
  stock_minimo: number;
  stock_maximo: number;
  notificar?: boolean;
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
export class AlertasService {
  private apiUrl = 'http://localhost:3000/alertas';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Alerta[]>> {
    return this.http.get<ApiResponse<Alerta[]>>(this.apiUrl);
  }

  getById(id: number): Observable<ApiResponse<Alerta>> {
    return this.http.get<ApiResponse<Alerta>>(`${this.apiUrl}/${id}`);
  }

  getByProducto(idProducto: number): Observable<ApiResponse<Alerta[]>> {
    return this.http.get<ApiResponse<Alerta[]>>(`${this.apiUrl}/producto/${idProducto}`);
  }

  create(alerta: AlertaCreate): Observable<ApiResponse<Alerta>> {
    return this.http.post<ApiResponse<Alerta>>(this.apiUrl, alerta);
  }

  update(id: number, alerta: Partial<AlertaCreate>): Observable<ApiResponse<Alerta>> {
    return this.http.put<ApiResponse<Alerta>>(`${this.apiUrl}/${id}`, alerta);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}

