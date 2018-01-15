import {Component,  ViewEncapsulation, ViewContainerRef, NgZone , ViewChild ,  ElementRef } from '@angular/core';
import {TitleService } from '../../core/navbar/titles.service';
import {DataPropertiesInternalData} from './data_properties.service';
import {Widget } from '../../core/widget/widget';
import {RouteConfig, ROUTER_DIRECTIVES, RouteParams, Router } from '@angular/router-deprecated';
import {Modal, BS_MODAL_PROVIDERS as MODAL_P } from 'angular2-modal/plugins/bootstrap'; //Modal
import {Http, Headers, Response } from '@angular/http';
import myGlobals = require('../../../app');
import { Location } from '@angular/common';
import {Observable} from 'rxjs/Observable';
import {editInternalData} from './inline-internal-data/edit_forms_internal_data.service'; //Inline Editing All Internal Data
import {myPagination} from '../../settings/pagination-mappings/pagination.subcomponent';
import {DataPagination} from '../../settings/pagination-mappings/data_pagination.service';
import {pathName} from '../../core/sidebar/path_name.service'; //Service Unification All mappings and Internal Data (Listados simples

///////////////////////////
/// All internal Data ////
declare var tinymce: any;

@Component({
  selector: '[internal-data]',
  template: require('./internal-data.html'),
  styles: [require('./internal-data.scss')],
  directives: [ROUTER_DIRECTIVES, [Widget], [myPagination]],
  providers: [MODAL_P, Modal, DataPagination, DataPropertiesInternalData, InternalData, editInternalData] 
})

export class InternalData{

	//Title page
    title_page: any;
    checked = false; //Select All
    justchange: any; //just change icon to normal checkbox
    path_name: any; //Name of the Path without underscore
    internal_type: string;

    //Icon Delete Table Internal Data
    show_icon = false;

    //Control width of screens
    view_port_width_ame = true;

    showPagination: boolean = false;
    messageOpacity  = 1;
    myUrl: string;
    hideNewButton:boolean=false;
    @ViewChild('pagination') myPag;
    @ViewChild('cancelForChain') chainsLang; 

    constructor(
        public _data_pagination: DataPagination, 
        public params: RouteParams,
        public pag: myPagination, 
        public location: Location,
        public http: Http, 
        public _titleService: TitleService, 
        private ngZone: NgZone,
        public _edit_internal_data: editInternalData,
        public _internal2_service: DataPropertiesInternalData, 
        public _path_name: pathName

    ){
    	//Store imported Title in local title
        this.title_page = _titleService.title_page;

        this._edit_internal_data = _edit_internal_data;
        ////////////////////////////////////////////////////////////
        /// Call ngOnInit again after click on sidebar item menu ///
        this._path_name.reload_component.subscribe((name_of_item_menu) => { 
            if (name_of_item_menu == 'InternalAttractionCategories' || name_of_item_menu == 'InternalChains' || name_of_item_menu == 'InternalClassifications' || name_of_item_menu == 'InternalHotelCategories' || name_of_item_menu == 'InternalAccessibilities' ||  name_of_item_menu == 'InternalAmenities') {
               this.ngOnInit(); 
               this.showPagination = false;
            }
        });

        this.changeMyTitle(); //Update Title

        //ReSize event
        window.onresize = (e) => {
            ngZone.run(() => {
                this.get_size(); 
            });
        };      
    } 

    changeMyTitle() {
        this._titleService.change('Internal Data / Amenities');
        console.log('User Title: ' + this._titleService.title_page);       
    }

ngOnInit(){
    if (this.location.path().indexOf(";") != -1 ) {
        this.myUrl = this.location.path().slice(0,this.location.path().indexOf(";"));
    } else {
        this.myUrl = this.location.path();
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
        m.html('Search By Amenity').addClass('show');
        x.html('Search By Amenity').addClass('show');
        f.addClass('explode');
        setTimeout(function(){
            s.val('');
            f.removeClass('explode');
            m.removeClass('show');
            x.removeClass('show');
        }, 0);
    })

