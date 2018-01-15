import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, OnInit, NgZone , ViewChild , OnDestroy} from '@angular/core';
import {Widget} from '../../core/widget/widget';
import {RouteConfig, ROUTER_DIRECTIVES, RouteParams, Router} from '@angular/router-deprecated';
import {Http, Headers, Response} from '@angular/http';
import {Idle, DEFAULT_INTERRUPTSOURCES} from 'ng2-idle/core'; //For timeout
import {DialogRef} from 'angular2-modal';
import {Observable} from 'rxjs/Observable';
import {CustomHttp} from '../../services/http-wrapper';
import myGlobals = require('../../../app');
import {NKDatetime} from 'ng2-datetime/ng2-datetime'; //Datepicker
import {ACCORDION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {NgClass} from '@angular/common';
import {Modal, BS_MODAL_PROVIDERS as MODAL_P} from 'angular2-modal/plugins/bootstrap'; //Modal
import {Core} from '../../core/core';
import {Location} from '@angular/common';
import {LoadingGif} from '../../bworkspace/filedetail/loading_gif.service';
import {DataPropertiesPriceRules} from './data_properties.service';
import {editPriceRules} from './price-rules-detail/inline-price-rules/edit_price_rules.service'; //Inline Editing Price rules
import {PriceDetailSubcomponent} from './price-datail.subcomponent'; //Inline Editing Price rules
import {Autocomplete} from './price-rules-detail/autocomplete-subcomponent/autocomplete.subcomponent';
import {TitleService} from '../../core/navbar/titles.service';
import {myPagination} from './../pagination-mappings/pagination.subcomponent';
import {DataPagination} from './../pagination-mappings/data_pagination.service';

declare var jQuery: any;
declare var $: any;

///////////////////
/// Price Rules ///
@Component({
  selector: '[price-rules]',
  template: require('./price-rules.html'),
  styles: [require('./price-rules.scss')],
  directives: [ROUTER_DIRECTIVES, [Widget], NKDatetime, [myPagination], Autocomplete, PriceDetailSubcomponent],
  providers: [MODAL_P, Modal, DataPagination, PriceDetailSubcomponent] 
})

export class PriceRules {

    //Title page
    title_page: any;
    checked = false; //Select All
    justchange: any; //just change icon to normal checkbox

    //Icon Delete Table Mappings amenities
    show_icon = false;
    disabled_loc = false; //It's enabled
    selected_c = [];

    //Control width of screens
    view_port_width = true;

    showPagination : boolean = true;
    myUrl : string;
    messageOpacity  = 1;

    clean_data= false;
    list_object:any;
    clone: boolean = false;
    @ViewChild('pagination') myPag;
    @ViewChild('length_of_filteredList') len;

    constructor(
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
        public _edit_price: editPriceRules,
        public _service: DataPropertiesPriceRules, 
        public _autocompletes: Autocomplete, 
        public PriceDetail: PriceDetailSubcomponent       
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
        this._titleService.change('Price Rules');
        console.log('User Title: ' + this._titleService.title_page);
    }

ngOnInit(){
    if ( this.location.path() == '/app/settings/price-rules') {
        this.restore_search();
    }

    if (this.location.path().indexOf(";") != -1 ) {
        this.myUrl = this.location.path().slice(0,this.location.path().indexOf(";"));
    } else {
        this.myUrl = this.location.path();
    }

    if ( this.params.get("pr_name") != undefined ) {
        this._service.search_price_rules =  this.params.get("pr_name");
        setTimeout(()=>{
            this.get_data_price_rules(this.params.get("pr_code") , 0 );
        } , 1000);
    }

    if (this.params.get("prCode")) {
        this.clone = true;
        this._edit_price.get_data_price_rules(this.params.get("prCode"), 99);
        setTimeout(()=>{
            $("#new-pricerules-button").click();
        } , 2000);
    }

    this.get_size();
    this.justchange = false;
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
        m.html('Search for Price rules').addClass('show');
        x.html('Search for Price rules').addClass('show');
        f.addClass('explode');
        setTimeout(function(){
            s.val('');
            f.removeClass('explode');
            m.removeClass('show');
            x.removeClass('show');
        }, 0);
    })
    
    if (this.params.get('cp')) {

        var letter = this._service.search_price_rules; //Store letter
        //setTimeout(()=>{
            this._service.get_price_rules(letter, {page: this.params.get('cp')})
            .map(data => {
            if(data.numbers_of_pages > 1){
                this.hide_detail();
                this.showPagination = true;
                setTimeout(()=>{
                    this.myPag.pagination_mappings({event:'search', _data_pagination: data});              
                }, 1000);
            } 
            else {
               this.showPagination = false; 
               this.hide_detail();
            }                 
                //this.pag.pagination_mappings({ event:'search', last_page: this._data_pagination.last_page, firstof_page:1 });
            }).subscribe();
       // });
    } else {
        this.hide_detail();
        this.search_price_rules();    
    }

    const searchBox = document.getElementById('searchBox');
    const searchLetters = Observable
      .fromEvent(searchBox, 'keyup');
      //.map(i => i);

    const debouncedInput = searchLetters.debounceTime(650);

    const subscribe = debouncedInput.subscribe(val => {
      this.search_price_rules();
       setTimeout(()=>{
         this.messageOpacity = 1;
      } , 800);
    });

  /*DISSAPEAR ON BACKSPACE*/
    searchLetters.subscribe((val : any) => {
        if (this._service._data_pagination.total_page == 0 ){
            if (val.which == 8){
                this.messageOpacity = 0;
            }
        }  
    });
} //Close ngOnInit


