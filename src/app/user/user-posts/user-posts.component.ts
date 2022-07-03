import {Component, OnInit} from '@angular/core';
import {Post} from '../../models/Post';
import {PostService} from "../../services/post.service";
import {CommentService} from "../../services/comment.service";
import {ImageUploadService} from "../../services/image-upload.service";
import {NotificationService} from "../../services/notification.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {UpdatePostComponent} from "../update-post/update-post.component";


@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.css']
})
export class UserPostsComponent implements OnInit {

  isUserPostsLoaded = false;
  posts!: Post [];
  post!: Post;


  constructor(private postService: PostService,
              private imageService: ImageUploadService,
              private dialog: MatDialog,
              private commentService: CommentService,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.postService.getPostForCurrentUser()
    .subscribe(data => {
      console.log(data);
      this.posts = data;
      this.getImagesToPosts(this.posts);
      this.getCommentsToPosts(this.posts);
      this.isUserPostsLoaded = true;
    });
  }

  getImagesToPosts(posts: Post[]): void {
    posts.forEach(p => {

      // @ts-ignore
      this.imageService.getImageToPost(p.id).subscribe(data => {
        p.image = data.imageBytes;
      });
    });
  }


  getCommentsToPosts(posts: Post[]): void {
    posts.forEach(p => {
      this.commentService.getCommentsToPost(p.id!)
      .subscribe(data => {
        p.comments = data;
      });
    });
  }

  removePost(post: Post, index: number): void {
    console.log(post);
    const result = confirm('Do you really want to delete this post?');
    if (result) {
      this.postService.deletePost(post.id!)
      .subscribe(() => {
        this.posts.splice(index, 1);
        this.notificationService.showSnackBar('Post deleted');
      });
    }
  }

  formatImage(img: any): any {
    if (img == null) {
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }

  deleteComment(commentId: number | undefined, postIndex: number, commentIndex: number): void {
    const post = this.posts[postIndex];

    this.commentService.deleteComment(commentId!)
    .subscribe(() => {
      this.notificationService.showSnackBar('Comment removed');
      post.comments!.splice(commentIndex, 1);
    });
  }

  openEditDialog(post: Post): void {
    console.log("dialog = " + post.title)
    // const dialogPostEditConfig = new MatDialogConfig();
    // dialogPostEditConfig.width = '400px';
    // dialogPostEditConfig.data = {post: post}
    this.dialog.open(UpdatePostComponent, {maxWidth: '400px', data: [post]});
  }
}
