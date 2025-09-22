import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { CartService } from './core/services/cart.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('lunora'); 
  
  cartCount = 0;
  isAuthenticated = false;
  isAdmin = false;
  currentUser: any = null;
  
  private subscriptions = new Subscription();

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to authentication state changes
    this.subscriptions.add(
      this.authService.isAuthenticated$.subscribe((isAuth: boolean) => {
        this.isAuthenticated = isAuth;
      })
    );

    // Subscribe to admin state changes
    this.subscriptions.add(
      this.authService.isAdmin$.subscribe((isAdmin: boolean) => {
        this.isAdmin = isAdmin;
      })
    );

    // Subscribe to current user changes
    this.subscriptions.add(
      this.authService.currentUser$.subscribe((user: any) => {
        this.currentUser = user;
      })
    );

    // Subscribe to cart count changes
    this.subscriptions.add(
      this.cartService.cartItems$.subscribe((items: any[]) => {
        this.cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
      })
    );

    // Scroll to top on route changes
    this.subscriptions.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          window.scrollTo(0, 0);
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

}
