const Pusher = require("pusher");
const pusher = new Pusher({
    appId: "1720928",
    key: "1ad4b93854243ae307e6",
    secret: "e8cf7208e15a53279f1a",
    cluster: "ap1",
    useTLS: true
});
pusher.trigger("my-channel", "my-event", {
    message: "hello world"
});
//# sourceMappingURL=notifications.pusher.js.map