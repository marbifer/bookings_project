import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import {FileDetail} from '../bworkspace/filedetail/filedetail';
import {BookingDetail} from '../bworkspace/bookingdetail/bookingdetail';
import {ModalAgency} from '../bworkspace/filedetail/modal_agency';
import {ModalAgencyBooking} from '../bworkspace/bookingdetail/modal_agency';
import {Agencies} from '../customers/list-agencies/agencies';
import {AgencyDetail} from '../customers/list-agencies/agency-detail/agency-detail';

declare var jQuery: any;
declare var $: any;

/////////////////////////////////////////////////////////////////
/// METHOD LOADING GIF ///

@Injectable()
export class RolloverAutocompletes{

constructor(public http:Http) {}

  //////////////////////////////////////////////////////////////////
  /// Rollover automcomplete for field Language => Agency Detail ///
  mouseover_color_text(text){
    var text_item = text+ ' a';
    var text_save = text+ ' a';
    jQuery(text_item).addClass('color-text');
    jQuery(text_save).addClass('color-text');
  }
  mouseleave_color_text(text){
    var text_item = text+ ' a';
    var text_save = text+ ' a';
    jQuery(text_item).removeClass('color-text');
    jQuery(text_save).removeClass('color-text');
  }
}