import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import {Router} from '@angular/router';
import {StoreSetting} from '../provider/app.store-setting';

@Injectable()
export class PageAuthorizedRouteGaurd implements CanActivate {
// router:Router;
storeSettings:any;
isEnableRecentReview:any;
constructor(private router:Router,private storeSettingOb:StoreSetting) {
  this.router = router;
  //this.storeSettingOb = storeSettingOb;
    storeSettingOb.apiSettingsData.subscribe((data) => {
    if(data)
    {
       this.storeSettings = data;
      this.isEnableRecentReview = this.storeSettings['STORE']['recent_view']['enable'];
     //alert("this.isEnableRecentReview"+this.isEnableRecentReview);
     
    }
});
}

canActivate() {
 // alert("canActivate."+this.isEnableRecentReview);
  if(this.isEnableRecentReview == "1")
  return true;
  else{
    this.router.navigate(['']);
    return false;
  }
  

  
 
}
}