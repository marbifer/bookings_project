import {Component, ElementRef, ViewContainerRef, ViewEncapsulation, ViewChild , NgZone} from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router} from '@angular/router-deprecated';
import {FORM_PROVIDERS} from '@angular/common';
import {Sidebar} from './sidebar/sidebar';
import {Navbar} from './navbar/navbar';
import {AnotherPage} from './../another/another';
import {Bworkspace} from './../bworkspace/bworkspace';
import {ConfigService} from './config';
import {LoginPage} from './../login/login';
import {UpdateAdmin} from './../update-admin/update-admin';
import {ChangePass} from './../update-admin/changepass/change_pass';
import {Widget} from '../core/widget/widget';
import {Http, Headers, Response } from '@angular/http';
import {Idle, DEFAULT_INTERRUPTSOURCES } from 'ng2-idle/core'; //For timeout
import {Modal, BS_MODAL_PROVIDERS as MODAL_P} from 'angular2-modal/plugins/bootstrap'; //Modal
import {DialogRef} from 'angular2-modal';
import {Location} from '@angular/common';
import {Validator} from '../core/validations/validations';
import myGlobals = require('./../../app');
import {CustomHttp} from '../../app/services/http-wrapper';
import {MessengerDemo} from '../components/messenger/messenger';
import {BookingDetail} from './../bworkspace/bookingdetail/bookingdetail';
import {FileDetail} from './../bworkspace/filedetail/filedetail';
import {ExternalProviders} from './../settings/external-providers/external-providers';
import {MappingsCategories} from './../settings/mappings/all-mappings/mappings';
import {Agencies} from './../customers/list-agencies/agencies';
import {AgencyDetail} from './../customers/list-agencies/agency-detail/agency-detail';
import {Users} from './../customers/list-users/users';
import {Currencies} from '../settings/currencies/currencies';
import {Translations} from '../settings/translations/translations';
import {PriceRules} from '../settings/price-rules/price-rules';
import {InternalProviders} from '../settings/internal-providers/internal-providers';
import {TranslationsDetail} from '../settings/translations/translations-detail/translations-detail';
//import {InternalData1} from './../internal-data/internalData1/internal-data'; //Others Internal Data
import {InternalData} from './../internal-data/all-internal-data/internal-data'; //Interna Data Accessibilities and Amenities
import { Ife } from "./../bworkspace/ife/ife";
import { Notifications } from '../settings/notifications/notifications';
import { NotificationsNew } from '../settings/notifications/notifications-new/notifications-new';
import { NotificationsDetail } from '../settings/notifications/notifications-detail/notifications-detail';
import { Groups } from '../security/groups/groups';
import { GroupsDetail } from "../security/groups/groups-detail/groups-detail";
import { GroupsNew } from "../security/groups/groups-new/groups-new";
import { Administrators } from "../security/administrators/administrators";
import { UserActivityLog } from "../customers/list-users/user-activity-log/user-activity-log";

declare var $: any;
declare var jQuery: any;
declare var Tether: any;
declare var tinymce: any;
declare var widgEditor: any;

@Component({
  selector: 'app',
  host: {
    '[class.nav-static]' : 'config.state["nav-static"]',
    '[class.chat-sidebar-opened]' : 'chatOpened',
    '[class.app]' : 'true',
    class: 'my-login-page app',
    id: 'app'
  },
  providers: [ FORM_PROVIDERS, MODAL_P, Validator, Sidebar, MessengerDemo],
  directives: [Sidebar, Navbar, ROUTER_DIRECTIVES,[Widget] ],
  template: require('./core.html'),
  encapsulation: ViewEncapsulation.None,
  styles: [require('../core/expiredmodal/expired_modal.scss')]
})