    setTimeout(() => { //Open First setTimeout
          
        if(this.location.path() == '/app/internal-data/amenities' || this.location.path() == '/app/internal-data/amenities;cp='+ this.params.get('cp')) { //Comparo en qué URL estoy
            //this._internal2_service.routeForNavigation = 'Amenities';
            this.internal_type = 'amenities'; //Guardo un String de referencia
            this._edit_internal_data.internal_type_request = 'amenities'; //Guardo un String de referencia para el servicio de edit
            this._internal2_service.internal_type_request_data = 'amenities'; //Guardo un String de referencia para el servicio del request
            this._titleService.change('Internal Data / Amenities'); //Cambio el título del Navbar en función del listado en el que esté 
            this.path_name = 'Amenities'; //Cambio el texto sin guiones bajos
                              
        } else if(this.location.path() == '/app/internal-data/accessibilities' || this.location.path() == '/app/internal-data/accessibilities;cp='+ this.params.get('cp')) { //Comparo en qué URL estoy
            //this._internal2_service.routeForNavigation = 'Accessibilities';
            this.internal_type = 'accessibilities'; 
            this._edit_internal_data.internal_type_request = 'accessibilities'; 
            this._internal2_service.internal_type_request_data = 'accessibilities'; 
            this._titleService.change('Internal Data / Accessibilities'); 
            this.path_name = 'Accessibilities';                                     
        }
        else if(this.location.path() == '/app/internal-data/attraction-categories' || this.location.path() == '/app/internal-data/attraction-categories;cp='+ this.params.get('cp')) { //Comparo en qué URL estoy
            //this._internal1_service.routeForNavigation = 'AttractionCategories';
            this.internal_type = 'attraction_categories'; //Guardo un String de referencia
            this._edit_internal_data.internal_type_request = 'attraction_categories'; //Guardo un String de referencia para el servicio de edit
            this._internal2_service.internal_type_request_data = 'attraction_categories'; //Guardo un String de referencia para el servicio del request
            this._titleService.change('Internal Data / Attraction Categories'); //Cambio el título del Navbar en función del listado en el que esté 
            this.path_name = 'Attraction Categories'; //Cambio el texto sin guiones bajos 
            
                              
        } else if(this.location.path() == '/app/internal-data/chains' || this.location.path() == '/app/internal-data/chains;cp='+ this.params.get('cp')) { //Comparo en qué URL estoy
            //this._internal1_service.routeForNavigation = 'Chains';
            this.internal_type = 'chains'; 
            this._edit_internal_data.internal_type_request = 'chains'; 
            this._internal2_service.internal_type_request_data = 'chains'; 
            this._titleService.change('Internal Data / Chains'); 
            this.path_name = 'Chains'; 
                                    
        }
        else if(this.location.path() == '/app/internal-data/classifications' || this.location.path() == '/app/internal-data/classifications;cp='+ this.params.get('cp')) { //Comparo en qué URL estoy
            //this._internal1_service.routeForNavigation = 'Classifications';
            this.internal_type = 'classifications'; 
            this._edit_internal_data.internal_type_request = 'classifications'; 
            this._internal2_service.internal_type_request_data = 'classifications'; 
            this._titleService.change('Internal Data / Classifications'); 
            this.path_name = 'Classifications'; 
                                
        }
        else if(this.location.path() == '/app/internal-data/hotel-categories' || this.location.path() == '/app/internal-data/hotel-categories;cp='+ this.params.get('cp')) { //Comparo en qué URL estoy
            //this._internal1_service.routeForNavigation = 'Hotel Categories';
            this.internal_type = 'hotel_categories'; 
            this._edit_internal_data.internal_type_request = 'hotel_categories'; 
            this._internal2_service.internal_type_request_data = 'hotel_categories'; 
            this._titleService.change('Internal Data / Hotel Categories'); 
            this.path_name = 'Hotel Categories';                             
        }
        
    
    setTimeout(() => { //Open second setTimeout
        this._edit_internal_data.get_languages_forms();
        this.restore_search(); 

        if ( this.params.get('cp') ) {
            var letter = this._internal2_service.search_all_internal_data; //Store letter
            setTimeout(()=>{
                this._internal2_service.get_all_internal_data(letter,{ page : this.params.get('cp') })
                .map(data => { 
                    if ( data.numbers_of_pages > 1 ) {
                        this.recursively_pagination_mappings_clearCol(data);
                    }   
                }).subscribe();
            });
        } else {
            this.search_internal_data();           
        }
       }, 100); //Close second setTimeout    
 }, 100); //Close first setTimeout


