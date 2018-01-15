import { Component, EventEmitter, OnInit, ElementRef, ViewContainerRef, ViewEncapsulation, Input, Output} from '@angular/core';
import {TOOLTIP_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {ROUTER_DIRECTIVES, Router} from '@angular/router-deprecated';
import {ConfigService} from '../config';
import {Notifications} from '../notifications/notifications';
import { Http, Headers, Response } from '@angular/http';

//My imports
import {Widget} from '../widget/widget';
import { Modal, BS_MODAL_PROVIDERS as MODAL_P } from 'angular2-modal/plugins/bootstrap'; //Modal
import { DialogRef } from 'angular2-modal';
import {Observable} from 'rxjs/Rx';
import {MessengerDemo} from '../../components/messenger/messenger';
import myGlobals = require('./../../../app');
import {TitleService} from './titles.service';
import { Subject }    from 'rxjs/Subject';
import { Subscription } from "rxjs";

declare var $: any;
declare var jQuery: any;

//Modal content and function
@Component({
  selector: 'modal_confirm',
  template: require('./modal_logout.html'),
  styles: [require('./modal_logout.scss')],
  encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES, MessengerDemo, [Widget]],
  providers: [MessengerDemo]
})

//Logout and cancel logout
export class modal_confirm {
    
   constructor(public router: Router, public http: Http, public message: MessengerDemo) {}
    
    //Logout
    logout(event){
    let body= JSON.stringify({ provider: 'logout'});
    let url_authenticate= myGlobals.host+'/api/json/reply/Authenticate';

    this.http.post( url_authenticate , body , {withCredentials:true})
      .subscribe( 
          response =>  {
            this.router.navigate(['/LoginPage', 'Login Page']);
              setTimeout(() => {
                this.message.Message_session_logout();
              }, 1100);
            }, error => {
              alert(error.json().ResponseStatus);
            }
        );
     jQuery("modal-backdrop").remove();
    }

    //Logout cancel and return to page
    remove_modal(){
      jQuery("modal-backdrop").remove();
      jQuery("body").removeClass('modal-open');
    }
    //Call to logout function
    logoff(){
        this.logout(event);
    }

}//Close class modal_confirm

//Component Navbar
@Component({
  selector: '[navbar]',
  events: ['toggleSidebarEvent', 'toggleChatEvent'],
  directives: [Notifications, TOOLTIP_DIRECTIVES, ROUTER_DIRECTIVES, [Widget]],
  encapsulation: ViewEncapsulation.None,  
  template: require('./navbar.html'),
  providers:[MODAL_P]
})

export class Navbar implements OnInit {
  toggleSidebarEvent: EventEmitter<any> = new EventEmitter();
  toggleChatEvent: EventEmitter<any> = new EventEmitter();
  $el: any;
  config: any;
  title_page: any;
  _subscription: any;

  constructor(el: ElementRef, config: ConfigService, public http: Http, public router: Router,
              public modal: Modal, viewContainer: ViewContainerRef,  
              public _titleService: TitleService) {

    this.$el = jQuery(el.nativeElement);
    this.config = config.getConfig();
    //Modal confirm
    modal.defaultViewContainer = viewContainer;
    //Subcribe to new Title
    this.title_page = _titleService.title_page;
    this._subscription = _titleService.titleChange.subscribe((value) => { 
      this.title_page = value; 
      console.log('Nabvar Title: ' + this.title_page);
    }); 
  }
  
  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  ///////////////////////////////////////////////////

  toggleSidebar(state): void {
    this.toggleSidebarEvent.emit(state);
  }

  toggleChat(): void {
    this.toggleChatEvent.emit(null);
  }

  ngOnInit(): void {  
    setTimeout(() => {
      let $chatNotification = jQuery('#chat-notification');
      $chatNotification.removeClass('hide').addClass('animated fadeIn')
        .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
          $chatNotification.removeClass('animated fadeIn');
          setTimeout(() => {
            $chatNotification.addClass('animated fadeOut')
              .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd' +
                ' oanimationend animationend', () => {
                $chatNotification.addClass('hide');
              });
          }, 8000);
        });
      $chatNotification.siblings('#toggle-chat')
        .append('<i class="chat-notification-sing animated bounceIn"></i>');
    }, 4000);

    this.$el.find('.input-group-addon + .form-control').on('blur focus', function(e): void {
      jQuery(this).parents('.input-group')
        [e.type === 'focus' ? 'addClass' : 'removeClass']('focus');
    });
  }
  //Send to My account page
  myAccount(event){
    this.router.navigate(['/App', 'UpdateAdmin']);
  }

//Open Modal confirm Logout
 open_confirm(modal_confirm){
    this.modal.confirm()
      .size('sm')
      .isBlocking(true)
      .showClose(true)
      .component(modal_confirm)
      .open();
  }
  //Open Modal Logout
   Open_modal(){
    this.open_confirm(modal_confirm);
  } 
}