@RouteConfig([
  { path: '/bworkspace', component: Bworkspace, name: 'Bworkspace', useAsDefault: true },
  { path: '/another-page', component: AnotherPage, name: 'AnotherPage' },
  //{ path: '/login', component: LoginPage, name: 'Login' },
  { path: '/update_admin', component: UpdateAdmin, name: 'UpdateAdmin' },
  { path: '/changepass', component: ChangePass, name: 'ChangePass' },
  { path: '/bworkspace/bookingdetail', component: BookingDetail, name: 'BookingDetail' },
  { path: '/bworkspace/filedetail', component: FileDetail, name: 'FileDetail' },
  { path: '/bworkspace/ife', component: Ife, name: 'Ife' },
  { path: '/settings/external-providers', component: ExternalProviders, name: 'ExternalProviders'},
  { path: '/settings/mappings/categories', component: MappingsCategories, name: 'MappingsCategories'},
  { path: '/settings/mappings/amenities', component: MappingsCategories, name: 'MappingsAmenities'},
  { path: '/settings/mappings/mealplans', component: MappingsCategories, name: 'MappingsMealplans'},
  { path: '/settings/mappings/chains', component: MappingsCategories, name: 'MappingsChains'},
  { path: '/settings/mappings/attraction-categories', component: MappingsCategories, name: 'MappingsAttractionCategories'},
  { path: '/customers/list-agencies', component: Agencies, name: 'Agencies'},
  { path: '/customers/list-agencies/agency-detail', component: AgencyDetail, name: 'AgencyDetail'},
  { path: '/customers/list-users/users', component: Users, name: 'Users'},
  { path: '/customers/list-users/user-activity-log', component: UserActivityLog, name: 'UserActivityLog'},
  { path: '/settings/currencies', component: Currencies, name: 'Currencies'},
  { path: '/settings/translations', component: Translations, name: 'Translations'},
  { path: '/settings/translations-detail', component: TranslationsDetail, name: 'TranslationsDetail'},
  { path: '/settings/price-rules', component: PriceRules, name: 'PriceRules'},
  { path: '/settings/internal-providers', component: InternalProviders, name: 'InternalProviders'},
  { path: '/settings/notifications', component: Notifications, name: 'Notifications'},
  { path: '/settings/notifications/notifications-new', component: NotificationsNew, name: 'NotificationsNew'},
  { path: '/settings/notifications/notifications-detail', component: NotificationsDetail, name: 'NotificationsDetail'},
  { path: '/internal-data/amenities', component: InternalData, name: 'InternalAmenities'},
  { path: '/internal-data/chains', component: InternalData, name: 'InternalChains'},
  { path: '/internal-data/classifications', component: InternalData, name: 'InternalClassifications'},
  { path: '/internal-data/accessibilities', component: InternalData, name: 'InternalAccessibilities'},
  { path: '/internal-data/hotel-categories', component: InternalData, name: 'InternalHotelCategories'},
  { path: '/internal-data/attraction-categories', component: InternalData, name: 'InternalAttractionCategories'},
  { path: '/security/groups', component: Groups, name: 'Groups'},
  { path: '/security/groups/groups-detail', component: GroupsDetail, name: 'GroupsDetail'},
  { path: '/security/groups/groups-new', component: GroupsNew, name: 'GroupsNew'},
  { path: '/security/administrators', component: Administrators, name: 'Administrators'}
])

export class Core {
  config: any;
  configFn: any;
  $sidebar: any;
  el: ElementRef;
  chatOpened: boolean;
  router: Router;
  winHeight:any;
  @ViewChild(Sidebar) sidebar: Sidebar;