    /// Search box ///
    const searchBox = document.getElementById('searchBox');
    const searchLetters = Observable
      .fromEvent(searchBox, 'keyup');
      //.map(i => i);

    const debouncedInput = searchLetters.debounceTime(650);
    const subscribe = debouncedInput.subscribe(val => {
      this.search_function();
       setTimeout(()=>{
         this.messageOpacity = 1;
      } , 800);
    });

    /// DISSAPEAR ON BACKSPACE ///
    searchLetters.subscribe((val : any) => {
        if (this._internal2_service._data_pagination.total_page == 0 ){
            if (val.which == 8){
                this.messageOpacity = 0;
            }
        }  
    });

setTimeout(()=>{
    $("#new-amenity-button").click(()=>{
        if ( this._edit_internal_data.languages != undefined ) { 
            for (var p = 0; p < this._edit_internal_data.languages.length; ++p) {
                 if ( this.internal_type == 'chains' &&   this._edit_internal_data.languages[p].name != 'English') {
                    $('#cancelnew'+ this._edit_internal_data.languages[p].name).attr("style", 'display : none !important' );
                    $('#newamenity'+ this._edit_internal_data.languages[p].name).attr("style", 'display : none !important' );
                  }
              }
             } else {
                 setTimeout(()=>{
                     $("#new-amenity-button").click();
                 } , 500);
             }
        if ( this._edit_internal_data.save_amenity_error  == true ) {
            this.cancel_new_amenity();
        }
    });
    this.recursively_check_close_new_inTransition();
    this.recursively_cancel_new_amenity();
} , 150);

} //Close ngOnInit
///////////////////////////////////////////////////////////////
recursively_check_close_new_inTransition() {
    if ( this._internal2_service.amenities != undefined ) { 
        this.close_new_inTransition();
    } else {
        setTimeout(()=>{
            this.recursively_check_close_new_inTransition();
        }, 400);
    }
}
//Keep only corresponding language for the new form
// recursively_hide_languages() {
//     if ( this._edit_internal_data.languages != undefined ) { 
//         for (var p = 0; p < this._edit_internal_data.languages.length; ++p) {
//              if ( this.internal_type == 'chains' &&   this._edit_internal_data.languages[p].name != 'English') {
//                 $('#cancelnew'+ this._edit_internal_data.languages[p].name).attr("style", 'display : none !important' );
//                 $('#newamenity'+ this._edit_internal_data.languages[p].name).attr("style", 'display : none !important' );
//               }
//           }
//      } else {
//          setTimeout(()=>{
//             this.recursively_hide_languages();
//         }, 1000);
//      }
// }
//Keep close new forms
recursively_cancel_new_amenity() {
    console.log(' this._edit_internal_data.languages :'+ this._edit_internal_data.languages );
    if ( this._edit_internal_data.languages != undefined ) { 
        this.cancel_new_amenity();
    } else {
            this._edit_internal_data.get_languages_forms();
            setTimeout(()=>{
                this.recursively_cancel_new_amenity();
            }, 600);
    }
}
// Check if myPag exist y clearCollapsables
recursively_pagination_mappings_clearCol(data){
    if ( data.numbers_of_pages > 1) {
        if (  this._internal2_service.amenities != undefined ){
           this.showPagination = true;
        }
        if ( this.myPag != undefined && this._internal2_service.amenities != undefined ){
            if ( data.numbers_of_pages > 1 ) {
                this.myPag.pagination_mappings({ event:'search', _data_pagination: data });
            } else {
               this.showPagination = false;
            }
            this._internal2_service.clearCollapsables();
        } else {
            setTimeout(()=>{
                this.recursively_pagination_mappings_clearCol(data);
            }, 400);
        }
    }
}

