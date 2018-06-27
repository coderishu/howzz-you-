import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { _throw } from 'rxjs/observable/throw';
import { filter, map, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class StoreSetting {
    apiSettingsData:BehaviorSubject<any>;
     constructor(){
 this.apiSettingsData = new BehaviorSubject<any>(this.apiSettingsData);
    }
 change(apiSetting:any) {
    this.apiSettingsData.next(apiSetting);
  }

}