import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders, HttpParams} from '@angular/common/http';
import {Post} from './post.model';
import {catchError, map, tap} from 'rxjs/operators';
import {Subject, throwError} from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostService {
  error = new Subject<string>()

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    const postData: Post = {
      title,
      content
    }
    this.http.post<{ name: string }>(
      'https://ng-complete-guide-d92be-default-rtdb.firebaseio.com/posts.json',
      postData,
      {
        observe: 'response'
      }
    ).subscribe(response => {
      console.log(response.body);
    }, error => {
      this.error.next(error.message)
    });
  }

  fetchPosts() {
    let params = new HttpParams()
    params = params.append('print', 'pretty')
    return this.http
      .get<Post>('https://ng-complete-guide-d92be-default-rtdb.firebaseio.com/posts.json',
        {
          headers: new HttpHeaders({'Custom-Header': 'Hello'}),
          params
        })
      .pipe(map(responseData => {
        const postArray: Post[] = [];

        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            postArray.push({...responseData[key], id: key})
          }
        }
        return postArray
      }), catchError(error => {
        return throwError(error)
      }))
  }

  deletePosts() {
    return this.http
      .delete('https://ng-complete-guide-d92be-default-rtdb.firebaseio.com/posts.json',
        {
          observe: 'events'
        }).pipe(tap(event => {
          console.log(event)
          if (event.type === HttpEventType.Response) {
            console.log(event.body)
          } else if (event.type === HttpEventType.Sent) {
            // ...
          }
      }))
  }
}