current_page_change(data){
        this._service.get_price_rules(this._service.search_price_rules, { page: data.selectedPage , type : data.type})
        .map(json_response =>
            this.myPag.pagination_mappings({
                 event : 'select' ,
                 _data_pagination : json_response,
                 from : 'price-rules',
                 cp : data.selectedPage
            }))
        .subscribe(); 

        this.location.go(this.myUrl+';cp='+data.selectedPage);
    //Acá ejecuta el request en forma de observable, primero hace get_mappings y sólo cuando termina de hacer ese método retorna para seguir haciendo lo que está dentro del .map que es el método pagination_mappings que está dentro del subcomponent   
}

///////////////////////////////////////////////////////////////
/// Method for alocate div container of Mappings amenities ///
get_size(){
  var viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0); //width of viewport
  if(viewport_width < 1200){
    this.view_port_width = false;
  } else if(viewport_width > 1200) {
    this.view_port_width = true;
  }
}

//////////////////////////////////////////////////////////
/// Implementation for input Search Mappings amenities /// 
search_price_rules() {
    var setInverval_Variable;
    clearInterval(setInverval_Variable);
    setInverval_Variable = setInterval(this.search_function(), 500);
}

search_function() {
    var letter = this._service.search_price_rules; //Store letter
    this._service.get_price_rules(letter,{ page : 1})
    .map(data => {
        if ( data.numbers_of_pages > 1 ) {
           this.showPagination = true;
            setTimeout(()=>{
               this.myPag.pagination_mappings({ event:'search', _data_pagination: data });
            }, 500);
        } else {
           this.showPagination = false;
        }  
        this.hide_detail(); //Hide form after data
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
    this._service.search_price_rules = '';
    var letter = this._service.search_price_rules; //Store letter
    this.search_function();
    this.unselect_all();// Unselect all selected checboxes
}

keyDownFunction(event) {
    if(event.keyCode == 13) {
         event.preventDefault();
    }
}

////////////////////////////////////////////////////
/// Unselect All Checkboxs ///
unselect_all(){
    var inputs = jQuery('.check-table-pr');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked"); 
        if(checked == true){
            $('#checkbox' + i).trigger('click');
        }
    } 
}

////////////////////////////////////////////////////
/// Select All (Checkbox) ////
select_all(){
    $('.check-table-pr:checked').attr('checked', 'true');
    var inputs = jQuery('.check-table-pr');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked"); 
        if(checked == false){
            $('#checkbox' + i).trigger('click');
        }
    } 
}

////////////////////////////////////////////////////
/// Icon Delete of the Title ///
deletePriceRulesAll(){
    this._service.list_id = []; //Clean array
    var list_selected=[];
    var inputs = jQuery('.check-table-pr');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked"); 
        if(checked == true){
            var id_content = $('#checkbox' + i).val();
            this._service.list_id.push(id_content);
            list_selected.push(i);
        }
    }

    var pageForDelete;

    let url = myGlobals.host+'/api/admin/settings/price_rule/delete';
    let body=JSON.stringify({ list_price_rules_code: this._service.list_id });
    console.log('Body: Delete Price Rules: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    this.http.post( url, body, {headers: headers, withCredentials:true})
    .subscribe( 
        response => {
          this._service.get_price_rules(this._service.price_rules.search_price_rules, { page: pageForDelete })
           .map(data => 
          {    
              data.current_page = pageForDelete;
              if ( data.numbers_of_pages > 1 ) {
                 this.myPag.pagination_mappings({ event:'search', _data_pagination: data });
              } else {
                 this.showPagination = false;
              }
           }).subscribe(); //Call request function and subscribe but not call another method after get a response.
          },
        (err) => {});

    this.location.go(this.myUrl+';cp='+pageForDelete);  
    
    this.justchange= false;
    this.show_icon = false;
}

