
import { Component, SimpleChange, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../provider/http-service';
import { appConstant } from '../../constant/app.constant';
import { LanguageTranslateInfoService } from '../../provider/app.changeLang';
import { UrlBreadCrumbService } from '../../provider/app.urlbreadcrum';
import { StoreSetting } from '../../provider/app.store-setting';
import { GlobalData } from '../../provider/app.global';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { CurrencyConvertService } from '../../provider/currencyconvert';
import { NgProgress } from 'ngx-progressbar';
import { FlashMessagesService } from 'ngx-flash-messages';
import { Meta, Title } from '@angular/platform-browser';

declare var $: any;
@Component({
    selector: 'ng-view',
    templateUrl: './detail.html'
})
export class Detail {
    httpService: HttpService
    baseUrl: string = appConstant['baseUrl'];
    readMoreLength: number = 10;
    currentLanguageData: any;
    productDetail: any = {};
    productId: string = "";
    cartData:Array<any>=[];
    breadCrumData: any = {};
    storeSettings: any;
    isRtl: boolean = false;
    conditionAttribute: any;
    slug: string = '';
    soldByAttribute: any;
    soldBy: string = appConstant['soldBy'];
    conditionBy: string = appConstant['condition'];
    pinNo: number;
    isPinSubmit: boolean = false;
    isProductAvailable: boolean = false;
    productAvailableMessage: string;
    pinCodeData: any;
    ratingReviewData: any = {};
    gotocart:boolean=false;
    isWishList: boolean = false;
    variantAttributeData: any = {}
    queryParams: any;
    queryFilterParams: any;
    productUrl: Array<any> = [];
    userWishlistData: Array<any> = [];
    isSubmitForCart: boolean = false;
    addToBagShow: boolean = true;
    currencyJSON: object;
    isEnableSimilarProduct: boolean = false;
    color: string = appConstant['color'];
    queryParamsData: string;
    productSku: string;
    isCustumerReviewEnable: boolean = false;
    noReview: boolean = false;
    typeofAddToCartfromDetail = appConstant['typeofAddToCartfromDetail'];
    userDetail: any;
    isZoom: boolean = false;
    isLoadingFirst: boolean = true;
    showShareCount: boolean = true;
    sharingUrl: string = '';
    sharingText: string = '';
    sharingTitle: string = '';
    selectedQuantity:number = 1 ;
    selectedSection:any = 'specification';
    totalQuantity:any;
    productQuantityArr:any = new Array();
    isReadeMore:boolean = true;
    productDesReadMoreLength = 147;

    socialSharingUrls: Object = {
        "facebook": "http://www.facebook.com/sharer.php?u=" + this.sharingUrl,
        "twitter": "https://twitter.com/share?url=" + this.sharingUrl + "&text=" + this.sharingText + "&via=[via]&hashtags=[hashtags]",
        "google": "https://plus.google.com/share?url=" + this.sharingUrl

    }

    constructor(private meta: Meta, private flashMessagesService: FlashMessagesService, public ngProgress: NgProgress, private currencyconvertservice: CurrencyConvertService, public globalDataService: GlobalData, private storeSettingOb: StoreSetting, private breadCrumService: UrlBreadCrumbService, private activateRoute: ActivatedRoute, private router: Router, httpService: HttpService, private languageTranslateService: LanguageTranslateInfoService) {
        if(this.globalDataService.isBrowser)
        this.addAnimationOnPage();

        this.router = router;
        this.httpService = httpService;

              if(this.globalDataService.isBrowser){
                  this.pinNo = parseInt(localStorage.getItem("pinNo")) ? parseInt(localStorage.getItem("pinNo")) : undefined;
                  this.userDetail = JSON.parse(localStorage.getItem('userLoginDetail')) ? JSON.parse(localStorage.getItem('userLoginDetail')) : null;
                if (localStorage.getItem("userWishList")) {
            this.userWishlistData = JSON.parse(localStorage.getItem("userWishList"));

        }
              }
        

        /****** get Query Params *****/
        this.activateRoute.queryParams
            .subscribe(params => {
                this.queryParams = params;

                this.queryFilterParams = {};
                Object.keys(this.queryParams).map((key) => {
                    if (key != 'ass' && key != 'id' && key != 'sku')
                        this.queryFilterParams[key] = this.queryParams[key];
                });
                //console.log(JSON.stringify(params));
                //this.loadProductDetail(this.queryFilterParams);

            });

        /************getting route params****************** */
        this.activateRoute.params.subscribe((param) => {
            this.productId = param['productId'];
            this.queryParamsData = param['productData'];
            this.queryParams = this.queryParamsData == appConstant['productDetail']['associate'] ? {} : this.breadCrumService.encodeStringUrlToQueryParams(param['productData']);
            this.productSku = param['sku'];
            if (Object.keys(this.queryParams).length > 0)
                this.queryParams['sku'] = this.productSku;
            this.queryFilterParams = this.queryParams;



            if (this.currentLanguageData) {
                this.loadProductDetail(this.queryFilterParams);
            }
            setTimeout(() => {
                //console.log(JSON.stringify(this.queryParams))
                //if(this.isLoadingFirst)
                this.breadCrumService.getBreadCrumbCategoryFromServer(this.queryParams['osku'] ? this.queryParams['osku'] : this.productSku);
                //this.isLoadingFirst = false;
            }, 1000);
        });
        languageTranslateService.translateInfo.subscribe((data) => {
            //console.log("fff="+JSON.stringify(data))
            if (data) {
                this.currentLanguageData = data;
                this.getCartData();
                // this.saveRecentView();
                // this.enableSimilarProduct("event");
                if (this.currentLanguageData['lng_code'] == appConstant['rtl']) {
                    this.isRtl = true;
                }
                else
                    this.isRtl = false;
                this.loadProductDetail(this.queryFilterParams);
            }
        });


        /****** for store Setting *****/
        storeSettingOb.apiSettingsData.subscribe((data) => {
            //console.log("fff="+JSON.stringify(data))
            if (data) {

                this.storeSettings = data;
                this.storeSettings['STORE']['breadcrum']['catalog'] == "1" ? this.breadCrumService.toggleBreadCrumb(true) : this.breadCrumService.toggleBreadCrumb(false);

                // console.log("this.currentLanguage=="+this.currentLanguage)
            }
        });

        /******** for breadcrum *******/
        breadCrumService.breadcrumbInfo.subscribe((data) => {
            // console.log("fff="+JSON.stringify(data))
            if (data) {
                this.breadCrumData = data;
            }

        });
        //setTimeout($(".select-dropdwn").selectBoxIt({ }),1000);
   
       
    }

   ngOnInit(){
   
   }
    addAnimationOnPage() {
        let opacity = 0;
        let interval;
        interval = setInterval(() => {
            if (opacity >= 1) {
                clearInterval(interval);
            }
            else{
                 opacity += opacity + .1;
            $(".content").css("opacity", opacity);
            }
           
        }, 200);
    }


    specification(section) {

        $('html ,body').animate({

            scrollTop: $("#" + section).offset().top
        }, 1000);

    }
    isProductAvailableInWishList() {
        this.isWishList = false;
        for (let i = 0; i < this.userWishlistData.length; i++) {
            if (this.productId == this.userWishlistData[i]['product_id']) {
                this.isWishList = true;
            }
        }
    }
    hideErrorMessage(){
        
      if(!this.pinNo){
          this.productAvailableMessage = '';
          this.isPinSubmit = false;
      }
       
    }
    preventParent(event){
        event.stopPropagation();
    }
    checkPincode(status: boolean) {
        //alert();
        
        this.isPinSubmit = true;
        if (!status)
            return
        let url = this.baseUrl + "front/webservice/check_zip_code";

        let productId = this.productDetail['brand_data']['_id'];
        let browser_id;
        if(this.globalDataService.isBrowser)
        browser_id = Cookie.get('browser_id');
        let vender_id = this.productDetail['brand_data']['vendor_id'];
        let data = { "product_id": productId, "vendor_id": vender_id, "browser_id": browser_id, "zipcode": this.pinNo, "lang_id": this.currentLanguageData['id'], "lang": this.currentLanguageData['lng_code'] }
        this.httpService.createPostRequest(url, data).subscribe((response: any) => {
            this.productAvailableMessage = response['msg'];
            this.isProductAvailable = response['status'];
            if (response['status'] == true) {
                if(this.globalDataService.isBrowser)
                localStorage.setItem("pinNo", this.pinNo.toString());
                this.pinCodeData = response['msg'];
            }
            else
                this.addToBagShow = false;
        });

    }
    

    changeAttributeVal(productItem: any) {
      this.productDetail = productItem['productDetail'];
      let productId = productItem['variantItem']['id'];
        
        if (productItem['variantItem']['isAvail']) {
           
            let detailUrl = this.breadCrumService.getUrl(this.productDetail['brand_data'], productItem['variantItem']);
            //alert(detailUrl);
            this.router.navigate(detailUrl);
        }

    }


    getCustumAttributeViewData(data, status) {
        if (status || (data.length < this.readMoreLength)) {
            return data;
        }

        else
            if (data.length > this.readMoreLength) {
                return data.slice(0, this.readMoreLength);
            }


    }

    loadProductDetail(variantData: any) {
        this.isZoom = false;
        this.isEnableSimilarProduct = false;
        this.ngProgress.start();
        

        let url = this.baseUrl + "front/webservice/productDetails";
      
        let data = { "id": this.queryParams['id'] ? this.productSku : '', "sku": this.productSku, "main_sku": this.queryParams['osku'], "associate": this.queryParams['ass'] ? this.productSku : {}, "varient_data": variantData, "lang_id": this.currentLanguageData['id'], "lang": this.currentLanguageData['lng_code'] };
        this.httpService.createPostRequest(url, data).subscribe((response: any) => {
            
            this.ngProgress.done();
            if (response['status']) {

                let metaImage_path = response.original_path;
                let metaImage = response.brand_data.default_image;
                let productTagInfo = response.brand_data.translation_data[0];
                if(this.globalDataService.isBrowser)
                this.sharingUrl = location.href;
                this.sharingText = productTagInfo.page_title;
                this.sharingTitle = productTagInfo.page_title;
                // SETTING META TAGS *******************************
                this.meta.updateTag({ name: "title", content: productTagInfo.page_title ? productTagInfo.page_title : productTagInfo.name });
                this.meta.updateTag({ name: "keywords", content: productTagInfo.meta_key ? productTagInfo.meta_key : productTagInfo.name });
                this.meta.updateTag({ name: "description", content: productTagInfo.meta_desc ? productTagInfo.meta_desc : productTagInfo.short_description.replace(/(<([^>]+)>)/ig, "") });
                this.meta.updateTag({ name: "og:title", content: productTagInfo.page_title ? productTagInfo.page_title : productTagInfo.name });
                this.meta.updateTag({ name: "og:image", content: metaImage ? metaImage_path + metaImage : '' });
                this.meta.updateTag({ name: "og:description", content: productTagInfo.meta_desc ? productTagInfo.meta_desc : productTagInfo.short_description.replace(/(<([^>]+)>)/ig, "") });
                this.meta.updateTag({ name: "twitter:title", content: productTagInfo.page_title ? productTagInfo.page_title : productTagInfo.name });
                this.meta.updateTag({ name: "twitter:description", content: productTagInfo.meta_desc ? productTagInfo.meta_desc : productTagInfo.short_description.replace(/(<([^>]+)>)/ig, "") });
                this.meta.updateTag({ name: "twitter:image", content: metaImage ? metaImage_path + metaImage : '' });
                //************************************************* */
                this.isZoom = true;
                this.isEnableSimilarProduct = true;

                this.productDetail = response;
                if(this.productDesReadMoreLength >= (this.productDetail['brand_data']['translation_data'][0]['description']?this.productDetail['brand_data']['translation_data'][0]['description']:this.productDetail['brand_data']['name']['description']).length){
                    this.isReadeMore = false;

                }
                this.totalQuantity = appConstant.quantityRange <= this.productDetail['brand_data']['quantity']?appConstant.quantityRange:this.productDetail['brand_data']['quantity'];
                for(let q = 1 ; q<=this.totalQuantity ; q++){
                    this.productQuantityArr.push(q);
                }
                let selectQuantity;
                setTimeout(()=>{
               selectQuantity = $(".select-drop").selectBoxIt({ });
                selectQuantity.on("change",(event)=>{
                    this.selectedQuantity =  $(event.target).val();
                   //  console.log($(event.target).val());
                })
                },200);
                
                /******* check pincode is exist product is available or not ****/

                if(this.globalDataService.isBrowser){
                  if(this.pinNo)
                  this.checkPincode(true);
                }

              //  console.log(JSON.stringify(this.productQuantityArr));
                this.productDetail['brand_data']['custom_attribute'].map((data) => {
                    
                    for (let i = 0; i < data['group_data'].length; i++) {
                        if (data['group_data'][i]['attribute_code'] == this.conditionBy)
                            this.conditionAttribute = data;
                        if (data['group_data'][i]['attribute_code'] == this.soldBy)
                            this.soldByAttribute = data['group_data'][i];
                    }

                });

                this.isCustumerReviewEnable = true;
                this.productId = this.productDetail['brand_data']['_id'];
                this.productIsExistInCart();
                this.saveRecentView(this.productDetail);
                if (this.userWishlistData.length > 0)
                    this.isProductAvailableInWishList();
            }

           
        });

    }
   
    
    openSharePopup(element) {
        let sharingUrl;
        if (element == 'facebook')
            sharingUrl = "http://www.facebook.com/sharer.php?u=" + this.sharingUrl;
        else if (element == 'twitter')
            sharingUrl = "https://twitter.com/share?url=" + this.sharingUrl + "&text=" + this.sharingText;
        else if (element == 'google')
            sharingUrl = "https://plus.google.com/share?url=" + this.sharingUrl

        window.open(sharingUrl);
        
    }
     openSharePopUp(){
       $(".overlay.model-share").css("display","block");
   }
    print() {
        window.print();
    }
    getRatingReview(reviewData: any) {
        
        if (Object.keys(reviewData).length === 0 && reviewData.constructor === Object)
            this.noReview = true;
        else {
            this.noReview = false;
            this.ratingReviewData = reviewData;
           }
      }

    ngAfterViewInit() {
     //   $(".select-dropdwn").selectBoxIt({ });
    }
     

    //Function to add a product in to cart*****************************
    addInToCart(productDetail: Object, status) {
        //alert(1111);
        let Url_data: any = {};
        let data: any = {};
        let variantData = [];

        Object.keys(this.queryParams).map((variantItem: any) => {
            let item = {};
            if (variantItem != 'main_product_id' && variantItem != 'sku' && variantItem != 'id' && variantItem != 'ind' && variantItem != 'isAvail' && variantItem != 'ass') {
                item = { "key": variantItem, "value": this.queryParams[variantItem] };
                variantData.push(item);
            }

        });
        Url_data['urlData'] = this.breadCrumService.getUrl(productDetail['brand_data'], this.queryParams);
        Url_data['queryParams'] = this.queryParams;
        Url_data['associate_data'] = variantData;
        data['urlData'] = Url_data;
        //console.log(data['urlData']);
        data['productId'] = productDetail['brand_data']['_id'];
        data['sku'] = productDetail['brand_data']['sku'];
        data['vendorId'] = productDetail['brand_data']['vendor_id'];
        if (!status)
            this.addToCart(data, false);
        else return data;

    }
    //Function to call API for ADD to cart*******************************
    addToCart(productDetail: Object, status) {


        let selectedProductStatus = true;
        let associateProductData = [];
        //let associateItem = {};
        for (let i = 0; i < this.productDetail['brand_data']['default_attr'].length; i++) {
            let defaultItem = this.productDetail['brand_data']['default_attr'][i];
            associateProductData.push({ "key": defaultItem['attribute_code'], "value": defaultItem['attribute_val'] })
            for (let j = 0; j < defaultItem['value'].length; j++) {
                let optionItem = defaultItem['value'][j];
                if (defaultItem['attribute_val'] == "") {
                    this.isSubmitForCart = true;
                    selectedProductStatus = false;
                    break;
                }

                else if ((defaultItem['attribute_val'] == optionItem['code']) && (optionItem['isAvail'] == false)) {
                    defaultItem['attribute_val'] = '';
                    this.isSubmitForCart = true;
                    selectedProductStatus = false;
                    break;

                }
            }
            if (selectedProductStatus == false)
                break;
        }

        if (selectedProductStatus == false)
            return false;
        this.isSubmitForCart = false;

        let url = this.baseUrl + "front/basket/add_to_cart";

        let browser_id; 
        if(this.globalDataService.isBrowser)
        browser_id = Cookie.get('browser_id')
        let userId = null;
        let currencyId = this.currencyconvertservice.currentCurrencyData['id'];
        //  alert(JSON.stringify(this.userDetail)); 
        if (this.userDetail)
            userId = this.userDetail['id'];

        //let vender_id = "59afabb8883c44263161f2ee";
        productDetail['urlData']['associate_data'] = associateProductData;
        // localStorage.setItem("purchaseType",this.typeofAddToCartfromDetail);

        let data = { "user_id": userId, "type": this.typeofAddToCartfromDetail, "associate": this.productDetail['brand_data']['associate'], "product_id": productDetail['productId'], "sku": this.productSku, "quantity": this.selectedQuantity, "vendor_id": productDetail['vendorId'], "pin_no": this.pinNo, "session_id": browser_id, "shipping_id": "", "currency_id": currencyId, "lang_id": this.currentLanguageData['id'], "lang": this.currentLanguageData['lng_code'], urldata: productDetail['urlData'] };
        // console.log(JSON.stringify(data));
        if (!status) {
            this.httpService.createPostRequest(url, data).subscribe((response: any) => {

                this.productAvailableMessage = response['msg'];
                this.isProductAvailable = response['status'];
                if (response['status']) {
                    ///alert();
                    this.flashMessagesService.show(response['msg'], {
                        classes: ['alert', 'alert-success'], // You can pass as many classes as you need
                        timeout: 1000, // Default is 3000
                    });
                    setTimeout(() => { this.router.navigate(["/cart"]) }, 1000);
                }
                else 
                {
                    this.flashMessagesService.show(response['msg'], {
                        classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
                        timeout: 1000, // Default is 3000
                    });
                }

            });
        }
        else return data;
    }
    //Function to save recent product detail *********************************

    getCartData(){//page_num:number
        //this.ngProgress.start();
         let URL =  appConstant.baseUrl+'front/basket/get_basket_data';
         let browser_id;
         if(this.globalDataService.isBrowser)
         browser_id = Cookie.get('browser_id');
         let userId = this.userDetail?this.userDetail['id']:null; 
         let data = {"lang_id":this.currentLanguageData['id'],"session_id":browser_id,"user_id":userId,"lang":this.currentLanguageData['lng_code']};
        //  let encrypt_data = this.encryptionservice.encrypt_data(data);
    
          this.httpService.createPostRequest(URL,data).subscribe(response=>{
              this.cartData = response['data']['cart_data'];
              this.productIsExistInCart();
          });
         
       }

    productIsExistInCart(){
        let status = false;
        this.cartData.map((item)=>{
          if(this.productId == item['product_id'])
                status = true;
        });
        this.gotocart=status;
    }


    saveRecentView(productInfo: any) {
        let urlData = this.addToCart(this.addInToCart(productInfo, true), true);
        let url = this.baseUrl + "front/productslide/save_recent_view_product";
        let productId = this.productId;
        let browser_id;
        if(this.globalDataService.isBrowser)
        browser_id = Cookie.get('browser_id');
        let sku = this.productSku;
        let userId = this.userDetail ? this.userDetail['id'] : null;
        //let vender_id = this.productDetail['brand_data']['vendor_id'];
        let data = { "user_id": userId, "product_id": productId, "sku": sku, "session_id": browser_id, "lang_id": this.currentLanguageData['id'], "lang": this.currentLanguageData['lng_code'], urldata: urlData['urldata'] }
        this.httpService.createPostRequest(url, data).subscribe((response: any) => {

            if (response['status'] == true) {

            }

        });

    }
    //Function to add product to wishlist***********************************
    addToWishList(productItem: Object) {
        if (this.userDetail) {
            let userId = this.userDetail['id'];
            let sku = productItem['brand_data']['sku'];
            let productId = productItem['brand_data']['_id'];

            let urlData = this.addToCart(this.addInToCart(productItem, true), true);
            let URL = this.baseUrl + "front/order/add_to_wish_list";
            let data = { "lang_id": this.currentLanguageData['id'], "lang": this.currentLanguageData['lng_code'], sku: sku, product_id: productId, user_id: userId, urldata: urlData['urldata'] };
          
            this.httpService.createPostRequest(URL, data).subscribe(response => {
                if (response.status) {
                    this.userWishlistData = response['wishlist_detail'];
                    this.globalDataService.addToWishListInLocalStorage(this.userWishlistData);
                    //localStorage.setItem("userWishList", JSON.stringify(this.userWishlistData));
                    // this.isWishList=true;
                    // alert(response['msg']);
                    this.flashMessagesService.show(response['msg'], {
                        classes: ['alert', 'alert-success'],
                        timeout: 1000, // Default is 3000
                    });
                    //this.globalData.showToaster({type:"success",body:response['msg']});
                    this.isWishList = true;
                }
                else {
                    this.flashMessagesService.show(response['msg'], {
                        classes: ['alert', 'alert-warning'],
                        timeout: 1000, // Default is 3000
                    });
                    //  this.globalData.showToaster({type:"error",body:response['msg']});
                }
            });


        }
        else {
            // alert('Please login');
            
            $("#login").show("slow");
        }

    }
    removeFromWishList(event, sku, productId) {
        event.stopPropagation();
        let userDetail = JSON.parse(localStorage.getItem('userLoginDetail'));
        let URL = this.baseUrl + 'front/order/remove_to_wish_list';
        let data = { lang_id: this.currentLanguageData['id'], lang: this.currentLanguageData['lng_code'], slug: this.slug, sku: sku, product_id: productId, user_id: userDetail.id };
        this.httpService.createPostRequest(URL, data).subscribe(response => {
            if (response.status) {
                this.flashMessagesService.show(response['msg'], {
                    classes: ['alert', 'alert-success'],
                    timeout: 1000
                });
                this.globalDataService.addToWishListInLocalStorage(response['wishlist_detail']);
                this.userWishlistData = response['wishlist_detail'];
                this.isWishList = false;
            }
            else {

                this.flashMessagesService.show(response['msg'], {
                    classes: ['alert', 'alert-danger'],
                    timeout: 1000
                });
            }
        });
    }

// Function to show product detail section wise **************
    ProductExplanation(section){
     this.selectedSection = section;
    //alert(this.selectedSection);
    }

// Function to save product quantity**************************
    saveQuantity(event){
     this.selectedQuantity = event.target.value;
    }

    rateProduct(productId){
       // alert("you are logged In!!");
     if(!localStorage.getItem('userLoginDetail'))
        this.router.navigate(['/login']);
        else{
        let userDetail = JSON.parse(localStorage.getItem('userLoginDetail'));
         let URL =  this.baseUrl+'front/review/check_review_product';
          let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],product_id:productId,user_id:userDetail.id};
          this.httpService.createPostRequest(URL,data).subscribe(response=>{
             if(response.status){
              this.router.navigate(['/account/ratings',productId]);
               }
               else{
                this.flashMessagesService.show(response['msg'], {
                    classes: ['alert', 'alert-danger'], 
                    timeout: 1000
                });
               }
            });
         }
       }
        readeMore(){
     this.isReadeMore = !this.isReadeMore;
 }

}
