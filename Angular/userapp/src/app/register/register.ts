import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  user = { name: '', email: '', password: '' };
  auth = inject(Auth);
  router = inject(Router);

  onSubmit() {
    if(this.auth.register(this.user)) {
      alert('Registration successful! Please login.');
      this.router.navigate(['/login']);
    }
  }
}