///////////////////////////////////////
//////// Request delete users ////////
deletePriceRule(id){
    this._service.list_id = []; //Clean array
    this._service.list_id.push(id);
    var single_id = this._service.list_id;
    this._service.list_id = []; //Clean array
    var inputs = jQuery('.check-table-pr');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked");
        if(checked == true){
            var id_content = $('#checkbox' + i).val();
            this._service.list_id.push(id_content);
        }
    }

    var pageForDelete;
    let url = myGlobals.host+'/api/admin/settings/price_rule/delete';
    let body=JSON.stringify({ list_price_rules_code: id });
    console.log('Body: Delete Price Rules: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    this.http.post( url, body, {headers: headers, withCredentials:true})
    .subscribe( 
        response => {
          this._service.get_price_rules(this._service.price_rules.search_price_rules, { page: pageForDelete })
           .map(data => 
          {    
              data.current_page = pageForDelete;
              if ( data.numbers_of_pages > 1 ) {
                 this.myPag.pagination_mappings({ event:'search', _data_pagination: data });
              } else {
                 this.showPagination = false;
              }
           }).subscribe(); //Call request function and subscribe but not call another method after get a response.
          },
        (err) => {});

    this.location.go(this.myUrl+';cp='+pageForDelete);  
    
    this.justchange= false;
    this.show_icon = false;
} //Close delete users

//////////////////////////////////////////////////
/// Show icon Delete table Mappings amenities ///
show_icon_price_rules(){
    var inputs = jQuery('.check-table-pr');
    var count_true = 0;
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked"); 
        if(checked == true){
            count_true++; //Count checkbox checked
            this.show_icon = true;
        }
    } 
    if(inputs.length == count_true){//If all inputs are check
        console.log('Estan todos seleccionados');            
        this.show_icon = true;
    } else if(count_true == 0){ //If all inputs are unchecked
        console.log('Estan todos deseleccionados');           
        this.show_icon = false;
    }
}

/////////////////////////////////////////////////
/// Select All: Change ckeckbox by icon-minus ///
change_to_minus(){
    var inputs = jQuery('.check-table-pr');
    var count_true = 0;
        for(var i=0; i<inputs.length; i++){
            var checked = $('#checkbox' + i).is(":checked"); 
            if(checked == true){
              count_true++; //Count checkbox checked
            }
        } 
        if(inputs.length == count_true){//If all inputs are check
            console.log('Estan todos seleccionados');            
            this.justchange= true;
        } else if(count_true == 0){ //If all inputs are unchecked
            console.log('Estan todos deseleccionados');           
            this.justchange= false;
        } else{ //If some input is unckeched         
            this.justchange = 'minus';
        }
}

//////////////////////////////////////
/// Request icons enabled-disabled ///
enabled_disabled_toggles(id, status, selected_checkboxs){
    let url = myGlobals.host+'/api/admin/settings/price_rule/change_status';
    let body=JSON.stringify({ status: status, list_price_rules_code: id });
    console.log('Body del request del enabled-disabled: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post( url, body, {headers: headers, withCredentials:true})
    .map(
        response => {
            this._service.get_price_rules(this._service.search_price_rules, { page: this._data_pagination.current_page})
            .subscribe((json_response) => {
                console.log('Se habilita o inhabilita el checkbox')
            }, (err) => console.error(err),() =>
                this.caught_selected_inputs(selected_checkboxs));
                return this._service.list_id; //Send back response to the call of the method to use as event_type variable
        }, error => {}
    );
} //Close enabled_disabled_toggles

///////////////////////////////////////////////////
/// Enabled/disabled toogle multiple checkboxes ///
enabled_disabled_all(){
    this._service.toggle_status = !this._service.toggle_status; //If true change to false, If false change to true boolean
    var status = !this._service.toggle_status;
    this._service.list_id = []; //Clean array
    var inputs = jQuery('.check-table-pr');  
    var list_checked =[];  
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked");
        if(checked == true){
        	list_checked.push(i);
            var id_content = $('#checkbox' + i).val();
            this._service.list_id.push(id_content);
        }
    }
    console.log('Array de id price rules' + this._service.list_id);
    var multiple_id = this._service.list_id;
    this.enabled_disabled_toggles(multiple_id, status, list_checked)
    .map(json_response =>
        console.log('Todos')).subscribe(); //Call request function
    this.justchange = false;
} //Close enabled_disabled_all

