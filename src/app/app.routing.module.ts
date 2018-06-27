import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import {StripeCheckoutModule} from 'ng-stripe-checkout';
import { SharedModule } from './app.shared.module';
import {UserAddresses} from './component/account/user-addresses/app.user-addresses';
import {OrderService} from './provider/order';
import {Account} from './component/account/account';
import {ViewRefund} from './component/account/view_refund_detail/view_refund';
import {SortProductList} from './pipe/product_list_sorting';
import {TruncatePipe} from './pipe/truncation';
import {StringSort} from './pipe/stringsort';
import {ReadeMore} from './pipe/reade-more';
import {FilterSearchPipe} from './pipe/filtersearch';
import {UserDashboard} from './component/account/user-dashboard/app.user-dashboard';
import {UserNewAddress} from './component/account/user-newaddress/app.user-newaddress';
import {UserProfile} from './component/account/user-profile/app.user-profile';
import {UserRefundOrder} from './component/account/user-refund-order/user_refund_order';
import {UserReview} from './component/account/user-review/app.user-review';
import { UserOrders } from './component/account/user-orders/app.user-orders'; 
import {UserNotifications} from './component/account/user-notifications/app.user-notifications';
import {UserWishlist} from './component/account/user-wishlist/app.user-wishlist';
import {UserInfoService} from './provider/userInfo';
import { LoginRouteGaurd } from './provider/app.loginRouteGaurd';
import { PaymentRouteGuard } from './provider/app.payment-route-gaurd';
import { UserEditAddress} from './component/account/user-editaddress/app.user-editaddress';
import { UserEditRating } from './component/account/user-edit-rating/app.user-edit-rating';
import {NgxPaginationModule} from 'ngx-pagination';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RouterModule, Routes } from '@angular/router';
//import {ToastModule} from 'ng2-toastr/ng2-toastr';
import { BarRatingModule } from "ngx-bar-rating";
import {RoundOf} from './pipe/app.roundof';
import {Sorting} from './pipe/sort-wishlist';
import { AppComponent } from './app.component';
import { Home } from './component/home/home';
//import { BannerBlock } from './component/home/banner/banner';
import { CategoryHome } from './component/home/category-product/category-product';
//import {NewArrivalsBlock  } from './component/home/new-arrivals/new-arrival';
//import {BestSellerProduct  } from './component/home/best-seller/best-seller';
import { StaticCmsBlock } from './component/home/static-block/static-block';
import { Category } from './component/category-product-list/category/category';
import { ProductList } from './component/category-product-list/product-list/product-list';
import { Detail } from './component/product-detail/detail';
//import { UserRatings } from './component/user-ratings/app.user-ratings';
import { SimilarProduct } from './component/product-detail/similar-product/similar-product';
import { ImageZoom } from './component/product-detail/product-zoom/zoom';
import { ProductAttribute } from './component/product-detail/produt-attribute/product-attribute';
import { CustomerReview } from './component/product-detail/customer-review/review';
import { Checkout } from './component/checkout/checkout';
import { ModelAlertPopup } from './model/alert/model.alert';
import { ShareModel } from './model/social-share/share.model';
import { PageNotFound } from './app.page-not-found';
import { Crousal } from './directive/app.crousal';
import { LanguageTranslateInfoService } from './provider/app.changeLang';
import { UrlBreadCrumbService } from './provider/app.urlbreadcrum';
import { CreateUrl } from './provider/createUrl';
import {appConstant} from './constant/app.constant';
import { HttpService } from './provider/http-service';
import { CommonService } from './provider/app.common';
import { GlobalData } from './provider/app.global';
//import { BreadCrumbs } from './provider/app.breadcrum';
import { StoreSetting } from './provider/app.store-setting';
import { EncriptData } from './provider/encription';
import { MetaModule } from '@ngx-meta/core';
import {Loader} from './model/loader/loader.page.component';
import {ChaneURL} from './pipe/change_url';
import {DateFilter} from './pipe/date.filter';
import {ShowNewTagPipe} from './pipe/app.shownewtag';
//import {ViewMore} from './pipe/view-more';
import {SortingFilter} from './pipe/sort-review';