  constructor(
    config: ConfigService, el: ElementRef, router: Router, public http: Http,
    private idle: Idle, public modal: Modal, viewContainer: ViewContainerRef,
    private _loc: Location, public vali: Validator, public message: MessengerDemo , public zone : NgZone) {
      this.el = el;
      this.config = config.getConfig();
      this.configFn = config;
      this.chatOpened = false;
      this.router = router;

    jQuery.fn.onPositionChanged = function (trigger, millis): any {
      if (millis == null) { millis = 100; }
      let o = jQuery(this[0]); // our jquery object
      if (o.length < 1) { return o; }

      let lastPos = null;
      let lastOff = null;
      setInterval(() => {
        if (o == null || o.length < 1) { return o; } // abort if element is non existend eny more
        if (lastPos == null) { lastPos = o.position(); }
        if (lastOff == null) { lastOff = o.offset(); }
        let newPos = o.position();
        let newOff = o.offset();
        if (lastPos.top !== newPos.top || lastPos.left !== newPos.left) {
          jQuery(this).trigger('onPositionChanged', { lastPos: lastPos, newPos: newPos });
          if (typeof (trigger) === 'function') { trigger(lastPos, newPos); }
          lastPos = o.position();
        }
        if (lastOff.top !== newOff.top || lastOff.left !== newOff.left) {
          jQuery(this).trigger('onOffsetChanged', { lastOff: lastOff, newOff: newOff});
          if (typeof (trigger) === 'function') { trigger(lastOff, newOff); }
          lastOff = o.offset();
        }
      }, millis);

      return o;
    };
    //Check if no login
    if(this._loc.path()!="/app/login" || this._loc.path()!="/login"){
      //Modal
      modal.defaultViewContainer = viewContainer;

      //Call function Session Expired
      this.Session_expired();
    } //Close if location
   
    this.winHeight = $( window ).height();

  }

/////////////////////////////////////////////////////////
///Event to login///
  login(event, user_name, password){
          jQuery('div#errors_inexpected').hide();
          let url_authenticate : string;
          //url http post
          url_authenticate = myGlobals.host+'/api/json/reply/Authenticate?format=json';
          let body=JSON.stringify({userName: user_name, password: password});

          this.http.post( url_authenticate , body , {withCredentials:true})
            .subscribe(
              response =>  {
                //Modal Login
                  $('#myModal').modal('hide');
                  $('#basic').val('');
                  /*$('#user_email').val('');
                  $('#user_password').val('');*/
                  $('#password').val('');
                  //Timer to expire session
                  this.Session_expired();
                  this.sidebar.get_menu();
                  window.location.reload(); //Refresh page after login to do request again
              }, error => {
                jQuery('#forgot-modal').empty().append('Forgot your password?');
            //    jQuery('div#errors_inexpected').hide();
              setTimeout(()=>{
                jQuery('div#errors_inexpected').show(100);
              } , 500);
            }
        );
   }

   checkParsleys(){
    if ($('.user-name-login input').hasClass('parsley-error')) {
        $('.user-name-login .parsley-errors-list').show();
    }
    else {
        $('.user-name-login .parsley-errors-list').hide();
    }
  }

  checkParsleys2(){
    if ($('.user-pass-login input').hasClass('parsley-error')) {
        $('.user-pass-login .parsley-errors-list').show();
    }
    else {
        $('.user-pass-login .parsley-errors-list').hide();
    }
  }

  //Expired second session
  Session_expired(){

    // sets an idle timeout of 5 seconds, for testing purposes.
    this.idle.setIdle(1);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    this.idle.setTimeout(1800);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onTimeout.subscribe(() => {
    console.log('Timeout');
    let body= JSON.stringify({ provider: 'logout'});
    let url_authenticate= myGlobals.host+'/api/json/reply/Authenticate';

    this.http.post( url_authenticate , body , {withCredentials:true})
      .subscribe(
        response =>  {
          jQuery('.modal-backdrop, .modal').show();
          //Open modal
          this.open_modal();
        }, error => {
             alert(error.json().ResponseStatus);
          }
        );
    });
    //start watching for idleness right away.
    this.idle.watch();
  }//Second session-close

  open_modal(){
    jQuery('#myModal').modal({'show':true});
   // jQuery('div#errors_inexpected').show('slow').delay(7000).fadeOut('slow');
  }
////////////////////////////////////////////////////////////////

  toggleSidebarListener(state): void {
    let toggleNavigation = state === 'static'
      ? this.toggleNavigationState
      : this.toggleNavigationCollapseState;
    toggleNavigation.apply(this);
    localStorage.setItem('nav-static', this.config.state['nav-static']);
  }

