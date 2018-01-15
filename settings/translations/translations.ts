import { Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, OnInit, NgZone , ViewChild , OnDestroy } from '@angular/core';
import { Widget } from '../../core/widget/widget';
import { RouteConfig, ROUTER_DIRECTIVES, RouteParams, Router } from '@angular/router-deprecated';
import { Http, Headers, Response } from '@angular/http';
import { Idle, DEFAULT_INTERRUPTSOURCES } from 'ng2-idle/core'; //For timeout
import { DialogRef } from 'angular2-modal';
import { Observable } from 'rxjs/Observable';
import { CustomHttp } from '../../services/http-wrapper';
import myGlobals = require('../../../app');
import { ACCORDION_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';
import { NgClass } from '@angular/common';
import { Modal, BS_MODAL_PROVIDERS as MODAL_P } from 'angular2-modal/plugins/bootstrap'; //Modal
import { Core } from '../../core/core';
import { Location } from '@angular/common';
import { LoadingGif } from '../../bworkspace/filedetail/loading_gif.service';
import { DataPropertiesTranslations } from './data_properties.service';
//import {editTranslations} from './inlinediting/edit_translations.service'; //Inline Editing Mappings amenities
import { TitleService } from '../../core/navbar/titles.service';
import { editTranslations } from './translations-detail/inline-translation-detail/edit_forms_translation_detail.service';

import { myPagination } from './../pagination-mappings/pagination.subcomponent';
import { DataPagination } from './../pagination-mappings/data_pagination.service';
import { translationDetailService } from './translations-detail/translation-detail.service';

declare var jQuery: any;
declare var $: any;

////////////////////
/// Translations ///
@Component({
  selector: '[translations]',
  template: require('./translations.html'),
  styles: [require('./translations.scss')],
  directives: [ROUTER_DIRECTIVES, [Widget] , [myPagination]],
  providers: [MODAL_P, Modal , DataPagination] 
})

export class Translations {

    //Title page
    title_page: any;
    checked = false; //Select All
    justchange: any; //just change icon to normal checkbox

    //Icon Delete Table Mappings amenities
    show_icon_cur = false;
    disabled_loc = false; //It's enabled
    selected_c = [];

    //Control width of screens
    view_port_width_cur = true;

    //Save new rate
    rate_new: any;
    field_rate_new = [];
    validation_rate = [];
    validation_rate_save: any;
    disable_rates = false; //It's enabled
    rateValue:string = '';

    showPagination : boolean = true;
    myUrl : string;
    messageOpacity  = 1;
    @ViewChild('pagination') myPag;
    myCurrentPage : number = 1;

    constructor(
        public _translationDetailService : translationDetailService , 
        public _editTranslations : editTranslations , 
        public _data_pagination: DataPagination,
        public pag: myPagination, 
        public http: Http, 
        public params: RouteParams, 
        public router: Router, 
        public _titleService: TitleService,
        public modal: Modal, 
        public load: LoadingGif, viewContainer: ViewContainerRef, 
        public location: Location, 
        private ngZone: NgZone,
        public _service: DataPropertiesTranslations
    ) {
        modal.defaultViewContainer = viewContainer; //Modal 

        //Store imported Title in local title
        this.title_page = _titleService.title_page;
        this.changeMyTitle(); //Update Title

        //ReSize event
        window.onresize = (e) => {
            ngZone.run(() => {
                /*this.get_size(); */
            });
        }; 

    } //Close constructor

    changeMyTitle() {
        this._titleService.change('Translations');
        console.log('User Title: ' + this._titleService.title_page);
    }

ngOnInit(){
    if ( this.location.path() == '/app/settings/translations') {
        this.restore_search();
    }

    if (this.location.path().indexOf(";") != -1 ) {
        this.myUrl = this.location.path().slice(0,this.location.path().indexOf(";"));
    } else {
        this.myUrl = this.location.path();
    }

    this.get_size();
    this.justchange = false;

    /////////////////////////////////////////////
    /// Open component at the top of the page ///
    $('html, body').animate({
       scrollTop: $("#scrollToHere").offset().top
    }, 0);

    //////////////////////////////////////
    /// Animation to Search extensible ///
    var s = $('.circle-animate-search input'),
        t = $('.search-circle-lupa input'),
        u = $('.open-search'),
        f = $('form'),
        a = $('.after'),
        c = $('.search-circle-lupa'),
        m = $('.text-search p'),
        x = $('.text-search-animate p'),
        z = $('.sidebar');

    s.focus(function(e){
        e.preventDefault();
        if( f.hasClass('open') ) return;
        m.hide();
        c.hide();
        a.show();
        x.show(); 
        s.addClass('search-background');
        f.addClass('in');
        setTimeout(function(){
            f.addClass('open');
            f.removeClass('in');
        }, 800);
    });

    t.focus(function(e){
        e.preventDefault();
        if( f.hasClass('open') ) return;
        m.hide();
        c.hide();
        a.show();
        x.show(); 
        s.addClass('search-background');
        f.addClass('in');
        setTimeout(function(){
            f.addClass('open');
            f.removeClass('in');
        }, 800);
    });

    u.on('click', function(e){
        e.preventDefault();
        if( f.hasClass('open') ) return;
        m.hide();
        c.hide();
        a.show();
        x.show(); 
        s.addClass('search-background');
        f.addClass('in');
        setTimeout(function(){
            f.addClass('open');
            f.removeClass('in');
        }, 800);
    });

    a.on('click', function(e){
        e.preventDefault();
        if( !f.hasClass('open')) return;
        s.val('');
        f.addClass('close');
        f.removeClass('open');
        s.removeClass('search-background');
        m.fadeIn();
        x.fadeOut();
        c.fadeIn(50);
        a.hide(1);
        setTimeout(function(){
            f.removeClass('close');
        }, 0);
    })

    z.on('click', function(e){
        if( !f.hasClass('open')) return;
        s.val('');
        f.addClass('close');
        f.removeClass('open');
        s.removeClass('search-background');
        m.fadeIn();
        c.fadeIn();
        x.hide();
        a.hide();
        setTimeout(function(){
            f.removeClass('close');
        }, 0);
    })

    f.submit(function(e){
        e.preventDefault();
        m.html('Search By Category or Provider').addClass('show');
        x.html('Search By Category or Provider').addClass('show');
        f.addClass('explode');
        setTimeout(function(){
            s.val('');
            f.removeClass('explode');
            m.removeClass('show');
            x.removeClass('show');
        }, 0);
    })
    
    if ( this.params.get('cp') ) {
        var letter = this._service.search_translations; //Store letter
        setTimeout(()=>{
            this._service.get_translations(letter,{ page : this.params.get('cp') })
            .map(data => {    
                this.myPag.pagination_mappings({ event:'search', _data_pagination: data });
             //this.pag.pagination_mappings({ event:'search', last_page: this._data_pagination.last_page, firstof_page:1 });
            }).subscribe();
        });
    } else {
        this.search_translations();
    }

    const searchBox = document.getElementById('searchBox');
    const searchLetters = Observable
      .fromEvent(searchBox, 'keyup');
      //.map(i => i);

    const debouncedInput = searchLetters.debounceTime(650);
    const subscribe = debouncedInput.subscribe(val => {
      this.search_translations();
       setTimeout(()=>{
         this.messageOpacity = 1;
      } , 800);
    });

   /// DISSAPEAR ON BACKSPACE ///
    searchLetters.subscribe((val : any) => {
        if (this._service._data_pagination.total_page == 0 ){
            if (val.which == 8){
                this.messageOpacity = 0;
            }
        }  
    });
    
} //Close ngOnInit

current_page_change(data){
        this._service.get_translations(this._service.search_translations, { page: data.selectedPage , type : data.type})
        .map(json_response =>
            this.myPag.pagination_mappings({
                 event : 'select' ,
                 _data_pagination : json_response,
                 from : 'translations',
                 cp : data.selectedPage
            }))
        .subscribe(); 
        this.myCurrentPage = data.selectedPage
        this.location.go(this.myUrl+';cp='+data.selectedPage);
    //Acá ejecuta el request en forma de observable, primero hace get_mappings y sólo cuando termina de hacer ese método retorna para seguir haciendo lo que está dentro del .map que es el método pagination_mappings que está dentro del subcomponent   
}

///////////////////////////////////////////////////////////////
/// Method for alocate div container of Mappings amenities ///
get_size(){
  var viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0); //width of viewport
  if(viewport_width < 1200){
    this.view_port_width_cur = false;
  } else if(viewport_width > 1200) {
    this.view_port_width_cur = true;
  }
}

//////////////////////////////////////////////////////////
/// Implementation for input Search Mappings amenities /// 
search_translations() {
    var setInverval_Variable;
    clearInterval(setInverval_Variable);
    setInverval_Variable = setInterval(this.search_function(), 500);
}

search_function() {
    //this._edit_cur.filteredListRelationships = []; //Reset filtered list
    //this._edit_cur.close_all(); //Try to close all opened previous boxes to start a new search
    var letter = this._service.search_translations; //Store letter
    this._service.get_translations(letter,{ page : 1})
    .map(data => {
         if ( data.numbers_of_pages > 1 ) {
           this.showPagination = true;
            setTimeout(()=>{
               this.myPag.pagination_mappings({ event:'search', _data_pagination: data });
            }, 500);
        } else {
           this.showPagination = false;
        }
        //this.pag.pagination_mappings({ event:'search', last_page: this._data_pagination.last_page, firstof_page:1 });
    }).subscribe(); //Call to request and call pagintation only after get the response.

         if (this.location.path().indexOf(";") != -1 ) {
            this.myUrl = this.location.path().slice(0,this.location.path().indexOf(";"));
        } else {
            this.myUrl = this.location.path();
        }

        if ( this.showPagination ) {
            this.location.go(this.myUrl+';cp='+1);
        }  
    }

    /// Restore the search once the search is closed (Luciano) ///
    restore_search(){
        this._service.search_translations = '';
        var letter = this._service.search_translations; //Store letter
        this.search_function();
    }

    keyDownFunction(event) {
        if(event.keyCode == 13) {
             event.preventDefault();
        }
    }

    goToDetail(code , name ) {
        let nm = name.replace(new RegExp('/', 'g'), ',');
        this.router.navigate(['/App', 'TranslationsDetail', {
            t: code,
            cp: this.myCurrentPage,
            n: nm
         }]);
       // this.router.navigateByUrl('/app/settings/translations-detail;t='+code+';n='+name);
        // this.location.go('/app/settings/translations-detail;t='+code+';n='+name);
    }

} // Close class Translations