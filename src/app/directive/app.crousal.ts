import {Directive,ElementRef,Input,OnChanges,Output,SimpleChange,EventEmitter} from '@angular/core';
//import '../../assets/js/owl.carousel.js';

//import { MessageService } from '../../provider/app.changeLang'
declare var $:any;


@Directive({selector:'[crousal]'})
export class Crousal {
  element:ElementRef;
	@Input("isRtl") isRtl:boolean;
	@Input('productData') productData:Array<any> = [];
	@Input('storeSetting') storeSetting:any;
	@Output('addMoreProduct') addMoreProduct = new EventEmitter();
  constructor(element:ElementRef){
		//   messageService.viewBugList.subscribe((payload) => {
    //   console.log("ffffffffff from header");
    // });
		//console.log(this.isRtl)
    this.element = element;
  }
	ngOnChanges(change:{[isRtl:string]:SimpleChange}){
	//	console.log("change=="+JSON.stringify(change));
		//if($(this.element.nativeElement).data('owlCarousel'))
		// $(this.element.nativeElement).trigger('destroy.owl.carousel');
		// this.createSlider();	

		if(this.productData.length> 0){
			
				setTimeout(()=>{
					this.createSlider();
				},1000)
				
		}
	}
  ngAfterViewInit(){
    //console.log($(this.element.nativeElement).attr("id"))
   setTimeout(()=>{
		 this.createSlider();
	 },3000); 
  }
	createSlider(){
$(this.element.nativeElement).owlCarousel({

		rtl : false,
		nav : true,
		loop : false,
		autoplay:true,
		slideBy:4,
		responsive : {
			0 : {
				items : 1
			},
			480 : {
				items : 2
			},
			768 : {
				items : 4
			}
		}

	});
	$(this.element.nativeElement).find(".owl-next").on("click",()=>{
	
		this.addMoreProduct.emit({});
		
	})
	}
}