current_page_change(data){
    this._internal2_service.get_all_internal_data(data.letter, { page: data.selectedPage , type : data.type})
    .map(json_response =>{
            this.myPag.pagination_mappings({
                 event : 'select' ,
                 _data_pagination : json_response
            });
            // this.charge_details();   CAMBIARRRRRRRR!!!!!!!!!!
            }
        ).subscribe(); 
    this.unselect_all();
    this._internal2_service.clearCollapsables();
    this.location.go(this.myUrl+';cp='+data.selectedPage);
    //Acá ejecuta el request en forma de observable, primero hace get_mappings y sólo cuando termina de hacer ese método retorna para seguir haciendo lo que está dentro del .map que es el método pagination_mappings que está dentro del subcomponent   
}

save_amenity(){
    this._edit_internal_data.save_internal_amenity()
    .map(data => {
        setTimeout(()=>{
            this.cancel_new_amenity();
            this.hideNewButton = false;
            this.recursively_pagination_mappings_clearCol(this._data_pagination);
        } , 3000)
    }).subscribe();
}

edit_amenity( index , code ){
    this._edit_internal_data.edit_internal_amenity( index , code)
        .map(data => {
            setTimeout(()=>{
                this._edit_internal_data.edit_errors[index] = data;
                for (var i = 0; i < this._edit_internal_data.languages.length; ++i) {
                      if ( this._edit_internal_data.languages[i].name != 'English') {
                        $('#error'+this._edit_internal_data.languages[i].code+index).hide();
                      } else {
                        $('#error'+this._edit_internal_data.languages[i].code+index).show();
                      }
                }
                    // this.charge_details();
            });
        }).subscribe();
}

loadAmenity(code, i) {
    setTimeout(()=>{
         for (var p = 0; p < this._edit_internal_data.languages.length; ++p) {
             if ( this.internal_type == 'chains' &&   this._edit_internal_data.languages[p].name != 'English') {
                  // $('#cancel'+ this._edit_internal_data.languages[p].name+i).hide();
                  $('#cancel'+ this._edit_internal_data.languages[p].name+i).attr("style", 'display : none !important' );
              }
          }
    });
    if (!$("#editAmenity"+i).hasClass('in')) {
        this._internal2_service.showTd[i] = true;
        this._edit_internal_data.get_internal_data_translations(code)
            .map(data => {
                  for (var p = 0; p < data.length; ++p) {
                      $("#"+data[p].lang_code+i).val(data[p].name);
                      $("#description"+data[p].lang_code+i).val(data[p].description);

                  }
            }).subscribe();
    } else {
        setTimeout(()=>{
            this._internal2_service.showTd[i] = false;
        } , 250);
    }
}


close_new_inTransition(){
    if ( $('#newAmenity').hasClass('in')) {
        $('#new-amenity-button').click();
    }
}

