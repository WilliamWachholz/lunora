import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private toastr: ToastrService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error) {
          switch (error.status) {
            case 400:
              // Handle validation errors
              if (error.error.errors) {
                const modalStateErrors = [];
                for (const key in error.error.errors) {
                  if (error.error.errors[key]) {
                    modalStateErrors.push(error.error.errors[key]);
                  }
                }
                throw modalStateErrors.flat();
              } else if (typeof error.error === 'string') {
                this.toastr.error(error.error, error.status.toString());
              } else {
                this.toastr.error('Bad request', error.status.toString());
              }
              break;

            case 401:
              this.toastr.error('Unauthorized', error.status.toString());
              // Optional: Redirect to login page
              this.router.navigate(['/auth/login']);
              break;

            case 403:
              this.toastr.error('Forbidden', error.status.toString());
              // Optional: Redirect to access denied page
              this.router.navigate(['/forbidden']);
              break;

            case 404:
              this.router.navigate(['/not-found']);
              break;

            case 500:
              const navigationExtras = { state: { error: error.error } };
              this.router.navigate(['/server-error'], navigationExtras);
              break;

            default:
              this.toastr.error('Something unexpected went wrong');
              console.error(error);
              break;
          }
        }
        return throwError(() => error);
      })
    );
  }
}