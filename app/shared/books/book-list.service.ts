import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Config} from "../config";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";

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
