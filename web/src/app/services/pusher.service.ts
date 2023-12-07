
import { Injectable } from '@angular/core';
import Pusher from 'pusher-js';


@Injectable()
export class PusherService {
  constructor() {
  // Replace this with your pusher key
    this.pusher = new Pusher('1ad4b93854243ae307e6', {
      cluster: 'ap1'
    });
  }
  pusher;

  public init(channel) {
    return this.pusher.subscribe(channel);
  }
}
