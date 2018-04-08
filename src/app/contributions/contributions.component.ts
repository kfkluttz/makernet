import { Subscription } from 'rxjs/Subscription';
import { DataService } from '../data.service';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MakerspaceProject } from '../models/makerspace-project';
import { AngularFireStorage } from 'angularfire2/storage';

@Component({
  selector: 'app-contributions',
  templateUrl: './contributions.component.html',
  styleUrls: ['./contributions.component.css']
})
export class ContributionsComponent implements OnInit {

  public firebase;
  projectData: any;
  projectDataSubscription: Subscription;

  constructor(private angularFire: AngularFireDatabase, private afStorage: AngularFireStorage, private ds: DataService) {

    this.firebase = this.angularFire.list('/projects');
  }
  ngOnInit() {
    this.projectDataSubscription = this.angularFire.list('/projects').valueChanges().subscribe(
      projectData => {
        this.projectData = projectData;
        console.log(this.projectData);
      });
  }


 
}