/////////////////////////////////////////////////////////////////////
/// Icons enabled-disables single of each checkboxes of the table ///
enabled_disabled_toggle(id, status){
    this._service.list_id = []; //Clean array
    this._service.list_id.push(id);
    var single_id = this._service.list_id;
    this._service.list_id = []; //Clean array
    var list_checked=[];
    var inputs = jQuery('.check-table-pr');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked");
        if(checked == true){
        	list_checked.push(i);
            var id_content = $('#checkbox' + i).val();
            this._service.list_id.push(id_content);
        }
    }
    console.log('Array de id Price Rules: ' + this._service.list_id);
    this.enabled_disabled_toggles(single_id, status, list_checked)
    .map(json_response =>
        console.log('Individual')).subscribe(); //Call request function
    this.justchange = false;
}

////////////////////////////////////////////////////////////////////////////////
/// Verify all selected checkbox who were selected and restore the selection ///
caught_selected_inputs(id){
 	console.log('caught_selected_inputs' +id);
    setTimeout(function(){
        var inputs = jQuery('.check-table-pr');        
            for(var x=0; x<id.length; x++){
                $('#checkbox' + id[x]).trigger('click');
            }
    }, 500)
} //Close caught_selected_inputs

//////////////////////////////////////////////////
/////// Icon Ellipsis on Table List Users ///////
showEllipsisIcon(i){
    var withEllipsis = '#' + i + 'ellipsisIcon';
    /*jQuery(withEllipsis).show();*/
    jQuery(withEllipsis).addClass('hovered-ellipsis-icon');
}

hideEllipsisDropdown(){
    /*jQuery('.prueba').removeClass('open');
    jQuery('.ellipsis-icon').removeClass('focused-ellipsis-icon');*/
    jQuery('#priceRules .ellipsis-wrapper').removeClass('open');
    jQuery('#priceRules .ellipsis').removeClass('focused-ellipsis-icon');
    jQuery('#priceRules .ellipsis').removeClass('hovered-ellipsis-icon');
}

focusEllipsis(i){
    var withEllipsis = '#' + i + 'ellipsisIcon';
    jQuery(withEllipsis).toggleClass('focused-ellipsis-icon');
}

removeOpenedEllipsis(i){
    var withEllipsis = '#' + i + 'ellipsisIcon';
    jQuery(withEllipsis).removeClass('focused-ellipsis-icon');
    jQuery('#priceRules .ellipsis-wrapper').removeClass('open')
  }

////////////////////////////////////////////////
/// Request get data: Form PRICE RULES EXIST ///
//Trae el request 
get_data_price_rules(code, i){
    this._edit_price.remove_class[i] = false;
    this._edit_price.get_data_price_rules(code, i); 
}

hide_detail(){
    for(var i=0; i<=this._service.count_price_rules; i++){
        this._edit_price.remove_class[i] = true;
    }
}
remove_autocomplete(){
    //this.clean_data=true;
    //this.clean_data=false;
    //this.len.length_of_filteredList = '';
    this._edit_price.remove_data('');
}

open_new_detail(){
    if ( this.clone == true) {
    } else {
        this._edit_price.open_new_detail();
    }
}

onNotify(message):void {
    this.list_object = message;
  }

open_load_new(prCode) {
    window.open(myGlobals.DOMAIN+this.myUrl+";prCode="+prCode+";cp="+this.params.get("cp"));
//     this.router.navigate(['/App', 'PriceRules', {
//     prc: prCode,
//     cp: this.params.get("cp")
// }]);
}

/////////////////////////////////////////////
/// Icons of the table for Ext. Providers ///
mouseover_icons(icons){
    var icon = 'i.' + icons;
    jQuery(icon).tooltip('show');
}
mouseleave_icons(icons){
    var icon = 'i.' + icons;
    jQuery(icon).tooltip('hide');
}

} // Close class Price Rules