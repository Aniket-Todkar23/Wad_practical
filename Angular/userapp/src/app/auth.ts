import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  currentUser = signal<any>(null);

  constructor() {
    const savedUser = localStorage.getItem('loggedUser');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  register(user: any) {
    localStorage.setItem('registeredUser', JSON.stringify(user));
    return true;
  }

  login(credentials: any) {
    const savedString = localStorage.getItem('registeredUser');
    if (savedString) {
      const savedUser = JSON.parse(savedString);
      if (savedUser.email === credentials.email && savedUser.password === credentials.password) {
        this.currentUser.set(savedUser);
        localStorage.setItem('loggedUser', JSON.stringify(savedUser));
        return true;
      }
    }
    return false;
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('loggedUser');
  }
}
