import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {NotificationService} from "../../services/notification.service";
import {PostService} from "../../services/post.service";
import {Post} from "../../models/Post";

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.css']
})
export class UpdatePostComponent implements OnInit {

  public profileEditForm!: FormGroup;

  post!: Post


  constructor(private dialogRef: MatDialogRef<UpdatePostComponent>,
              private fb: FormBuilder,
              private notificationService: NotificationService,
              // @ts-ignore
              @Inject(MAT_DIALOG_DATA) public data: [Post],
              private postService: PostService) {
  }

  ngOnInit(): void {
    this.post = this.data[0];
    this.profileEditForm = this.createProfileForm();
  }

  createProfileForm(): FormGroup {
    console.log("post = " + this.post)
    return this.fb.group({
      title: [
        this.post.title,
        Validators.compose([Validators.required])
      ],
      caption: [
        this.post.caption,
        Validators.compose([Validators.required])
      ],
      location: [
        this.post.location,
        Validators.compose([Validators.required])
      ]
    });
  }

  submit(): void {
    this.postService.updatePost(this.updatePost())
    .subscribe(() => {
      this.notificationService.showSnackBar('Post updated successfully');
      this.dialogRef.close();
    });
  }

  private updatePost(): Post {
    this.data[0].title = this.profileEditForm.value.title;
    this.data[0].caption = this.profileEditForm.value.caption;
    this.data[0].location = this.profileEditForm.value.location;
    return this.data[0];
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