  toggleChatListener(): void {
    jQuery(this.el.nativeElement).find('.chat-notification-sing').remove();
    this.chatOpened = !this.chatOpened;

    setTimeout(() => {
      // demo: add class & badge to indicate incoming messages from contact
      // .js-notification-added ensures notification added only once
      jQuery('.chat-sidebar-user-group:first-of-type ' +
        '.list-group-item:first-child:not(.js-notification-added)')
        .addClass('active js-notification-added')
        .find('.fa-circle')
        .after('<span class="label label-pill label-danger ' +
          'pull-right animated bounceInDown">3</span>');
    }, 1000);
  }

  toggleNavigationState(): void {
    this.config.state['nav-static'] = !this.config.state['nav-static'];
  }

  expandNavigation(): void {
    // this method only makes sense for non-static navigation state
    if (this.isNavigationStatic()
      && (this.configFn.isScreen('lg') || this.configFn.isScreen('xl'))) { return; }
    jQuery('app').removeClass('nav-collapsed');
    this.$sidebar.find('.active .active').closest('.collapse').collapse('show')
      .siblings('[data-toggle=collapse]').removeClass('collapsed');

      ///////////////////////////////////////////////
      /// Event for logo in collapse OPEN SIDEBAR ///
      jQuery('#logo-text').stop();
      jQuery('#logo-circle').stop();
      jQuery('#logo-circle').animate({opacity: 0}, 720);
      jQuery('#logo-text').animate({opacity: 1}, 1200);
  }

  collapseNavigation(): void {
    // this method only makes sense for non-static navigation state
    if (this.isNavigationStatic()
      && (this.configFn.isScreen('lg') || this.configFn.isScreen('xl'))) { return; }

    jQuery('app').addClass('nav-collapsed');
      this.$sidebar.find('.collapse.in').collapse('hide')
      .siblings('[data-toggle=collapse]').addClass('collapsed');

      ////////////////////////////////////////////////
      /// Event for logo in collapse CLOSE SIDEBAR ///
      jQuery('#logo-text').stop();
      jQuery('#logo-circle').stop();
      jQuery('#logo-text').animate({opacity: 0}, 720);
      jQuery('#logo-circle').animate({opacity: 1}, 1500);
  }

  /**
   * Check and set navigation collapse according to screen size and navigation state
   */
  checkNavigationState(): void {
    if (this.isNavigationStatic()) {
      if (this.configFn.isScreen('sm')
        || this.configFn.isScreen('xs') || this.configFn.isScreen('md')) {
        this.collapseNavigation();
      }
    } else {
      if (this.configFn.isScreen('lg') || this.configFn.isScreen('xl')) {
        setTimeout(() => {
          this.collapseNavigation();
        }, this.config.settings.navCollapseTimeout);
      } else {
        this.collapseNavigation();
      }
    }
  }

  isNavigationStatic(): boolean {
    return this.config.state['nav-static'] === true;
  }

  toggleNavigationCollapseState(): void {
    if (jQuery('app').is('.nav-collapsed')) {
      this.expandNavigation();
    } else {
      this.collapseNavigation();
    }
  }

  _sidebarMouseEnter(): void {
    //jQuery('#item201, #item206').siblings('a').children('i').remove();
    if (this.configFn.isScreen('lg') || this.configFn.isScreen('xl')) {
      this.expandNavigation();
    }
  }
  _sidebarMouseLeave(e): void {
    console.log(e);
      if ( e.clientX > 200 || e.clientY < 0 || e.clientY > this.winHeight) {
        if (this.configFn.isScreen('lg') || this.configFn.isScreen('xl')) {
          this.collapseNavigation();
        }
      }
  }

