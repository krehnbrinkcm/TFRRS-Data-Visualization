import { Injectable, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, from } from "rxjs";
import * as  scraperFunctions from '../../../../web-scraper/index.js'
import Confs from '../../../../web-scraper/confs'
import Events from '../../../../web-scraper/events'

export interface seasonObj {
    season: string,
    index: number,
}



@Injectable({providedIn: 'root',})

export class SeasonService {
    
    seasons:Array<seasonObj> = [];

    constructor(){}

    //getSeasons(): Observable<any[]> {
        //return from(scraperFunctions.scrapeSeasons());
    //}

    confs = new Confs();
    events = new Events()

    getConf(index: number){
        if(index === -1){
            return this.confs.arr0neg1();
        } else if (index === 0){
            return this.confs.arr00();
        } else if (index === 1){
            return this.confs.arr01();
        } else if (index === 2){
            return this.confs.arr02();
        } else if (index === 3){
            return this.confs.arr03();
        } else if (index === 4){
            return this.confs.arr04();
        } else if (index === 5){
            return this.confs.arr05();
        } else if (index === 6){
            return this.confs.arr06();
        } else if (index === 7){
            return this.confs.arr07();
        } else if (index === 8){
            return this.confs.arr08();
        } else if (index === 9){
            return this.confs.arr09();
        } else if (index === 10){
            return this.confs.arr010();
        } else if (index === 11){
            return this.confs.arr011();
        } else if (index === 12){
            return this.confs.arr012();
        } else if (index === 13) {
            return this.confs.arr013();
        } else if (index === 14){
            return this.confs.arr014();
        } else if (index === 15){
            return this.confs.arr015();
        } else if (index === 16){
            return this.confs.arr016();
        } else if (index === 17){
            return this.confs.arr017();
        } else if (index === 18){
            return this.confs.arr018();
        } else if (index === 19){
            return this.confs.arr019();
        } else if (index === 20){
            return this.confs.arr020();
        } else if (index === 21){
            return this.confs.arr021();
        } else if (index === 22){
            return this.confs.arr022();
        } else if (index === 23){
            return this.confs.arr023();
        } else if (index === 24){
            return this.confs.arr024();
        } else if (index === 25){
            return this.confs.arr025();
        } else if (index === 26){
            return this.confs.arr026();
        } else {
            return this.confs.arr027();
        }
    }

    getEv(link : String, ev: number){
      if(link == "https://tf.tfrrs.org/lists/3857/BIG_EAST_Outdoor_Performance_List" && ev == 1){
        console.log("INHERE");
          return this.events.httpstftfrrsorglists3857BIG_EAST_Outdoor_Performance_List1();
      } 
       else if (link == "https://tf.tfrrs.org/lists/3849/Sun_Belt_Outdoor_Performance_List" && ev == 1) {
        console.log("SUNBELTLINK")
          return this.events.httpstftfrrsorglists3849Sun_Belt_Outdoor_Performance_List1();
      }
      else {
        console.log("ELSE REACHED");
        return this.events.httpstftfrrsorglists3849Sun_Belt_Outdoor_Performance_List1()
      }
  }

