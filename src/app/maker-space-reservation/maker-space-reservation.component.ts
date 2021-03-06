import { Component, OnInit, NgZone  } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { Subscription } from 'rxjs/Subscription';
import { NgForm } from '@angular/forms';
import { searchForReservation } from '../models/searchForReservation';
import { MakerspaceReservable } from '../models/makerspace-reservable';
import { MakerspaceSpace } from '../models/makerspace-space';
import { DataService } from '../data.service';

import { MakerspaceReservation } from '../models/makerspace-reservation';
import { MakerspaceUser } from '../models/makerspace-user';


@Component({
  selector: 'app-maker-space-resevation',
  templateUrl: './maker-space-reservation.component.html',
  styleUrls: ['./maker-space-reservation.component.css']
})
export class MakerSpaceReservationComponent implements OnInit {
  SpaceSubscription: Subscription;
  space1: any;
  space2: any;
  space3: any;
  space4: any;

  public firebase;
  selected: any[];
  availableList: MakerspaceSpace[]=[]; // if it's a class member

   count: number =0;
  countSpace1: number =0;
  countSpace2: number =0;
  countSpace3: number =0;
  countSpace4: number =0;
  noRooms: string;
  method: any;
  availableRooms: MakerspaceSpace[];
  reservation: any;
  available: any;
  reservedSpace: any; reservedLocation: any; reservedDate: any; reservedTime: any; reservedDuration: any; reservedCapacity: any;
  private promise: Promise<boolean>;
  confirmReservation: any; confirmed: any;
  time: string;

  currentDate: any;
  currentTime: string;
  chooseCorrectDate: any;
  chooseCorrectTime: any;
  searchForReservation: searchForReservation = new searchForReservation();
  reserve: MakerspaceReservable = new MakerspaceReservable();

  MakerspaceReservation: MakerspaceReservation ;

  userSub: Subscription;
  currentUser: firebase.User;

  constructor(private angularFire: AngularFireDatabase, private zone: NgZone, private afStorage: AngularFireStorage, private ds: DataService) {

    this.firebase = this.angularFire.list('/Spaces');
  }
  ngOnInit() {

  
    this.SpaceSubscription = this.angularFire.list('/Reservation/Space1').valueChanges().subscribe(
      space1 => {
        this.space1 = space1;
      });

    this.userSub = this.ds.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  async asyncAwait(f: NgForm) {
    console.log(this.searchForReservation);
    var a = this;


   return new Promise(function (resolve, reject) {

      console.log(a.searchForReservation);
      a.firebase = a.angularFire.list('/Reservation');
      a.time = a.searchForReservation.hour + ":" + a.searchForReservation.min + " PM";



      a.SpaceSubscription = a.angularFire.list('/Reservation/Space1/').valueChanges().subscribe(
        space1 => space1.forEach(item => {
          a.space1 = item;
          if (a.searchForReservation.date == a.space1.date && a.time == a.space1.time) {
            a.count += 1;
            a.countSpace1 += 1;
            console.log(a.count);
            console.log(a.countSpace1);

          }

        }));




      a.SpaceSubscription = a.angularFire.list('/Reservation/Space2/').valueChanges().subscribe(
        space2 => space2.forEach(item => {
          a.space2 = item;
          if (a.searchForReservation.date == a.space2.date && a.time == a.space2.time) {
            a.count += 1;
            a.countSpace2 += 1;
          }

        }));




      a.SpaceSubscription = a.angularFire.list('/Reservation/Space3/').valueChanges().subscribe(
        space3 => space3.forEach(item => {
          a.space3 = item;
          if (a.searchForReservation.date == a.space3.date && a.time == a.space3.time) {
            a.count += 1;
            a.countSpace3 += 1;

          }

        }));
    

  
      a.SpaceSubscription = a.angularFire.list('/Reservation/Space4/').valueChanges().subscribe(
        space4 => space4.forEach(item => {
          a.space4 = item;
          if (a.searchForReservation.date == a.space4.date && a.time == a.space4.time) {
            a.count += 1;
            a.countSpace4 += 1;
          }
          resolve(true);

        }));


     });

    
  }


  async onSubmit(f: NgForm) {
    console.log("print me");
    console.log(this.searchForReservation);
    var dt = new Date();

    this.currentTime = new Date().toLocaleTimeString().substring(0, 4);
    var offset = -300; //Timezone offset for EST in minutes.
    this.currentDate = new Date(dt.getTime() + offset * 60 * 1000).toJSON().substring(0, 10);
    console.log(this.currentDate);
    console.log(this.currentTime);
    console.log(this.searchForReservation.date);

    if (this.currentDate > this.searchForReservation.date) {
      this.chooseCorrectDate = true;
      console.log(this.chooseCorrectDate);
    }
    else if (this.currentDate == this.searchForReservation.date) {
      if (this.currentTime > (this.searchForReservation.hour + ":" + this.searchForReservation.min)) {
        this.chooseCorrectTime = true;
        console.log(this.chooseCorrectTime);
      }
      else
        this.run(f);
    }
    else {
      this.run(f);
    }
  }
  async run(f: NgForm) {
      await this.asyncAwait(f);
        if (this.countSpace1 == 1) { console.log("no room in space1"); }
        else
          this.availableList.push(new MakerspaceSpace("Space1", 4, "Woodward 334", this.time, this.searchForReservation.date));

        if (this.countSpace2 == 1) { console.log("no room in space2"); }

        else
          this.availableList.push(new MakerspaceSpace("Space2", 5, "Woodward 334", this.time, this.searchForReservation.date));

        if (this.countSpace3 == 1) {
          console.log("no room in space3");
        }
        else
          this.availableList.push(new MakerspaceSpace("Space3", 2, "Woodward 334", this.time, this.searchForReservation.date));


        if (this.countSpace4 == 1) {
          console.log("no room in space4");
        }
        else
          this.availableList.push(new MakerspaceSpace("Space4", 3, "Woodward 334", this.time, this.searchForReservation.date));



        console.log(this.count);
        if (this.count == 4) {
          this.noRooms = "no rooms are available at this time";
        }
        else {

          this.availableList = this.availableList.filter((elem, index, self) => self.findIndex(
            (t) => { return (t.space === elem.space && t.location === elem.location && t.capacity === elem.capacity && t.time === elem.time && t.date === elem.date) }) === index)
          this.availableRooms = this.availableList;


          console.log(this.availableList);

        }
      }

  onCloseAlert() {

    this.zone.runOutsideAngular(() => {
      location.reload();
    });
  }
  

  onSubmitReserve(f2: NgForm) {
    console.log(this.reserve);
    this.reservedSpace = document.getElementById("space");

    this.reservedLocation = document.getElementById("location");
    console.log(this.reservedLocation);

    this.reservedCapacity = document.getElementById("capacity");
    console.log(this.reservedCapacity.value);

    this.reservedDuration = document.getElementById("duration");
    this.reservedDate = document.getElementById("date");
    this.reservedTime = document.getElementById("time");
    this.MakerspaceReservation = new MakerspaceReservation(this.reservedSpace.value, this.reservedLocation.value, this.reservedCapacity.value, this.reservedDate.value, this.reservedTime.value, this.reservedDuration.value, this.currentUser.uid);
    console.log(this.MakerspaceReservation);

    this.firebase = this.angularFire.list('/Reservation/' + this.reservedSpace.value);
    this.confirmReservation = this.firebase.push(this.MakerspaceReservation);
    if (this.confirmReservation) {
      this.confirmed = true;
     
    }

  }
 
}

