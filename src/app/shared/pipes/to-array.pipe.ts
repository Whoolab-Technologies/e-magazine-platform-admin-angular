import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toArray'
})
export class ToArrayPipe implements PipeTransform {

  transform(object: unknown, ...args: unknown[]): unknown {
    var array = Object.keys(object).map((key) => {
      let ob = { key: key, value: object[key] };
      return ob;
    });
    return array;
  }

}