import { ProductRate } from './component/product-rating';
import {RatingModule} from "ng2-rating";
import {CurrencyConvertService } from './provider/currencyconvert';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {FixedDecimalPipe} from './pipe/app.fixedDecimal';
import {CartDetailService} from './provider/cartdetail';
import {PaymentInfoService} from './provider/paymentInfo';
import { Cart } from './component/cart/app.cart';
import {UserRatings} from './component/account/user-ratings/app.user-ratings';
import {UserHeaderComponent} from './component/account/sharing-component/user-header/user-header.component';
import {ConvertEstimateDatePipe} from './pipe/app.convertEstimateDate';
import {RecentFilter} from './pipe/recent_view';
import { Address } from './component/checkout/address/address';
import { Payment } from './component/checkout/payment/payment';
import { StripeComponent } from './component/checkout/payment/stripe/stripe.component';
import { Shipping } from './component/checkout/shipping/shipping';
import { orderDetail } from './component/checkout/order-detail/order-detail';
import { CouponCode } from './component/checkout/couponcode/couponcode';
import { OrderConfirmation } from './component/order-confirmation/app.order-confirmation';
import { ContinueButton } from './component/checkout/continue-button/continue-button';
import { NgProgressModule } from 'ngx-progressbar';
import { ChangePassword } from './component/change-password/app.change-password';
import { OrderCancelPopup } from './component/account/sharing-component/order-cancel-popup/order-cancel';
import { OrderRefundPopup } from './component/account/sharing-component/order-refund-popup/order-refund';
import { OrderViewDetail } from './component/account/order-view-detail/order-view-detail';
import {RecentlyView} from './component/account/recently-view/recently-view.component'; 
import {PaypalForm} from './component/checkout/payment/paypal/paypal.component';
//import { MyDatePickerModule } from 'mydatepicker';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { OrderCancel } from './component/order-cancel/order-cancel';
import { FlashMessagesModule } from 'ngx-flash-messages';
import { CategoryProductList } from './component/category-product-list/category-product-list';
import { GiftCard } from './component/account/gift-card/app.giftcard';
//import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { manageCategoryProductService } from './provider/manageCategoryProduct';
//import { ShareButtonModule } from '@ngx-share/button';
import { CmsPagesComponent } from './component/cms-pages/cms-pages.component';
import { PageAuthorizedRouteGaurd } from './provider/page-authorized-route-gaurd';
import {TrackOrder} from './component/track-order/app.trackorder';
import {CheckoutLogin} from './component/checkout-login/app.checkoutLogin';
import {Login} from './model/login/app.login';
import { Register } from './model/register/app.register';
import {orderInfo} from './component/checkout-login/order-info/order-info'

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, appConstant['translateUrl'], '.json');
}