    setEventData() {
        let dataset = [
            {
              name: "Legend",
              series: [
              {
              event: '100 Meters\n        (Men)',
              name: '1',
              athName: 'Kwaateng, Richmond',
              year: 'SO-2',
              team: 'Connecticut',
              value: '0',
              meet: 'BIG EAST Outdoor Track & Field Championships',
              meetDate: 'May 13, 2022',
              wind: '2.7'
            },
            {
              event: '100 Meters\n        (Men)',
              name: '2',
              athName: "O'Brien, Joseph",
              year: 'SO-2',
              team: 'Connecticut',
              value: '0',
              meet: 'BIG EAST Outdoor Track & Field Championships',
              meetDate: 'May 13, 2022',
              wind: '1.2'
            },
            {
              event: '100 Meters\n        (Men)',
              name: '3',
              athName: 'Paige, Joshua',
              year: 'SO-2',
              team: 'Georgetown',
              value: '0',
              meet: 'BIG EAST Outdoor Track & Field Championships',
              meetDate: 'May 13, 2022',
              wind: '1.2'
            },
            {
              event: '100 Meters\n        (Men)',
              name: '4',
              athName: 'Attucks, Cameron',
              year: 'SO-2',
              team: 'DePaul',
              value: '0',
              meet: 'Gibson Invitational',
              meetDate: 'Apr 21, 2022',
              wind: '3.9'
            },
            {
              event: '100 Meters\n        (Men)',
              name: '5',
              athName: 'Hackett, Aaron',
              year: 'JR-3',
              team: 'Connecticut',
              value: '0',
              meet: 'BIG EAST Outdoor Track & Field Championships',
              meetDate: 'May 13, 2022',
              wind: '2.7'
            },
            {
              event: '100 Meters\n        (Men)',
              name: '5',
              athName: 'Kane, Isaac',
              year: 'SO-2',
              team: 'Butler',
              value: '0',
              meet: '2022 Indiana Invitational',
              meetDate: 'Apr 22, 2022',
              wind: '3.8'
            },
            {
              event: '100 Meters\n        (Men)',
              name: '7',
              athName: 'Marshall, Myles',
              year: 'SO-2',
              team: 'DePaul',
              value: '0',
              meet: 'BIG EAST Outdoor Track & Field Championships',
              meetDate: 'May 13, 2022',
              wind: '2.7'
            },
            {
              event: '100 Meters\n        (Men)',
              name: '8',
              athName: 'Thompson, Josiah',
              year: 'JR-3',
              team: 'Connecticut',
              value: '0',
              meet: 'BIG EAST Outdoor Track & Field Championships',
              meetDate: 'May 13, 2022',
              wind: '1.2'
            },
            {
              event: '100 Meters\n        (Men)',
              name: '9',
              athName: 'Cole, Dominic',
              year: 'FR-1',
              team: 'DePaul',
              value: '0',
              meet: 'BIG EAST Outdoor Track & Field Championships',
              meetDate: 'May 13, 2022',
              wind: '2.7'
            },
            {
              event: '100 Meters\n        (Men)',
              name: '10',
              athName: 'Pitt, Christopher',
              year: 'SO-2',
              team: 'Georgetown',
              value: '0',
              meet: 'BIG EAST Outdoor Track & Field Championships',
              meetDate: 'May 13, 2022',
              wind: '1.2'
            },
            {
              event: '100 Meters\n        (Men)',
              name: '11',
              athName: 'Bradley, Ben',
              year: 'FR-1',
              team: 'Butler',
              value: '0',
              meet: 'Sycamore Open',
              meetDate: 'Apr 30, 2022',
              wind: '3.9'
            },
            {
              event: '100 Meters\n        (Men)',
              name: '12',
              athName: 'Mahony, Conor',
              year: 'SO-2',
              team: 'Connecticut',
              value: '0',
              meet: 'BIG EAST Outdoor Track & Field Championships',
              meetDate: 'May 13, 2022',
              wind: '2.7'
            },
            {
              event: '100 Meters\n        (Men)',
              name: '13',
              athName: 'Torney, Jordan',
              year: 'SR-4',
              team: 'Connecticut',
              value: '0',
              meet: 'BIG EAST Outdoor Track & Field Championships',
              meetDate: 'May 13, 2022',
              wind: '0.6'
            },
            {
              event: '100 Meters\n        (Men)',
              name: '14',
              athName: 'Bennett, Lee',
              year: 'SO-2',
              team: 'Xavier (Ohio)',
              value: '0',
              meet: 'BIG EAST Outdoor Track & Field Championships',
              meetDate: 'May 13, 2022',
              wind: '1.2'
            },
            {
              event: '100 Meters\n        (Men)',
              name: '15',
              athName: 'Elder, Jack',
              year: 'SO-2',
              team: 'Butler',
              value: '0',
              meet: 'BIG EAST Outdoor Track & Field Championships',
              meetDate: 'May 13, 2022',
              wind: '0.6'
            },
            {
              event: '100 Meters\n        (Men)',
              name: '16',
              athName: 'Troup, Michael',
              year: 'SR-4',
              team: 'Villanova',
              value: '0',
              meet: 'BIG EAST Outdoor Track & Field Championships',
              meetDate: 'May 13, 2022',
              wind: '2.7'
            },
            {
              event: '100 Meters\n        (Men)',
              name: '17',
              athName: 'Debelak, Zach',
              year: 'JR-3',
              team: 'DePaul',
              value: '0',
              meet: 'Gibson Invitational',
              meetDate: 'Apr 21, 2022',
              wind: '4.0'
            },
            {
              event: '100 Meters\n        (Men)',
              name: '18',
              athName: 'Bendel, Daniel',
              year: 'SR-4',
              team: 'Marquette',
              value: '0',
              meet: 'BIG EAST Outdoor Track & Field Championships',
              meetDate: 'May 13, 2022',
              wind: '2.7'
            },
            {
              event: '100 Meters\n        (Men)',
              name: '19',
              athName: 'Wright, Julian',
              year: 'SO-2',
              team: 'Marquette',
              value: '0',
              meet: 'Pacific Coast Invitational 2022',
              meetDate: 'Apr 14, 2022',
              wind: '3.5'
            },
            {
              event: '100 Meters\n        (Men)',
              name: '20',
              athName: 'Grosse, Benjamin',
              year: 'SR-4',
              team: 'Connecticut',
              value: '0',
              meet: 'BIG EAST Outdoor Track & Field Championships',
              meetDate: 'May 13, 2022',
              wind: '0.6'
            },
            {
              event: '100 Meters\n        (Men)',
              name: '21',
              athName: 'Johnson, Jeremy',
              year: 'SR-4',
              team: 'Xavier (Ohio)',
              value: '0',
              meet: 'Jesse Owens Track Classic',
              meetDate: 'Apr 22, 2022',
              wind: '-1.0'
            },
            {
              event: '100 Meters\n        (Men)',
              name: '22',
              athName: 'Heller, Brady',
              year: 'JR-3',
              team: 'Marquette',
              value: '0',
              meet: 'BIG EAST Outdoor Track & Field Championships',
              meetDate: 'May 13, 2022',
              wind: '0.6'
            },
            {
              event: '100 Meters\n        (Men)',
              name: '22',
              athName: 'Williams, Julian',
              year: 'FR-1',
              team: 'Georgetown',
              value: '0',
              meet: 'Virginia Challenge',
              meetDate: 'Apr 22, 2022',
              wind: '-1.7'
            },
            {
              event: '100 Meters\n        (Men)',
              name: '24',
              athName: 'Werven, Simon',
              year: 'SO-2',
              team: 'Marquette',
              value: '0',
              meet: 'BIG EAST Outdoor Track & Field Championships',
              meetDate: 'May 13, 2022',
              wind: '0.6'
            },
            {
              event: '100 Meters\n        (Men)',
              name: '25',
              athName: 'Nations, Gus',
              year: 'JR-3',
              team: 'Xavier (Ohio)',
              value: '0',
              meet: 'Jesse Owens Track Classic',
              meetDate: 'Apr 22, 2022',
              wind: '3.0'
            }
          ]
        }
    ]
    return dataset;
    }

