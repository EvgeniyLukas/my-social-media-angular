import {Component, OnInit} from '@angular/core';
import {Post} from '../../models/Post';
import {User} from '../../models/User';
import {PostService} from "../../services/post.service";
import {UserService} from "../../services/user.service";
import {CommentService} from "../../services/comment.service";
import {NotificationService} from "../../services/notification.service";
import {ImageUploadService} from "../../services/image-upload.service";


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  isPostsLoaded = false;
  posts!: Post[];
  isUserDataLoaded = false;
  user!: User;

  constructor(private postService: PostService,
              private userService: UserService,
              private commentService: CommentService,
              private notificationService: NotificationService,
              private imageService: ImageUploadService
  ) {
  }

  ngOnInit(): void {
    //выводим посты при запуске приложения
    this.postService.getAllPosts()
    .subscribe(data => {
      console.log(data);
      this.posts = data;
      this.getImagesToPosts(this.posts);
      this.getCommentsToPosts(this.posts);
      //посты загрузились успешно
      this.isPostsLoaded = true;
    });

    //информация о текущем пользователе чтоб он мог лайкать и писать комментарии
    this.userService.getCurrentUser()
    .subscribe(data => {
      console.log(data);
      this.user = data;
      this.isUserDataLoaded = true;
    })
  }

  //подгружаем фотки к постам
  getImagesToPosts(posts: Post[]): void {
    posts.forEach(p => {
      this.imageService.getImageToPost(p.id!)
      // @ts-ignore
      .subscribe(data => {
        p.image = data.imageBytes;
      })
    });
  }

  //подгружаем комменты к постам
  getCommentsToPosts(posts: Post[]): void {
    posts.forEach(p => {
      this.commentService.getCommentsToPost(p.id!)
      .subscribe(data => {
        p.comments = data;
      })
    });
  }


  //подгружаем лайки и определяем можем лайкать пост или нет
  likePost(postId: number | undefined, postIndex: number): void {
    const post = this.posts[postIndex];
    console.log(post);


    // @ts-ignore
    if (!post.usersLiked.includes(this.user.username)) {
      this.postService.likePost(postId!, this.user.username)
      .subscribe(() => {
        // @ts-ignore
        post.usersLiked.push(this.user.username);
        //вылезет уведомление, что мы лайкнули пост
        this.notificationService.showSnackBar('Liked!');
      });
    } else {
      this.postService.likePost(postId!, this.user.username)
      .subscribe(() => {
        // @ts-ignore
        const index = post.usersLiked.indexOf(this.user.username, 0);
        if (index > -1) {
          // @ts-ignore
          post.usersLiked.splice(index, 1);
        }
      });
    }
  }


  postComment(message: string, postId: number, postIndex: number): void {
    const post = this.posts[postIndex];

    console.log(post);
    this.commentService.addToCommentToPost(postId, message)
    .subscribe(data => {
      console.log(data);
      post.comments!.push(data);
    });
  }

  formatImage(img: any): any {
    if (img == null) {
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }

}
