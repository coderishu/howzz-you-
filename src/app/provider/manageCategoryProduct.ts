   import { Injectable } from '@angular/core';
  import { BehaviorSubject,Subject } from 'rxjs';
  import { _throw } from 'rxjs/observable/throw';
import { filter, map, catchError } from 'rxjs/operators';

@Injectable()
export class manageCategoryProductService 
{
  URLInfo:BehaviorSubject<any>;
 constructor( )
 {
  this.URLInfo = new BehaviorSubject<any>(this.URLInfo);
 }
 change(URLData:any) {
  this.URLInfo.next(URLData);
}

}