    setSeasons() {
        let seasons = [
            { season: '2024 INDOOR', index: -1 },
            { season: '2023 OUTDOOR', index: 0 },
            { season: '2023 INDOOR', index: 1 },
            { season: '2022 OUTDOOR', index: 2 },
            { season: '2022 INDOOR', index: 3 },
            { season: '2021 OUTDOOR', index: 4 },
            { season: '2021 INDOOR', index: 5 },
            { season: '2020 OUTDOOR', index: 6 },
            { season: '2020 INDOOR', index: 7 },
            { season: '2019 OUTDOOR', index: 8 },
            { season: '2019 INDOOR', index: 9 },
            { season: '2018 OUTDOOR', index: 10 },
            { season: '2018 INDOOR', index: 11 },
            { season: '2017 OUTDOOR', index: 12 },
            { season: '2017 INDOOR', index: 13 },
            { season: '2016 OUTDOOR', index: 14 },
            { season: '2016 INDOOR', index: 15 },
            { season: '2015 OUTDOOR', index: 16 },
            { season: '2015 INDOOR', index: 17 },
            { season: '2014 OUTDOOR', index: 18 },
            { season: '2014 INDOOR', index: 19 },
            { season: '2013 OUTDOOR', index: 20 },
            { season: '2013 INDOOR', index: 21 },
            { season: '2012 OUTDOOR', index: 22 },
            { season: '2012 INDOOR', index: 23 },
            { season: '2011 OUTDOOR', index: 24 },
            { season: '2011 INDOOR', index: 25 },
            { season: '2010 OUTDOOR', index: 26 },
            { season: '2010 INDOOR', index: 27 }
          ]

          return seasons;
    }

