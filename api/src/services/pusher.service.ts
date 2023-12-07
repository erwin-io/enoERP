/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from "@nestjs/common";

const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1720928",
  key: "1ad4b93854243ae307e6",
  secret: "e8cf7208e15a53279f1a",
  cluster: "ap1",
  useTLS: true,
});
@Injectable()
export class PusherService {
  trigger(channel, event, data: any) {
    pusher.trigger(channel, event, data);
  }
}
