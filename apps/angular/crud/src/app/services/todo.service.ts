import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { randText } from '@ngneat/falso';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { Todo } from '../models/todo.interface';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todosSubject: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>(
    [],
  );
  todos$: Observable<Todo[]> = this.todosSubject.asObservable();
  constructor(private http: HttpService) {
    this.fetchTodosFromBackend();
  }

  public fetchTodosFromBackend(): void {
    this.http
      .get<Todo[]>('https://jsonplaceholder.typicode.com/todos')
      .subscribe(
        (response) => {
          this.todosSubject.next(response);
        },
        (error) => {
          console.log(error);
        },
      );
  }

  public updateTodo(todo: Todo): void {
    const newTitle = randText();
    const body = JSON.stringify({
      todo: todo.id,
      title: newTitle,
      body: todo,
      userId: todo.userId,
    });
    const headers = new HttpHeaders();
    headers.set('Content-type', 'application/json; charset=UTF-8');
    this.http
      .put(
        `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
        body,
        headers,
      )
      .pipe(
        switchMap((updatedTodo) =>
          this.todos$.pipe(
            map((todos) => {
              return todos.map((todo) => {
                if (todo.id === (updatedTodo as { id: number }).id) {
                  todo.title = newTitle;
                }
                return todo;
              });
            }),
          ),
        ),
      )
      .subscribe((updatedData) => this.todosSubject.next(updatedData));
  }

  public deleteTodo(todo: Todo): void {
    const url = `https://jsonplaceholder.typicode.com/todos/${todo.id}`;
    const headers = new HttpHeaders();
    headers.set('Content-type', 'application/json; charset=UTF-8');
    this.http
      .delete(url, headers)
      .pipe(
        switchMap(() =>
          this.todos$.pipe(
            map((todos) => {
              return todos.filter((t) => t.id !== todo.id);
            }),
          ),
        ),
      )
      .subscribe((newTodos) => {
        this.todosSubject.next(newTodos);
      });
  }
}