    setConfs() {
        let confs = [
            {
              conf: 'Div. I Combined List',
              link: 'https://tf.tfrrs.org/lists/3191/2021_NCAA_Division_I_Outdoor_Qualifying_FINAL'
            },
            {
              conf: 'Div. I East Qualifying List ',
              link: 'https://tf.tfrrs.org/lists/3192/2021_NCAA_Div_I_East_Outdoor_Qualifying_FINAL'
            },
            {
              conf: 'Div. I West Qualifying List ',
              link: 'https://tf.tfrrs.org/lists/3193/2021_NCAA_Div_I_West_Outdoor_Qualifying_FINAL'
            },
            {
              conf: 'ACC',
              link: 'https://tf.tfrrs.org/lists/3368/ACC_Outdoor_Performance_List'
            },
            {
              conf: 'ASUN',
              link: 'https://tf.tfrrs.org/lists/3378/Atlantic_Sun_Outdoor_Performance_List'
            },
            {
              conf: 'America East',
              link: 'https://tf.tfrrs.org/lists/3414/America_East_Outdoor_Performance_List'
            },
            {
              conf: 'Atlantic 10',
              link: 'https://tf.tfrrs.org/lists/3380/Atlantic_10_Outdoor_Performance_List'
            },
            {
              conf: 'BIG EAST',
              link: 'https://tf.tfrrs.org/lists/3388/BIG_EAST_Outdoor_Performance_List'
            },
            {
              conf: 'Big 12',
              link: 'https://tf.tfrrs.org/lists/3364/Big_12_Outdoor_Performance_List'
            },
            {
              conf: 'Big Sky',
              link: 'https://tf.tfrrs.org/lists/3377/Big_Sky_Outdoor_Performance_List'
            },
            {
              conf: 'Big South',
              link: 'https://tf.tfrrs.org/lists/3381/Big_South_Outdoor_Performance_List'
            },
            {
              conf: 'Big Ten',
              link: 'https://tf.tfrrs.org/lists/3367/Big_Ten_Outdoor_Performance_List'
            },
            {
              conf: 'Big West',
              link: 'https://tf.tfrrs.org/lists/3391/Big_West_Outdoor_Performance_List'
            },
            {
              conf: 'CAA',
              link: 'https://tf.tfrrs.org/lists/3386/Colonial_CAA_Outdoor_Performance_List'
            },
            {
              conf: 'Conference USA',
              link: 'https://tf.tfrrs.org/lists/3369/Conference_USA_Outdoor_Performance_List'
            },
            {
              conf: 'Horizon League',
              link: 'https://tf.tfrrs.org/lists/3371/Horizon_League_Outdoor_Performance_List'
            },
            {
              conf: 'IC4A/ECAC',
              link: 'https://tf.tfrrs.org/lists/3463/IC4A_ECAC_Outdoor_Performance_List'
            },
            {
              conf: 'MEAC',
              link: 'https://tf.tfrrs.org/lists/3382/Mid_Eastern_MEAC_Outdoor_Performance_List'
            },
            {
              conf: 'Metro Atlantic',
              link: 'https://tf.tfrrs.org/lists/3399/Metro_Atlantic_MAAC_Outdoor_Performance_List'
            },
            {
              conf: 'Mid-American',
              link: 'https://tf.tfrrs.org/lists/3374/Mid_American_MAC_Outdoor_Performance_List'
            },
            {
              conf: 'Missouri Valley',
              link: 'https://tf.tfrrs.org/lists/3372/Missouri_Valley_MVC_Outdoor_Performance_List'
            },
            {
              conf: 'Mountain West',
              link: 'https://tf.tfrrs.org/lists/3383/Mountain_West_Outdoor_Performance_List'
            },
            {
              conf: 'NEC',
              link: 'https://tf.tfrrs.org/lists/3395/Northeast_Conference_Outdoor_Performance_List'
            },
            {
              conf: 'Ohio Valley',
              link: 'https://tf.tfrrs.org/lists/3379/Ohio_Valley_OVC_Outdoor_Performance_List'
            },
            {
              conf: 'Pac-12',
              link: 'https://tf.tfrrs.org/lists/3384/Pac_12_Outdoor_Performance_List'
            },
            {
              conf: 'Patriot League',
              link: 'https://tf.tfrrs.org/lists/3385/Patriot_League_Outdoor_Performance_List'
            },
            {
              conf: 'SEC',
              link: 'https://tf.tfrrs.org/lists/3375/SEC_Outdoor_Performance_List'
            },
            {
              conf: 'SWAC',
              link: 'https://tf.tfrrs.org/lists/3370/SWAC_Outdoor_Performance_List'
            },
            {
              conf: 'Southern Conference',
              link: 'https://tf.tfrrs.org/lists/3376/Southern_Conference_Outdoor_Performance_List'
            },
            {
              conf: 'Southland Conference',
              link: 'https://tf.tfrrs.org/lists/3365/Southland_Conference_Outdoor_Performance_List'
            },
            {
              conf: 'Sun Belt',
              link: 'https://tf.tfrrs.org/lists/3366/Sun_Belt_Outdoor_Performance_List'
            },
            {
              conf: 'The American',
              link: 'https://tf.tfrrs.org/lists/3373/The_American_Outdoor_Performance_List'
            },
            {
              conf: 'The Summit League',
              link: 'https://tf.tfrrs.org/lists/3331/The_Summit_League_Outdoor_Performance_List'
            },
            {
              conf: 'WAC',
              link: 'https://tf.tfrrs.org/lists/3387/WAC_Outdoor_Performance_List'
            },
            {
              conf: 'Outdoor Qualifying List',
              link: 'https://tf.tfrrs.org/lists/3194/2021_NCAA_Division_II_Outdoor_Qualifying_FINAL'
            },
            {
              conf: 'DII Atlantic Region',
              link: 'https://tf.tfrrs.org/lists/3443/DII_Atlantic_Region_Outdoor_Performance_List'
            },
            {
              conf: 'DII Central Region',
              link: 'https://tf.tfrrs.org/lists/3444/DII_Central_Region_Outdoor_Performance_List'
            },
            {
              conf: 'DII East Region',
              link: 'https://tf.tfrrs.org/lists/3445/DII_East_Region_Outdoor_Performance_List'
            },
            {
              conf: 'DII Midwest Region',
              link: 'https://tf.tfrrs.org/lists/3446/DII_Midwest_Region_Outdoor_Performance_List'
            },
            {
              conf: 'DII South Central Region',
              link: 'https://tf.tfrrs.org/lists/3447/DII_South_Central_Region_Outdoor_Performance_List'
            },
            {
              conf: 'DII South Region',
              link: 'https://tf.tfrrs.org/lists/3448/DII_South_Region_Outdoor_Performance_List'
            },
            {
              conf: 'DII Southeast Region',
              link: 'https://tf.tfrrs.org/lists/3449/DII_Southeast_Region_Outdoor_Performance_List'
            },
            {
              conf: 'DII West Region',
              link: 'https://tf.tfrrs.org/lists/3450/DII_West_Region_Outdoor_Performance_List'
            },
            {
              conf: 'CACC',
              link: 'https://tf.tfrrs.org/lists/3456/CACC_Outdoor_Performance_List'
            },
            {
              conf: 'Conference Carolinas',
              link: 'https://tf.tfrrs.org/lists/3336/Conference_Carolinas_Outdoor_Performance_List'
            },
            {
              conf: 'ECC',
              link: 'https://tf.tfrrs.org/lists/3349/ECC_Outdoor_Performance_List'
            },
            {
              conf: 'GLIAC',
              link: 'https://tf.tfrrs.org/lists/3332/GLIAC_Outdoor_Performance_List'
            },
            {
              conf: 'GLVC',
              link: 'https://tf.tfrrs.org/lists/3344/GLVC_Outdoor_Performance_List'
            },
            {
              conf: 'GNAC',
              link: 'https://tf.tfrrs.org/lists/3345/GNAC_Outdoor_Performance_List'
            },
            {
              conf: 'Great American',
              link: 'https://tf.tfrrs.org/lists/3347/Great_American_Outdoor_Performance_List'
            },
            {
              conf: 'Great Midwest',
              link: 'https://tf.tfrrs.org/lists/3338/Great_Midwest_Outdoor_Performance_List'
            },
            {
              conf: 'Gulf South',
              link: 'https://tf.tfrrs.org/lists/3341/Gulf_South_Outdoor_Performance_List'
            },
            {
              conf: 'Lone Star',
              link: 'https://tf.tfrrs.org/lists/3340/Lone_Star_Outdoor_Performance_List'
            },
            {
              conf: 'MIAA',
              link: 'https://tf.tfrrs.org/lists/3337/MIAA_Outdoor_Performance_List'
            },
            {
              conf: 'Mountain East',
              link: 'https://tf.tfrrs.org/lists/3348/Mountain_East_Outdoor_Performance_List'
            },
            {
              conf: 'Northeast-10',
              link: 'https://tf.tfrrs.org/lists/3454/Northeast_10_Outdoor_Performance_List'
            },
            {
              conf: 'Northern Sun',
              link: 'https://tf.tfrrs.org/lists/3342/Northern_Sun_Outdoor_Performance_List'
            },
            {
              conf: 'PSAC',
              link: 'https://tf.tfrrs.org/lists/3393/PSAC_Outdoor_Performance_List'
            },
            {
              conf: 'PacWest',
              link: 'https://tf.tfrrs.org/lists/3350/PacWest_Outdoor_Performance_List'
            },
            {
              conf: 'Peach Belt',
              link: 'https://tf.tfrrs.org/lists/3346/Peach_Belt_Outdoor_Performance_List'
            },
            {
              conf: 'RMAC',
              link: 'https://tf.tfrrs.org/lists/3339/RMAC_Outdoor_Performance_List'
            },
            {
              conf: 'South Atlantic',
              link: 'https://tf.tfrrs.org/lists/3343/South_Atlantic_Outdoor_Performance_List'
            },
            {
              conf: 'Outdoor Qualifying List',
              link: 'https://tf.tfrrs.org/lists/3195/2021_NCAA_Division_III_Outdoor_Qualifying_FINAL'
            },
            {
              conf: 'DIII Great Lakes Region',
              link: 'https://tf.tfrrs.org/lists/3438/DIII_Great_Lakes_Region_Outdoor_Performance_List'
            },
            {
              conf: 'DIII Mid-Atlantic Region',
              link: 'https://tf.tfrrs.org/lists/3439/DIII_Mideast_Region_Outdoor_Performance_List'
            },
            {
              conf: 'DIII Midwest Region',
              link: 'https://tf.tfrrs.org/lists/3440/DIII_Midwest_Region_Outdoor_Performance_List'
            },
            {
              conf: 'DIII Niagara Region',
              link: 'https://tf.tfrrs.org/lists/3436/DIII_Atlantic_Region_Outdoor_Performance_List'
            },
            {
              conf: 'DIII North Region',
              link: 'https://tf.tfrrs.org/lists/3437/DIII_Central_Region_Outdoor_Performance_List'
            },
            {
              conf: 'DIII South Region',
              link: 'https://tf.tfrrs.org/lists/3441/DIII_South_SE_Region_Outdoor_Performance_List'
            },
            {
              conf: 'DIII West Region',
              link: 'https://tf.tfrrs.org/lists/3442/DIII_West_Region_Outdoor_Performance_List'
            },
            {
              conf: 'AARTFC',
              link: 'https://tf.tfrrs.org/lists/3459/AARTFC_Outdoor_Performance_List'
            },
            {
              conf: 'American Rivers Conference',
              link: 'https://tf.tfrrs.org/lists/3353/American_Rivers_Outdoor_Performance_List'
            },
            {
              conf: 'Atlantic East',
              link: 'https://tf.tfrrs.org/lists/3432/Atlantic_East_Outdoor_Performance_List'
            },
            {
              conf: 'CCIW',
              link: 'https://tf.tfrrs.org/lists/3358/CCIW_Outdoor_Performance_List'
            },
            {
              conf: 'CSAC',
              link: 'https://tf.tfrrs.org/lists/3462/Colonial_States_Outdoor_Performance_List'
            },
            {
              conf: 'Centennial Conference',
              link: 'https://tf.tfrrs.org/lists/3431/Centennial_Conference_Outdoor_Performance_List'
            },
            {
              conf: 'Coast-to-Coast',
              link: 'https://tf.tfrrs.org/lists/3396/Coast_to_Coast_Outdoor_Performance_List'
            },
            {
              conf: 'DIII New England',
              link: 'https://tf.tfrrs.org/lists/3451/DIII_New_England_Region_Outdoor_Performance_List'
            },
            {
              conf: 'Empire 8 ',
              link: 'https://tf.tfrrs.org/lists/3360/Empire_8_Outdoor_Performance_List'
            },
            {
              conf: 'HCAC',
              link: 'https://tf.tfrrs.org/lists/3333/HCAC_Outdoor_Performance_List'
            },
            {
              conf: 'Landmark Conference',
              link: 'https://tf.tfrrs.org/lists/3430/Landmark_Conference_Outdoor_Performance_List'
            },
            {
              conf: 'Liberty League',
              link: 'https://tf.tfrrs.org/lists/3453/Liberty_League_Outdoor_Performance_List'
            },
            {
              conf: 'Little East',
              link: 'https://tf.tfrrs.org/lists/3397/Little_East_Outdoor_Performance_List'
            },
            {
              conf: 'MASCAC',
              link: 'https://tf.tfrrs.org/lists/3457/MASCAC_Outdoor_Performance_List'
            },
            {
              conf: 'MIAC',
              link: 'https://tf.tfrrs.org/lists/3354/MIAC_Outdoor_Performance_List'
            },
            {
              conf: 'Michigan Intercollegiate AA',
              link: 'https://tf.tfrrs.org/lists/3356/Michigan_Intercollegiate_Outdoor_Performance_List'
            },
            {
              conf: 'Middle Atlantic Conferences',
              link: 'https://tf.tfrrs.org/lists/3398/Middle_Atlantic_Conferences_Outdoor_List'
            },
            {
              conf: 'Midwest Conference',
              link: 'https://tf.tfrrs.org/lists/3392/Midwest_Conference_Outdoor_Performance_List'
            },
            {
              conf: 'NACC',
              link: 'https://tf.tfrrs.org/lists/3433/NACC_Outdoor_Performance_List'
            },
            {
              conf: 'NEICAAA',
              link: 'https://tf.tfrrs.org/lists/3452/NEICAAA_Outdoor_Performance_List'
            },
            {
              conf: 'NESCAC',
              link: 'https://tf.tfrrs.org/lists/3461/NESCAC_Outdoor_Performance_List'
            },
            {
              conf: 'NEWMAC',
              link: 'https://tf.tfrrs.org/lists/3460/NEWMAC_Outdoor_Performance_List'
            },
            {
              conf: 'NJAC',
              link: 'https://tf.tfrrs.org/lists/3455/NJAC_Outdoor_Performance_List'
            },
            {
              conf: 'North Coast AC',
              link: 'https://tf.tfrrs.org/lists/3352/North_Coast_AC_Outdoor_Performance_List'
            },
            {
              conf: 'Northwest Conference',
              link: 'https://tf.tfrrs.org/lists/3335/Northwest_Conference_Outdoor_Performance_List'
            },
            {
              conf: 'ODAC',
              link: 'https://tf.tfrrs.org/lists/3351/ODAC_Outdoor_Performance_List'
            },
            {
              conf: 'Ohio Athletic Conference',
              link: 'https://tf.tfrrs.org/lists/3355/Ohio_Athletic_Conference_Outdoor_Performance_List'
            },
            {
              conf: 'Presidents AC',
              link: 'https://tf.tfrrs.org/lists/3361/Presidents_Athletic_Conference_Performance_List'
            },
            {
              conf: 'SCAC',
              link: 'https://tf.tfrrs.org/lists/3400/SCAC_Outdoor_Performance_List'
            },
            {
              conf: 'SCIAC',
              link: 'https://tf.tfrrs.org/lists/3429/SCIAC_Outdoor_Performance_List'
            }
          ]
          return confs;
    }

    setEvents() {
        let events = [
            "60 meters",
            "100 meters",
            "200 meters",
            "400 meters",
            "800 meters",
            "1500 meters",
            "3000 meters",
            "5000 meters",
            "10,000 meters",
            "60-meter hurdles",
            "100-meter hurdles",
            "110-meter hurdles",
            "400-meter hurdles",
            "3000 meters steeplechase",
            "4x100 meters relay",
            "4x400 meters relay",
            "20 kilometers race walk",
            "50 kilometers race walk",
            "High jump",
            "Pole vault",
            "Long jump",
            "Triple jump",
            "Shot put",
            "Discus throw",
            "Hammer throw",
            "Javelin throw",
            "Decathlon (men)",
            "Heptathlon (women)"
        ];
        return events;
    }
}