import {Directive, ElementRef, Input} from '@angular/core';
declare var jQuery: any;
declare var Messenger: any;

@Directive ({
  selector: '[messenger-demo]'
})

//Notification Messages
export class MessengerDemo {
  $el: any;
  constructor(){}

  //Function message success
  Message_successfully(){
       Messenger().post({
        message: 'Your data has been successfully saved.',
        type: 'success',
        showCloseButton: true
      });
  }

  //Function message error
  Message_fail(){
       Messenger().post({
        message: 'ERROR!, Your data has not been saved.',
        type: 'error',
        showCloseButton: true
      });
  }

  //Function message logout
  Message_loggedout(){
       Messenger().post({
        message: 'You are not logged in. Please log in and try again.',
        type: 'error',
        showCloseButton: true
      });
  }

  //Function message Inexpected error
  Message_inexpectederror(){
       Messenger().post({
        message: "For your security, you have been logged out due to inactivity. Please login again.",
        type: 'error',
        showCloseButton: true
      });
  }

  //Function message session logout Successfully 
  Message_session_logout(){
      setTimeout(()=>{
         $(".messenger-close").click();
      } , 3000);
       Messenger().post({
        message: '<div id="logoutAlert" class="container"><div id="success-logout" class="alert alert-success" alert-dismissible><i id="check-success" aria-hidden="true" class="fa fa-check-circle"></i><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;You have been logged out successfully!</span></div></div>',
        type: 'success',
        // hideAfter: 3000,
        showCloseButton: true
      });
  }

  initializationCode(): void {
    (function(): void {
      let $, FlatMessage, spinner_template,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent): any { for (let key in parent) { if (__hasProp.call(parent, key)) { child[key] = parent[key]; } } function ctor(): void { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

      $ = jQuery;

      spinner_template = '<div class="messenger-spinner">\n    <span class="messenger-spinner-side messenger-spinner-side-left">\n        <span class="messenger-spinner-fill"></span>\n    </span>\n    <span class="messenger-spinner-side messenger-spinner-side-right">\n        <span class="messenger-spinner-fill"></span>\n    </span>\n</div>';

      FlatMessage = (function(_super): any {
        __extends(FlatMessage, _super);

        function FlatMessage(): any {
          /* tslint:disable */
          return FlatMessage['__super__'].constructor.apply(this, arguments);
          /* tslint:enable */
        }

        FlatMessage.prototype.template = function(opts): any {
          let $message;
          /* tslint:disable */
          $message = FlatMessage['__super__'].template.apply(this, arguments);
          /* tslint:enable */
          $message.append(jQuery(spinner_template));
          return $message;
        };

        return FlatMessage;
        /* tslint:disable */
      })(window['Messenger'].Message);

      window['Messenger'].themes.air = {
        Message: FlatMessage
      };
      /* tslint:enable */
    }).call(window);
  }

  render(): void {
    this.initializationCode();
    let theme = 'air';

    jQuery.globalMessenger({ theme: theme });
    Messenger.options = { theme: theme  };

    //Messenger().post('Thanks for checking out Messenger!');

    let loc = ['bottom', 'right'];
    let $lsel = jQuery('.location-selector');

    let update = function(): void {
      let classes = 'messenger-fixed';

      for (let i = 0; i < loc.length; i++) { classes += ' messenger-on-' + loc[i]; }

      jQuery.globalMessenger({ extraClasses: classes, theme: theme  });
      //Messenger.options = { extraClasses: classes, theme: theme };
      //My options
      Messenger.options = {
        extraClasses: 'messenger-fixed messenger-on-bottom',
        theme: theme
      }
    };

    update();

    /*$lsel.locationSelector()
      .on('update', (pos) => {
        loc = pos;
        update();
      });*/
  }

  ngOnInit(): void {
    this.render();
  }
}
