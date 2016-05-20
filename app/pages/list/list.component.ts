import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router-deprecated";
import {Color} from "color";
import {action} from "ui/dialogs";
import {Page} from "ui/page";
import {TextField} from "ui/text-field";
import {Grocery} from "../../shared/grocery/grocery";
import {BookListService} from "../../shared/books/book-list.service";
import {alert} from "../../utils/dialog-util";
import {setHintColor} from "../../utils/hint-util";
var socialShare = require("nativescript-social-share");

@Component({
  selector: "list",
  templateUrl: "pages/list/list.html",
  styleUrls: ["pages/list/list-common.css", "pages/list/list.css"],
  providers: [BookListService]
})
export class ListPage implements OnInit {
  bookList;
  grocery: string = "";

  isAndroid;
  isShowingRecent = false;
  isLoading = false;
  listLoaded = false;

  @ViewChild("groceryTextField") groceryTextField: ElementRef;

  constructor(private _router: Router,
    private _bookListService: BookListService,
    private page: Page) {}

  ngOnInit() {
    this.isAndroid = !!this.page.android;
    this.page.actionBarHidden = true;
    this.page.className = "list-page";
    this.load();
  }

  load() {
    this.isLoading = true;
    this.bookList = [];

    this._bookListService.load()
      .subscribe(books => {
        console.log("loaded " + books.length + "books");
        this.bookList = books;
        this.isLoading = false;
        this.listLoaded = true;
      });
  }

  showMenu() {
    action({
      message: "What would you like to do?",
      actions: ["Log Off"],
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result == "Log Off") {
        this.logoff();
      }
    });
  }

  logoff() {
    this._router.navigate(["Login"]);
  }
}
