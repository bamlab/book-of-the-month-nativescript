import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router-deprecated";
import {action} from "ui/dialogs";
import {Page} from "ui/page";
import {BookListService} from "../../shared/books/book-list.service";

@Component({
  selector: "list",
  templateUrl: "pages/list/list.html",
  styleUrls: ["pages/list/list-common.css", "pages/list/list.css"],
  providers: [BookListService]
})
export class ListPage implements OnInit {
  bookList;
  covers;

  isLoading = false;
  listLoaded = false;

  constructor(private _router: Router,
    private _bookListService: BookListService,
    private page: Page) {}

  ngOnInit() {
    this.page.actionBarHidden = true;
    this.page.className = "list-page";
    this.load();
  }

  load() {
    this.isLoading = true;
    this.bookList = [];
    this.covers = {};

    this._bookListService.load()
      .subscribe(books => {
        console.log("loaded " + books.length + "books");
        this.bookList = books;

        return this._bookListService.loadCovers(books)
        .subscribe(covers => {
          covers.forEach((cover) => {
            this.covers[cover.id] = cover.url;
          });
          console.log(this.covers);

          this.isLoading = false;
          this.listLoaded = true;
        });
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

  toggleVote(card) {
    var member = this._bookListService.getAuthenticatedMember()
      .subscribe(member => {
        console.log('Member: ',member);
        if (card.idMembersVoted.indexOf(member.id) !== -1) {
          console.log('Unvote');
          this._bookListService.unvote(card.id, member.id)
          .subscribe();
        } else {
          console.log('Vote');
          this._bookListService.vote(card.id, member.id)
          .subscribe();
        }
      });

  }

  logoff() {
    this._router.navigate(["Login"]);
  }
}