cancel_new_amenity(){
    this.hideNewButton = false;
    this._edit_internal_data.save_amenity_error = false;
    for (var h = 0; h < this._edit_internal_data.languages.length; ++h) {
        $('.error'+this._edit_internal_data.languages[h].name).hide();
        $('#'+this._edit_internal_data.languages[h].name).removeClass('border-errors');
        $('#'+this._edit_internal_data.languages[h].name).val('');
        $('#description'+this._edit_internal_data.languages[h].name).val('');
        if ( ! $('#cancelnew'+this._edit_internal_data.languages[h].name).hasClass('collapsed')  ) {
            $('#cancelnew'+this._edit_internal_data.languages[h].name).click();
        }
    }
    this.close_new_inTransition();
}
cancel_editAmenity(code , index ) {
     for (var i = 0; i < this._edit_internal_data.languages.length; ++i) {
        if ( this._edit_internal_data.languages[i].name == 'English') {
            this._edit_internal_data.edit_errors[index] = '';
            $('#error'+this._edit_internal_data.languages[i].code+index).hide();
            jQuery('#'+this._edit_internal_data.languages[i].code+index).removeClass('border-errors');
        } 
    }

    // for (var w = 0; w < this._edit_internal_data.languages.length; ++w) {
    // // alert(".error"+this._edit_internal_data.languages[w].name+index);
    //     $('#error'+this._edit_internal_data.languages[w].code+index).css( "visibility" , "hidden" );
    //     // $('#error'+this._edit_internal_data.languages[w].code+index).hide();
    //     // myGlobals.alertTravtion('#error'+this._edit_internal_data.languages[w].code+index);
    //     $('#error'+this._edit_internal_data.languages[w].code+index).css('display' , 'none');
    //     if ( ! $('#cancel'+this._edit_internal_data.languages[w].name+index).hasClass('collapsed')  ) {
    //         $('#cancel'+this._edit_internal_data.languages[w].name+index).click();
    //     }
    // }
    this._edit_internal_data.updated_form_error[index] = false;
    this.loadAmenity(code, index);

    setTimeout(()=>{
        $('#'+index+'icon-edit').click();
        this._internal2_service.showTd[index] = false;
    } , 1000);
}
// charge_details() {
//     for (var k = 0; k < this._internal2_service.amenities.length; ++k) {
//         this._edit_internal_data.get_internal_data_translations( this._internal2_service.amenities[k].code , k )
//         .map(data => {
//                 for (var j = 0 ; j < data.amenity_translation.length ; ++j) {
//                     $('#'+data.amenity_translation[j].lang_code+data.index).val(data.amenity_translation[j].name);
//                     $('#description'+data.amenity_translation[j].lang_code+data.index).val(data.amenity_translation[j].description);
//                 }
//         }).subscribe();
//     }
// }
/////////////////////////////////////////////////////////
/// Method for alocate div container of Internal Data ///
get_size(){
  var viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0); //width of viewport
  if(viewport_width < 1200){
    this.view_port_width_ame = false;
  } else if(viewport_width > 1200) {
    this.view_port_width_ame = true;
  }
}

/////////////////////////////////////////////////////////
/// Implementation for input Search All internal Data /// 
search_internal_data() {
    var setInverval_Variable;
    clearInterval(setInverval_Variable);
    setInverval_Variable = setInterval(this.search_function(), 500);       
}

