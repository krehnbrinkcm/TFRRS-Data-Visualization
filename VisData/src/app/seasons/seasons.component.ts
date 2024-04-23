import { Component, Injectable, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { SeasonService, seasonObj } from './season.service';
import { LegendPosition, TreeMapModule } from '@swimlane/ngx-charts';
import { MatStepper } from '@angular/material/stepper';
import Scraper from '../../../../web-scraper/index.js'

@Injectable()

@Component({
  selector: 'app-seasons',
  templateUrl: './seasons.component.html',
  styleUrl: './seasons.component.css'
})

export class SeasonsComponent implements OnInit{

  dataset = [];
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
    this.confs = this.service.setConfs();
    this.events = this.service.setEvents();
  }

  seasonVar = ""
  conferenceVar = ""
  eventVar = ""

  //dataset = this.convertDataToDataset(this.data2)
  

  legendPosition: LegendPosition = LegendPosition.Below;

  onSeasonSelectionChange(event: any, stepper: MatStepper) {
    this.seasonVar = event.value;
    console.log(event.value)
    stepper.next();
}

onConferenceSelectionChange(event: any, stepper: MatStepper) {
    this.conferenceVar = event.value;
    stepper.next();
}

onEventSelectionChange(event: any, stepper: MatStepper) {
    this.eventVar = event.value;
    stepper.next();
}


  constructor(private service: SeasonService){}

  selectionsMade (){
    if (this.seasonVar != "" &&  this.conferenceVar != "" && this.eventVar != "")
      return true;
    return false;
  }

  addToDataset() {
    console.log("works")
  }



  convertDataToDataset(data: any): { name: string; series: any }[] {
    const dataset = {
        name: "example name",
        series: data.map((record: any) => {
            return {
                name: record.name,
                value: record.value
            };
        })
    };

    return [dataset];
}

  

   



}
