import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo.html',
  styleUrls: ['./todo.css']
})
export class TodoComponent {

  tasks: string[] = [];
  editIndex = -1;

  addTask(input: HTMLInputElement) {
    if (input.value === '') return;

    if (this.editIndex === -1) {
      this.tasks.push(input.value);
    } else {
      this.tasks[this.editIndex] = input.value;
      this.editIndex = -1;
    }

    input.value = '';
  }

  editTask(i: number, input: HTMLInputElement) {
    input.value = this.tasks[i];
    this.editIndex = i;
  }

  deleteTask(i: number) {
    this.tasks.splice(i, 1);
  }
}