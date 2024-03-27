import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(
    private router: Router
  ) {}

  links = [
    {path: '', name: 'Home'},
    {path: 'athletes', name: 'Explore Athletes'},
    {path: 'seasons', name: 'Explore Seasons'},
  ]
}