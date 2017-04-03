import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';

import { TodoService } from './todo.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
  providers: [TodoService]
})
export class TodoComponent implements OnInit {
  private todos;
  private activeTasks;
  private newTodo;
  private path;


  constructor(private todoService: TodoService, private route: ActivatedRoute) { }

  addTodo() {
    this.todoService.add({title: this.newTodo, isDone: false}).then(() =>{
      return this.getTodos();
    }).then(() => {
      this.newTodo = ''; //clear input form value
    });
  }

  getTodos(query = '') {
    return this.todoService.get(query).then(todos => {
      this.todos = todos;
      this.activeTasks = this.todos.filter(todo => todo.isDone).length;
    })
  }

  destroyTodo(todo) {
    return this.todoService.delete(todo._id).then(() => {
      return this.getTodos();
    }); 
  }

  clearCompleted() {
    this.todoService.deleteCompleted().then(() => {
      return this.getTodos();
    });
  }

  updateTodo(todo, newValue) {
    todo.title = newValue;
    return this.todoService.put(todo).then(() => {
      todo.editing = false;
      return this.getTodos();
    });
  }


  ngOnInit() {  
    this.route.params.subscribe(params => {
      this.path = params['status'];
      this.getTodos(this.path);
    });
  }
}