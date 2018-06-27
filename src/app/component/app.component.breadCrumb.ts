import{Component,OnInit,Input,SimpleChange,Output,EventEmitter,ChangeDetectorRef } from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {appConstant} from '../constant/app.constant';
import {HttpService} from '../provider/http-service';
import {UrlBreadCrumbService } from '../provider/app.urlbreadcrum';

//import {DataService} from '../../services/http-service';

declare var $:any;   

@Component({
    selector:'bread-crumb',
    template:`
	<div class = "container">
	<ul class = "breadcrumb product-breadcrumb">
	<li><a href = "javascript:void(0)" [routerLink] = "['/']"><i class="fa fa-home"></i> </a></li>
    <li *ngFor = "let item of menuItem;let itemIndex = index;let last = last" [class.active] = "last"><a [routerLink] = "item.link" href = "javascript:void(0)">{{item.name}} </a></li>
</ul>
</div>`,
     //providers: [DataService]
}) 
export class BreadCrumbs implements OnInit{

     @Input('breadCrumbMenuData') menuItem:Array<any> = [];

    constructor(private cdRef:ChangeDetectorRef,private urlBreadCrumbService:UrlBreadCrumbService,private router:Router,private httpService:HttpService)
    {
        this.router=router;
    }
    showProductList(index)
    {
            let urldata = [];
            let urlItem = {};
            for(let i =0;i<index+1;i++){
               i == 0?urldata.push("/"+this.menuItem[i]['slug'].replace(/\(|\) |\s/g, "").toLowerCase()):urldata.push(this.menuItem[i]['slug'].replace(/\(|\) |\s/g, "").toLowerCase());

            }
               return urldata;
    }

    ngOnChanges(change:{[breadCrumbMenuData:string]:SimpleChange} ){
       // alert(this.menuItem.length)
     // console.log("menuItem=="+JSON.stringify(this.menuItem))

      //if(this.menuItem.length>0)

      this.createUrl();


}

createUrl()
{
    for(let i = 0;i<this.menuItem.length-1;i++){
            if(this.menuItem[i]['slug'])
            {
                this.menuItem[i]['link'] = this.showProductList(i);
            }

    }

}



ngOnInit()
    {

    }

    ngAfterViewChecked(){
    //     this.createUrl();
        this.cdRef.detectChanges();

       }
}
