import { Component, Injectable, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { SeasonService, seasonObj } from './season.service';
import { LegendPosition, TreeMapModule } from '@swimlane/ngx-charts';
import { MatStepper } from '@angular/material/stepper';
import Scraper from '../../../../web-scraper/index.js'
import { ChangeDetectorRef } from '@angular/core';

@Injectable()

@Component({
  selector: 'app-seasons',
  templateUrl: './seasons.component.html',
  styleUrl: './seasons.component.css'
})

export class SeasonsComponent implements OnInit{

  dataset = this.service.setEventData();
  seasArr: Array<seasonObj> = [];
  seasons: Array<seasonObj> = [];
  data2 = [{}];
  confs: Array<{conf:String, link:String}> = [];
  events = [{}];
  activeSeason: seasonObj = { season: '2024 OUTDOOR', index: -2 }
  //dataset = this.convertDataToDataset(this.data2)

  
  
  ngOnInit(): void {
    let seasString = localStorage.getItem("seasons");

    if(seasString){
      this.seasArr = JSON.parse(seasString);
      this.seasons = this.seasArr;
    }
    this.data2 = this.service.setEventData();
    this.seasons = this.service.setSeasons();
    //this.confs = this.service.setConfs();
    this.events = this.service.setEvents();
  }

  seasonVar = ""
  conferenceVar = ""
  eventVar: any
  evString = ""
  confString = ""

  //dataset = this.convertDataToDataset(this.data2)
  

  legendPosition: LegendPosition = LegendPosition.Below;

  onSeasonSelectionChange(event: any, stepper: MatStepper) {
    this.seasonVar = event.value.season;
    //console.log(event.value);
    this.confs = this.service.getConf(event.value.index);
    this.selectionsMade();
    stepper.next();
}

onConferenceSelectionChange(event: any, stepper: MatStepper) {
    this.conferenceVar = event.value.link;
    console.log(event.value.link);
    this.selectionsMade();
    this.confString = event.value.name;
    stepper.next();
}

onEventSelectionChange(event: any, stepper: MatStepper) {
    this.eventVar = event.value;
    console.log(event.value);
    if (event.value == "100 meters") {
      this.evString = "100 meters"
      this.eventVar = this.service.getEv(this.conferenceVar,1);
    }
    this.selectionsMade();
    console.log(this.eventVar);
    stepper.next();
}


  constructor(private service: SeasonService, private cdr: ChangeDetectorRef){}

  selectionsMade (){
    if (this.seasonVar != "" &&  this.conferenceVar != "" && this.eventVar != "")
      return true;
    return false;
  }

  orig : boolean = true;
  addToDataset() {
     if (this.orig) {
       this.dataset = [];
    }
    this.orig = false;
    var toAdd = {
      name: this.seasonVar + " " + this.confString + " " + this.evString,
      series: this.eventVar
    };
    // Create a new array by concatenating the existing dataset with the new data
    this.dataset = [...this.dataset, toAdd];
    //this.dataset = [toAdd]

    console.log(this.dataset);
  }
}