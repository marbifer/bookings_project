import {Component, OnInit, ElementRef} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router-deprecated';
import {Location} from '@angular/common';
import {SlimScroll} from 'ng2-slimscroll/ng2-slimscroll';
import {ConfigService} from '../config';
import {Widget} from '../../core/widget/widget';
import { Http, Headers, Response } from '@angular/http';
import {MessengerDemo} from '../../components/messenger/messenger';
import myGlobals = require('./../../../app');
import {bootstrap} from '@angular/platform-browser-dynamic';
import {editAgencyDetail} from '../../customers/list-agencies/agency-detail/inline-agencies/edit_form_agencies.service'; //Inline Editing Agency Detail
import {editPriceRules} from '../../../app/settings/price-rules/price-rules-detail/inline-price-rules/edit_price_rules.service'; //Inline Editing Price rules
import {pathName} from '../../../app/core/sidebar/path_name.service'; //Service Unification All mappings (Listados simples)

declare var jQuery: any;

@Component({
  selector: '[sidebar]',
  directives: [ROUTER_DIRECTIVES, SlimScroll, MessengerDemo, Widget],
  providers: [MessengerDemo],
  template: require('./sidebar.html'),
  styles: [require('./sidebar.scss')]
})

export class Sidebar implements OnInit {
  $el: any;
  config: any;
  router: Router;
  location: Location;
  menu: any;
  host_domain: any;

  constructor(
    public http: Http, 
    config: ConfigService, 
    el: ElementRef, 
    router: Router, 
    public _edit_agencies: editAgencyDetail, 
    location: Location, 
    public _path_name: pathName, 
    public message: MessengerDemo,
    public _edit_price: editPriceRules
  ) {
    this.$el = jQuery(el.nativeElement);
    this.config = config.getConfig();
    this.router = router;
    this.location = location;
    this.host_domain = myGlobals.DOMAIN_IMG;
    this.get_menu();
  }

  initSidebarScroll(): void {
    let $sidebarContent = this.$el.find('.js-sidebar-content');
    if (this.$el.find('.slimScrollDiv').length !== 0) {
      $sidebarContent.slimscroll({
        destroy: true
      });
    }
    $sidebarContent.slimscroll({
      height: window.innerHeight,
      size: '4px'
    });
  }

  changeActiveNavigationItem(location): void {
    let $newActiveLink = this.$el.find('a[href="#' + location.path() + '"]');

    // collapse .collapse only if new and old active links belong to different .collapse
    if (!$newActiveLink.is('.active > .collapse > li > a')) {
      this.$el.find('.active .active').closest('.collapse').collapse('hide');
    }
    this.$el.find('.sidebar-nav .active').removeClass('active');

    $newActiveLink.closest('li').addClass('active')
      .parents('li').addClass('active');

    // uncollapse parent
    $newActiveLink.closest('.collapse').addClass('in')
      .siblings('a[data-toggle=collapse]').removeClass('collapsed');
  }

  ngAfterViewInit(): void {
    this.changeActiveNavigationItem(this.location);
  }

  ngOnInit(): void {
    //jQuery('#logo-circle').animate({opacity: 0}, 0); //Start hidden Sidebar Logo
    jQuery(window).on('sn:resize', this.initSidebarScroll.bind(this));
    this.initSidebarScroll();

    this.router.parent.subscribe(() => {
      this.changeActiveNavigationItem(this.location);
    });
  }

/////////////////////////////////////////////
/// Remove Autocompletes of Agency Detail ///
remove_autocomplete(){
    this._edit_agencies.close_form_user();
    this._edit_agencies.remove_autocomplete();
    this._edit_price.close_form_price_rules();
}

////////////////////////////////////////////////////////////////////////////////////
/// Function to obtain menu ////
 
  public get_menu(){
    let url_get_data = myGlobals.host+'/api/admin/get_menu';
    //let headers = new Headers({ 'Content-Type': 'application/json' }); 
    let headers  = new Headers({ 'Accept': 'q=0.8;application/json;q=0.9' }); //Visible in Mozilla Firefox
          this.http.get( url_get_data, { headers: headers, withCredentials:true})
            .subscribe( 
              response => {                      
                 this.menu=response.json().menu;
                 console.log('menu sidebar' + JSON.stringify(this.menu));    
              }, error => {
                //this.message.Message_loggedout();
              }
            );
      }
  }
