import { Component } from '@angular/core';

import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  position: [number, number] = [0, 0];
  geolocation:Geolocation = new Geolocation();
  locations:LocationEntry[];

  nextId:number = 0;

  constructor() {
    this.getPosition();
    this.readEntries();

  }

  getPosition(){
    this.geolocation.getCurrentPosition({ timeout: 1000, enableHighAccuracy: true, maximumAge: 3600 })
      .then((res: Geoposition) => {
        this.position = [
            this.roundNum(res.coords.latitude),
            this.roundNum(res.coords.longitude)
          ];
      });
  }

  roundNum(num){
    let dec = 6;
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
  }

  addLocation(){
    console.log('--ADD LOC');
    const dt = this.getDateTime();
    const newLoc = new LocationEntry(this.nextId, this.position[0], this.position[1], dt.date, dt.time);
    
    //console.log(newLoc)
    this.storeObject(this.nextId, newLoc);
  }

  async storeObject(key: number, value: any){
    await Storage.set({
      key: JSON.stringify(key),
      value: JSON.stringify(value)
    });

    //console.log('store. id',this.nextId)

    this.nextId++;

    this.readEntries();
  }

  getDateTime(){
    let d: Date = new Date();
    let time: string = `${d.getHours()}:${d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()}`;
    let date: string = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

    return {date, time};
  }

  // pull some data from storage. read all the entries from storage
  async readEntries() {
    //clear the locations array
    this.locations = [];
    //get all the keys
    const { keys } = await Storage.keys();

    keys.sort((a:string,b:string)=> parseInt(a)-parseInt(b));
    //console.log(keys)
    if(keys.length > 0) this.nextId = parseInt(keys[keys.length-1]) +1;

    keys.forEach(this.getEntry, this);
  }

  async getEntry(key:any) {
    //get keys one by one and pull information from the storage
    const item = await Storage.get({ key: key });
    let location = JSON.parse(item.value);
    console.log('read entries. key', key, 'entry', location)
    this.locations.push(location);
  }

  async deleteEntry(index:number){
    
    await Storage.remove({ key: index.toString() });
    console.log('delete',index)

    this.readEntries();
  }


}

export class LocationEntry {
  id: number;
  lat: number;
  long: number;
  date: string;
  time: string

  constructor(id:number, lat:number, long:number, date:string, time:string){
    this.id = id;
    this.lat = lat;
    this.long = long
    this.date = date;
    this.time = time;
  }
}