  enableSwipeCollapsing(): void {
    let d = this;
    jQuery('.content-wrap').swipe({
      swipeLeft: function(): void {
        // this method only makes sense for small screens + ipad
        if (d.configFn.isScreen('lg')) { return; }

        if (!jQuery('app').is('.nav-collapsed')) {
          d.collapseNavigation();
        }
      },
      swipeRight: function(): void {
        // this method only makes sense for small screens + ipad
        if (d.configFn.isScreen('lg')) { return; }

        // check if navigation is collapsing. exiting if true
        if (jQuery('app').is('.nav-busy')) { return; }

        if (jQuery('app').is('.nav-collapsed')) {
          d.expandNavigation();
        }
      },
      threshold: this.configFn.isScreen('xs') ? 100 : 200
    });
  }

  collapseNavIfSmallScreen(): void {
    if (this.configFn.isScreen('xs')
      || this.configFn.isScreen('sm') || this.configFn.isScreen('md')) {
      this.collapseNavigation();
    }
  }
  //////////////////////////////////////////////
  //Functions to validate inputs to Login form

  ngOnInit(): void {
    /////////////////////////////////////////////
    ////Ping - Reditect to Login////
   let url_authenticate : string;
      //http post
      url_authenticate = myGlobals.host+'/api/ping';

      this.http.post( url_authenticate , {} , {withCredentials:true})
        .subscribe(
          response => {
            console.log(response);
          }, error => {
              //this.message.Message_loggedout();
          }
      );
    jQuery('app').addClass('nav-collapsed');
    jQuery('#logo-circle').css({'opacity': '1' ,  'animation': 'none'});
    jQuery('#logo-text').css({'opacity': '0' ,  'animation': 'none'} );


    /////////////////////////////////////////////
    //Validations///
    jQuery('.parsleyjs').parsley();

    //Call function input validation
    this.vali.CheckInput();

    //////////////////////////////////////////////

    setTimeout(() => { jQuery('[data-toggle="tooltip"]').tooltip(); });

    jQuery('[data-toggle="tooltip"]').onPositionChanged(() => { Tether.position(); }, 0);

    if (localStorage.getItem('nav-static') === 'true') {
      this.config.state['nav-static'] = true;
    }

    let $el = jQuery(this.el.nativeElement);
    this.$sidebar = $el.find('[sidebar]');

    setTimeout(() => {
      $el.find('a[href="#"]').on('click', (e) => {
        e.preventDefault();
      });
    });

      this.$sidebar.on('mouseenter', this._sidebarMouseEnter.bind(this));
      this.$sidebar.on('mouseleave', this._sidebarMouseLeave.bind(this));

    this.checkNavigationState();

    this.$sidebar.on('click', () => {

      if (jQuery('app').is('.nav-collapsed')) {
        this.expandNavigation();
      }
      jQuery('#item201, #item206').remove();
    });

    this.router.parent.subscribe(() => {
      this.collapseNavIfSmallScreen();
      window.scrollTo(0, 0);

      setTimeout(() => {
        $el.find('a[href="#"]').on('click', (e) => {
          e.preventDefault();
        });
      });
    });

    if ('ontouchstart' in window) { this.enableSwipeCollapsing(); }

    this.$sidebar.find('.collapse').on('show.bs.collapse', function(e): void {
        // execute only if we're actually the .collapse element initiated event
        // return for bubbled events
        if (e.target !== e.currentTarget) { return; }

        let $triggerLink = jQuery(this).prev('[data-toggle=collapse]');
        jQuery($triggerLink.data('parent'))
          .find('.collapse.in').not(jQuery(this)).collapse('hide');
      })
      /* adding additional classes to navigation link li-parent
       for several purposes. see navigation styles */
      .on('show.bs.collapse', function(e): void {
        // execute only if we're actually the .collapse element initiated event
        // return for bubbled events
        if (e.target !== e.currentTarget) { return; }

        jQuery(this).closest('li').addClass('open');
      }).on('hide.bs.collapse', function(e): void {
      // execute only if we're actually the .collapse element initiated event
      // return for bubbled events
      if (e.target !== e.currentTarget) { return; }

      jQuery(this).closest('li').removeClass('open');
    });
  }
}
