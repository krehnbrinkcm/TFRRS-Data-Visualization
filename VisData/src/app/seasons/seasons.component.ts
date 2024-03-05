import { Component, Injectable, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { SeasonService } from './season.service';

@Injectable()

@Component({
  selector: 'app-seasons',
  templateUrl: './seasons.component.html',
  styleUrl: './seasons.component.css'
})

export class SeasonsComponent implements OnInit{
  seasons:any[] = [];

  constructor(private service: SeasonService){}

  ngOnInit(){
    this.service.getSeasons().subscribe((data) => {
      this.seasons = data;
    },
    (err) => {
      console.error('Error in fetching season data: ',err);
    })
  }

//   seasons = [
//   {season: "2023 Outdoor", id: 0},
//   {season: "2023 Indoor", id: 1},
//   {season: "2022 Outdoor", id: 2},
//   {season: "2022 Indoor", id: 3},
//   {season: "2021 Outdoor", id: 4},
//   {season: "2021 Indoor", id: 5},
//   {season: "2020 Outdoor", id: 6},
//   {season: "2020 Indoor", id: 7},
//   {season: "2019 Outdoor", id: 8},
//   {season: "2019 Indoor", id: 9}
// ]
}
