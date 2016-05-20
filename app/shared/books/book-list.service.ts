import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Config} from "../config";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";
import 'rxjs/add/observable/from';

@Injectable()
export class BookListService {
  constructor(private _http: Http) {}

  load() {
    console.log("API Call to get books...");
    return this._http.get("https://api.trello.com/1/lists/573ec9d293d0f108fde48e06/cards", {
      headers: this.getHeaders()
    })
    .map(res => res.json())
    .map(data => {
      console.log("Books fetched:" + data.length);
      return data;
    })
    .catch(this.handleErrors);
  }

  loadCovers(books) {
    console.log("API Call to get book covers...");
    return Observable.forkJoin(books.map(book => {
      if (!book.idAttachmentCover) {
        console.log("No cover for card " + book.id)
        return Observable.from('');
      }

      return this._http.get("https://api.trello.com/1/card/" + book.id + "/attachments/" + book.idAttachmentCover, {
        headers: this.getHeaders()
      })
      .map(res => res.json())
      .map(attachment => {
        return (attachment.previews && attachment.previews.length !== 0) ?
          attachment.previews[0].url : '';
      })
      .map(url => {
        return {
          id: book.id,
          url,
        };
      })
      .catch((error: Response) => {
        console.log(JSON.stringify(error.json()));
        return Observable.throw(error);
      });
    }))
    .catch(this.handleErrors);
  }

  getHeaders() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    // headers.append("Authorization", "Bearer " + Config.token);
    return headers;
  }

  handleErrors(error: Response) {
    console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }
}
