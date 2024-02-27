import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './error/error.component';
import { HomeComponent } from './home/home.component';
import { AthleteComponent } from './athlete/athlete.component';
import { SeasonsComponent } from './seasons/seasons.component';

export const routes: Routes = [{path: '', component: HomeComponent},
{path: 'athletes', component: AthleteComponent},
{path: 'seasons', component: SeasonsComponent},
{path: '**', component: ErrorComponent},];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

