import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/map'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';


@Injectable()
export class LanguageTranslateInfoService {
    translateInfo:BehaviorSubject<any>;
   constructor(){
 this.translateInfo = new BehaviorSubject<any>(this.translateInfo);
    }
 change(translateData:any) {
    this.translateInfo.next(translateData);
  }

//   subscribe(type: string, callback: MessageCallback): Subscription {
//     return this.handler
//       .filter(message => message.type === type)
//       .map(message => message.payload)
//       .subscribe(callback);
//   }
}