const appRoutes: Routes = [
  

   {
    path: '',
    component: Home
    },
  
   {
    path:'promotion_offer',
    component: CategoryProductList
   },
   {
    path: 'login',
    component: Login
   },
   {
    path: 'sign-up',
    component: Register
   },
  {
    path:'search',
    component: CategoryProductList

  },
  {
    path : 'track-order',
    component : TrackOrder
  },
 {
    path: 'checkout',
    component: Checkout,
    canActivate:[LoginRouteGaurd,PaymentRouteGuard]
  },
  {
    path: 'checkout-login',
    component: CheckoutLogin
   },
  {
    path: 'order-confirmation',
    component: OrderConfirmation,
    canActivate:[LoginRouteGaurd,PaymentRouteGuard]
  },
  {
    path: 'account',
    component: Account,
    canActivate:[LoginRouteGaurd],
    children:[{path: '',redirectTo: 'profile',pathMatch:'full'},{path: 'profile',component:UserProfile},{path: 'dashboard',component:UserDashboard},{path: 'orders',component:UserOrders},
              {path: 'addresses',component:UserAddresses},{path: 'wishlist',component:UserWishlist},{path: 'review',component:UserReview},
              {path: 'gift-card',component:GiftCard},{ path:'order-refund',component: UserRefundOrder},
              {path:'view-refund/:id',component:ViewRefund},
              {path: 'newaddress',component:UserNewAddress},{path: 'editaddress/:address_id',component:UserEditAddress},
              {path: 'notifications',component:UserNotifications},{path: 'ratings/:product_id',component:UserRatings},
              {path: 'edit-rating/:review_id',component:UserEditRating},{path: 'order-view/:order_id/:oid',component:OrderViewDetail},
              { path:'recently-view',component:RecentlyView,canActivate:[PageAuthorizedRouteGaurd]
  }]
  },
  {
    path: 'order-cancel',
    component:OrderCancel
  },
  {
    path: 'change-password',
    component:ChangePassword
   },
  {
    path: 'cart',
    component: Cart
   // canActivate:[LoginRouteGaurd]
    
  },
  {
    path : 'page/:pageName',
    component : CmsPagesComponent
  },
  {
    path: ':parentSlug/:subSlug/:slug',
    component: CategoryProductList
    
  },
  {
    path: ':productName/:sku/:productData/:buynow',
    component:  Detail
  },  
  {
    path: ':slug',
    component: CategoryProductList
    
  },
  {
    path: ':parentSlug/:slug',
    component: CategoryProductList
    
  },
  

  //fghdh
  // {
    
  //       path: '',
  //       redirectTo: 'index.html',
  //       pathMatch: 'full'
  //     },
  {
    path: '**',
    component: PageNotFound
  }
];


@NgModule({

  declarations: [orderInfo,Register,Login,CheckoutLogin,ViewRefund,UserRefundOrder,SortProductList,TrackOrder,CmsPagesComponent,UserEditRating,OrderCancel,PaypalForm,RecentFilter,RecentlyView,
  OrderViewDetail,OrderRefundPopup,OrderCancelPopup,ChangePassword,ContinueButton,CouponCode,OrderConfirmation,ShareModel,
  Shipping,orderDetail,Payment,StripeComponent,UserEditAddress,Account,UserProfile,UserDashboard,ConvertEstimateDatePipe,
  UserHeaderComponent,UserRatings,UserOrders,UserNewAddress,UserReview,UserNotifications,UserWishlist,
  Cart,UserAddresses,Home, ProductList, Category, Detail,SimilarProduct,Address,ImageZoom,
  ProductAttribute,CustomerReview,TruncatePipe,FilterSearchPipe,StringSort,ReadeMore,
   Checkout, PageNotFound, Crousal,Loader,StaticCmsBlock,CategoryHome,ChaneURL,ProductRate,DateFilter,ShowNewTagPipe,
   SortingFilter,FixedDecimalPipe,Sorting,RoundOf,CategoryProductList,GiftCard],
  imports: [ FlashMessagesModule,SharedModule,StripeCheckoutModule,
    RouterModule.forRoot(appRoutes),
    CommonModule, FormsModule,NgProgressModule,NgxMyDatePickerModule.forRoot(),
    HttpClientModule,BarRatingModule,RatingModule,NgxPaginationModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
     MetaModule.forRoot(),
    // NgxDynamicTemplateModule.forRoot({ routes: appRoutes })
    //FormsModule,BrowserModule,
    // ShareButtonsModule.forRoot()
  ],
  providers: [PageAuthorizedRouteGaurd,manageCategoryProductService,CreateUrl,PaymentInfoService,OrderService,UserInfoService,CartDetailService,Cookie,CurrencyConvertService,
  LanguageTranslateInfoService,HttpService,EncriptData,LoginRouteGaurd,PaymentRouteGuard,UrlBreadCrumbService,
  StoreSetting,GlobalData,CommonService],
  exports: [RouterModule]

})
export class AppRoutingModule {
}
