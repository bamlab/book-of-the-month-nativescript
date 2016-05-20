import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router-deprecated";
import {Color} from "color";
import {Animation} from "ui/animation";
import {View} from "ui/core/view";
import {prompt} from "ui/dialogs";
import {Page} from "ui/page";
import {TextField} from "ui/text-field";
import {UserService} from "../../shared/user/user.service";
import {setHintColor} from "../../utils/hint-util";
import {alert} from "../../utils/dialog-util";
import webViewModule = require("ui/web-view");

@Component({
  selector: "my-app",
  providers: [UserService],
  templateUrl: "pages/login/login.html",
  styleUrls: ["pages/login/login-common.css", "pages/login/login.css"],
})
export class LoginPage implements OnInit {
  isLoggingIn = true;
  isAuthenticating = false;

  @ViewChild("webView") webView;

  constructor(private _router: Router,
    private _userService: UserService,
    private page: Page) {
  }

  ngOnInit() {
    this.page.actionBarHidden = true;

    const webView = this.page.getViewById('webView');

    webView.on(webViewModule.WebView.loadFinishedEvent, function (args: webViewModule.LoadEventData) {
        const url = args.url;
        console.log('Load finished' + url);
        const callbackUrl = 'https://trello.com/done#token=';
        if (url.indexOf(callbackUrl) === 0) {
          const token = url.substr(String(callbackUrl).length);
          console.log('Getting token' + token);
          this._router.navigate(["List"]);
        }
    });
  }

  startBackgroundAnimation(background) {
    background.animate({
      scale: { x: 1.2, y: 1.2 },
      duration: 8000
    });
  }
}
