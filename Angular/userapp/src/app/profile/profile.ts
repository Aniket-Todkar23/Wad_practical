import { Component, inject } from '@angular/core';
import { Auth } from '../auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  auth = inject(Auth);
}
