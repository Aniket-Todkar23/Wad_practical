import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  credentials = { email: '', password: '' };
  auth = inject(Auth);
  router = inject(Router);

  onSubmit() {
    if(this.auth.login(this.credentials)) {
      this.router.navigate(['/profile']);
    } else {
      alert('Invalid email or password');
    }
  }
}
