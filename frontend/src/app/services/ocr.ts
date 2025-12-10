import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class OcrService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  readonly jsonOutput = signal<any | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  uploadFile(file: File): void {
    this.loading.set(true);
    this.error.set(null);
    this.jsonOutput.set(null);

    const formData = new FormData();
    formData.append('file', file);

    this.http
      .post<{ success: boolean; json: any }>(this.apiUrl, formData)
      .pipe(
        tap((res) => {
          if (res.success) {
            this.jsonOutput.set(res.json);
          } else {
            this.error.set('The server could not process the document.');
          }
        }),
        catchError((err: HttpErrorResponse) => {
          this.error.set(err.error?.error || 'An unexpected error occurred.');
          return of(null);
        }),
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe();
  }
}
