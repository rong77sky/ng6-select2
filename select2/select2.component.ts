import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, ElementRef,
  ViewChild, AfterViewInit, OnChanges, OnDestroy, EventEmitter, Renderer2, SimpleChanges} from '@angular/core';
import { Select2OptionData} from './select2.interface';
// declare var jQuery: any;
// declare var $: any;
import 'select2';
import * as jQuery from 'jquery';


@Component({
  selector: 'app-select2',
  templateUrl: './select2.component.html',
  styleUrls: ['./select2.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Select2Component implements AfterViewInit, OnChanges, OnDestroy, OnInit {

  @ViewChild('selector') selector: ElementRef;

  // data for select2 drop down
  @Input() data: Array<Select2OptionData>;

  // value for select2
  @Input() value: string | string[];

  // enable / disable default style for select2
  @Input() cssImport = false;

  // width of select2 input
  @Input() width: string;

  // enable / disable select2
  @Input() disabled = false;

  // all additional options
  @Input() options: JQuery;

  // emitter when value is changed
  @Output() valueChanged = new EventEmitter();

  private element: JQuery = undefined;
  private check = false;
  private style = 'CSS';

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    if (this.cssImport) {
      const head = document.getElementsByTagName('head')[0];
      const link: any = head.children[head.children.length - 1];

      if (!link.version) {
        const newLink = this.renderer.createElement('style');
        this.renderer.setProperty(newLink, 'type', 'text/css');
        this.renderer.setProperty(newLink, 'version', 'select2');
        this.renderer.setProperty(newLink, 'innerHTML', this.style);
        this.renderer.appendChild(head, newLink);
      }

    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.element) {
      return;
    }

    if (changes['data'] && JSON.stringify(changes['data'].previousValue) !== JSON.stringify(changes['data'].currentValue)) {
      this.initPlugin();

      const newValue = this.element.val();
      // data is async. after data has been loaded show init value
      this.setElementValue(this.value);
    }

    if (changes['value']) {
      let length_equal = true;
      let element_equal = true;
      let string_equal = true;
      if ( Array.isArray(changes['value'].currentValue) && Array.isArray(changes['value'].previousValue) ) {
        length_equal = changes['value'].previousValue.length === changes['value'].currentValue.length;
        element_equal = changes['value'].previousValue.every(x => changes['value'].currentValue.includes(x));
      } else {
        string_equal = changes['value'].previousValue === changes['value'].currentValue;
      }
      if ( !(length_equal && element_equal) || !string_equal) {
        const newValue: string = changes['value'].currentValue;

        this.setElementValue(newValue);
        this.valueChanged.emit({
          value: newValue,
          data: this.element.select2('data')
        });
      }
    }

    if (changes['disabled'] && changes['disabled'].previousValue !== changes['disabled'].currentValue) {
      this.renderer.setProperty(this.selector.nativeElement, 'disabled', this.disabled);
    }
  }

  ngAfterViewInit() {
    this.element = jQuery(this.selector.nativeElement);
    this.initPlugin();
    if (typeof this.value !== 'undefined') {
      this.setElementValue(this.value);
    }

    this.element.on('select2:select select2:unselect', () => {
      this.valueChanged.emit({
        value: this.element.val(),
        data: this.element.select2('data')
      });
    });
  }

  ngOnDestroy() {
    this.element.off('select2:select');
  }
  private initPlugin() {
    if (!this.element.select2) {
      if (!this.check) {
        this.check = true;
        // console.log('Please add Select2 library (js file) to the project');
      }

      return;
    }

    // If select2 already initialized remove him and remove all tags inside
    if (this.element.hasClass('select2-hidden-accessible') === true) {
      this.element.select2('destroy');
      this.renderer.setProperty(this.selector.nativeElement, 'innerHTML', '');
    }

    const options: any = {
      data: this.data,
      width: (this.width) ? this.width : 'resolve'
    };

    Object.assign(options, this.options);

    if (options.matcher) {
      jQuery.fn.select2.amd.require(['select2/compat/matcher'], (oldMatcher: any) => {
        options.matcher = oldMatcher(options.matcher);
        this.element.select2(options);

        if (typeof this.value !== 'undefined') {
          this.setElementValue(this.value);
        }
      });
    } else {
      this.element.select2(options);
    }

    if (this.disabled) {
      this.renderer.setProperty(this.selector.nativeElement, 'disabled', this.disabled);
    }
  }

  private setElementValue (newValue: string | string[]) {
    if ( Array.isArray(newValue)) {
        for (const option of this.selector.nativeElement.options) {
          if (newValue.includes(option.value)) {
            this.renderer.setProperty(option, 'selected', 'true');
          }
      }
    } else {
      this.renderer.setProperty(this.selector.nativeElement, 'value', newValue);
    }

    this.element.trigger('change.select2');
  }

}
