import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import * as moment from 'moment';

@Pipe({
  name: 'firebaseDate'
})
export class FirebaseDatePipe implements PipeTransform {

  transform(value: any,): any {
    if (typeof value === 'object') {
      if (value.seconds) {
        return new Timestamp(value.seconds, value.nanoseconds).toDate()
      }
    }
    return value;
  }

}