search_function() {
    /*this._edit_map.filteredListRelationships = []; //Reset filtered list
    this._edit_map.close_all() //Try to close all opened previous boxes to start a new search*/
    this._internal2_service.current_page=1;
    this._internal2_service.firstof_page=1;
    var letter = this._internal2_service.search_all_internal_data; //Store letter
    this._internal2_service.get_all_internal_data(letter,{ page : 1})
    .map(data => {
        // if ( data.numbers_of_pages > 1 ) {
        //    this.showPagination = true;
        // } else {
        //     this.showPagination = false;
        // }
        if ( data.numbers_of_pages > 1 ) {
            this.recursively_pagination_mappings_clearCol(data);
        } 
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
    this._internal2_service.search_all_internal_data = '';
    var letter = this._internal2_service.search_all_internal_data; //Store letter
    //this.search_function();
    this.unselect_all();// Unselect all checboxes selected
}

restore_searchBox(){
    this._internal2_service.search_all_internal_data = '';
    var letter = this._internal2_service.search_all_internal_data; //Store letter
    this.search_function();
    this.unselect_all();// Unselect all checboxes selected
}

////////////////////////////////////////////////////
/// Unselect All Checkboxs ///
unselect_all(){
    var inputs = jQuery('.check-table-ame-internal');
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
    $('.check-table-ame-internal:checked').attr('checked', 'true');
    var inputs = jQuery('.check-table-ame-internal');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked"); 
        if(checked == false){
            $('#checkbox' + i).trigger('click');
        }
    } 
}

////////////////////////////////////////////////////
/// Icon Delete of the Title ///
delete_all_mappings(code, type){
    var counter = 0;
    this._internal2_service.list_id = []; //Clean array
    var list_selected = [];
    this.show_icon = false; //Hide action Buttons
    var inputs = jQuery('.check-table-ame-internal');

    if(type == 'multiple'){       
        for(var i=0; i<inputs.length; i++){
            var checked = $('#checkbox' + i).is(":checked"); 
            if(checked == true){
                counter++;
                var id_content = $('#checkbox' + i).val();
                this._internal2_service.list_id.push(id_content);
                list_selected.push(i);
            }
        }

    var pageForDelete;       
    }else if(type == 'single'){
        this._internal2_service.list_id.push(code);
    }
    
    if (inputs.length == counter) {
        if (this._data_pagination.current_page == 1 ){
            pageForDelete = this._data_pagination.current_page;
        } else {
            pageForDelete = this._data_pagination.current_page - 1;
        }
    } else {
        pageForDelete = this._data_pagination.current_page;
    }
    

    ///////////////////////////////////////////////
    /// Request icon delete single or multiples ///
    var url;
    var body;
    if(this.internal_type == 'amenities'){ //Verify which Internal Data it is
        url = myGlobals.host+'/api/admin/internal_data/amenity/delete'; //Guardo la URL completa del listado correspondiente
        body = JSON.stringify({ amenity_codes: this._internal2_service.list_id });
    }
    else if(this.internal_type == 'accessibilities'){
        url = myGlobals.host+'/api/admin/internal_data/accessibility/delete';
        body=JSON.stringify({ accessibilities_codes: this._internal2_service.list_id });
    }
    else if(this.internal_type == 'attraction_categories'){ //Verify which mappings categories it is
        url = myGlobals.host+'/api/admin/internal_data/attraction_category/delete'; //Guardo la URL completa del listado correspondiente
        body = JSON.stringify({ attraction_category_codes: this._internal2_service.list_id });
    }
    else if(this.internal_type == 'chains'){ //Verify which mappings categories it is
        url = myGlobals.host+'/api/admin/internal_data/chain/delete'; //Guardo la URL completa del listado correspondiente
        body = JSON.stringify({ chain_codes: this._internal2_service.list_id });
    }
    else if(this.internal_type == 'classifications'){ //Verify which mappings categories it is
        url = myGlobals.host+'/api/admin/internal_data/classification/delete'; //Guardo la URL completa del listado correspondiente
        body = JSON.stringify({ classification_codes: this._internal2_service.list_id });
    }
    else if(this.internal_type == 'hotel_categories'){ //Verify which mappings categories it is
        url = myGlobals.host+'/api/admin/internal_data/hotel_category/delete'; //Guardo la URL completa del listado correspondiente
        body = JSON.stringify({ hotel_category_codes: this._internal2_service.list_id });
    }

    console.log('Body: Delete Internal data amenities: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    this.http.post( url, body, {headers: headers, withCredentials:true})
        .subscribe( 
          response => {
            this._internal2_service.get_all_internal_data(this._internal2_service.search_all_internal_data, { page: pageForDelete })
             .map(data => {   
                // data.current_page = pageForDelete;
                if ( data.numbers_of_pages > 1 ) {
                   this.myPag.pagination_mappings({ event:'search', _data_pagination: data });
                } else {
                   this.showPagination = false;
                }
             }).subscribe(); //Call request function and subscribe but not call another method after get a response.
            },
          (err) => {});
   
    this.location.go(this.myUrl+';cp='+pageForDelete);  
    this.justchange = false;
}

/////////////////////////////////////////////////////////
/// Icon Edit mouseover Table Internal Data amenities ///
mouseover_icon_edit(i){ 
  var icon_edit = '#' + i + 'icon-edit';
  jQuery(icon_edit).addClass('color-edit');
}

mouseleave_icon_edit(){
  jQuery('.fa-pencil').removeClass('color-edit');
}

//////////////////////////////////////////////////////
/// Show icon Delete table Internal Data amenities ///
show_icon_delete(){
  var inputs = jQuery('.check-table-ame-internal');
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
change_to_minus_maps(){
    var inputs = jQuery('.check-table-ame-internal');
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
    var url;
    var body;
    if(this.internal_type == 'amenities'){ //Verify which Interna Data it is
       url = myGlobals.host+'/api/admin/internal_data/amenity/change_status';
       body = JSON.stringify({ status: status, amenities_code: id });
    }
    else if(this.internal_type == 'accessibilities'){
        url = myGlobals.host+'/api/admin/internal_data/accessibility/change_status';
        body=JSON.stringify({ status: status, accessibilities_code: id });
    }
    else if(this.internal_type == 'attraction_categories'){ //Verify which mappings categories it is
       url = myGlobals.host+'/api/admin/internal_data/attraction_category/change_status';
       body = JSON.stringify({ status: status, attraction_categories_code: id });
    }
    else if(this.internal_type == 'chains'){ //Verify which mappings categories it is
       url = myGlobals.host+'/api/admin/internal_data/chain/change_status';
       body = JSON.stringify({ status: status, chains_code: id });
    }
    else if(this.internal_type == 'classifications'){ //Verify which mappings categories it is
       url = myGlobals.host+'/api/admin/internal_data/classification/change_status';
       body = JSON.stringify({ status: status, classifications_code: id });
    }
    else if(this.internal_type == 'hotel_categories'){ //Verify which mappings categories it is
       url = myGlobals.host+'/api/admin/internal_data/hotel_category/change_status';
       body = JSON.stringify({ status: status, hotel_categories_code: id });
    }
    
    console.log('Body del request del enabled-disabled: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post( url, body, {headers: headers, withCredentials:true})
    .map(
        response => {
            this._internal2_service.get_all_internal_data(this._internal2_service.search_all_internal_data, { page: this._data_pagination.current_page})
            .subscribe((json_response) => {
                console.log('Se habilita o inhabilita el checkbox')
            }, (err) => console.error(err),() =>
                this.caught_selected_inputs(selected_checkboxs));
                return this._internal2_service.list_id; //Send back response to the call of the method to use as event_type variable
        }, error => {}
    );
} //Close enabled_disabled_toggles

/////////////////////////////////////////////////////////////////////
/// Icons enabled-disables single of each checkboxes of the table ///
enabled_disabled_toogle(status, id){
    this._internal2_service.list_id = []; //Clean array
    this._internal2_service.list_id.push(id);
    var single_id = this._internal2_service.list_id;
    this._internal2_service.list_id = []; //Clean array
    var list_checked=[];
    var inputs = jQuery('.check-table-ame-internal');
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked");
        if(checked == true){
        	list_checked.push(i);
            var id_content = $('#checkbox' + i).val();
            this._internal2_service.list_id.push(id_content);
        }
    }
    console.log('Array de id amenities: ' + this._internal2_service.list_id);
    this.enabled_disabled_toggles(single_id, status, list_checked)
    .map(json_response =>
        console.log('Individual')).subscribe(); //Call request function
    this.justchange = false;
}

///////////////////////////////////////////////////
/// Enabled/disabled toogle multiple checkboxes ///
enabled_disabled_all(){
    this._internal2_service.toggle_status = !this._internal2_service.toggle_status; //If true change to false, If false change to true boolean
    var status = !this._internal2_service.toggle_status;
    this._internal2_service.list_id = []; //Clean array
    var inputs = jQuery('.check-table-ame-internal');  
    var list_checked =[];  
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked");
        if(checked == true){
        	list_checked.push(i);
            var id_content = $('#checkbox' + i).val();
            this._internal2_service.list_id.push(id_content);
        }
    }
    console.log('Array de id amenities' + this._internal2_service.list_id);
    var multiple_id = this._internal2_service.list_id;
    this.enabled_disabled_toggles(multiple_id, status, list_checked)
    .map(json_response =>
        console.log('Todos')).subscribe(); //Call request function
    this.justchange = false;
} //Close enabled_disabled_all

////////////////////////////////////////////////////////////////////////////////
/// Verify all selected checkbox who were selected and restore the selection ///
 caught_selected_inputs(id){
 	console.log('caught_selected_inputs' +id);
    setTimeout(function(){
        var inputs = jQuery('.check-table-ame-internal');        
            for(var x=0; x<id.length; x++){
                    $('#checkbox' + id[x]).trigger('click');
            }
    }, 500)
} //Close caught_selected_inputs

/////////////////////////////////////////////////
/// Button is-filtrable ///
request_change_state_is_filtrable(status, list_ids){
    var url;
    var body;
    if(this.internal_type == 'amenities'){ //Verify which Internal Data it is
        url = myGlobals.host+'/api/admin/internal_data/amenity/change_is_filtrable';
        body=JSON.stringify({ is_filtrable: status, amenities_code: list_ids});
    }
    else if(this.internal_type == 'accessibilities'){
        url = myGlobals.host+'/api/admin/internal_data/accessibility/change_is_filtrable';
        body=JSON.stringify({ is_filtrable: status, accessibilities_code: list_ids});
    }

    console.log('Body del request del export_to_excel: ' + body);
    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post( url, body, {headers: headers, withCredentials:true})
    .map(
        response => {
            console.log(response.json());
            this._internal2_service.get_all_internal_data(this._internal2_service.search_all_internal_data, { page : this._data_pagination.current_page } )
            .subscribe();
        });
    }

change_state_is_filtrable_all(status){
    console.log('Change state is filtrable ALL');
    this._internal2_service.is_filtrable_status = status;
    this._internal2_service.list_id = []; //Clean array
    var list_checked = [];
    var inputs = jQuery('.check-table-ame-internal');    
    for(var i=0; i<inputs.length; i++){
        var checked = $('#checkbox' + i).is(":checked");
        if(checked == true){            
            var id_content = $('#checkbox' + i).val();
            list_checked.push(i);
            this._internal2_service.list_id.push(id_content);
        }
    }
    console.log('Array de id amenities: ' + this._internal2_service.list_id);
    var multiple_id = this._internal2_service.list_id;
    this.request_change_state_is_filtrable(status, this._internal2_service.list_id)
    .map(json_response =>
        console.log('Todos')).subscribe((json_response) => {
        }, (err) => console.error(err),() =>
            this.caught_selected_inputs(list_checked));               
    }

change_state_is_filtrable(status, code, select_all){
    if (select_all == false){            
        this._internal2_service.list_id = []; //Clean array
        this._internal2_service.list_id.push(code);
    } else {            
        this._internal2_service.list_id=code;
    }
    this.request_change_state_is_filtrable(status, this._internal2_service.list_id)
.map(json_response => {}).subscribe(); 
}

keyDownFunction(event) {
    if(event.keyCode == 13) {
         event.preventDefault();
    }
}

hide_new_button(){
    this.hideNewButton = true;
}

}
