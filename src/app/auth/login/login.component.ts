import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {TokenStorageService} from "../../services/token-storage.service";
import {NotificationService} from "../../services/notification.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm!: FormGroup;

  //в конструкторе добавляем сервисы для работы
  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private notificationService: NotificationService,
    private router: Router,
    private fb: FormBuilder) {
    //если пользователь есть он попадает на страницу main
    if (this.tokenStorage.getUser()) {
      this.router.navigate(['main']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.createLoginForm();
  }

  //форма с проверкой валидации, не должна быть пустой
  createLoginForm(): FormGroup {
    return this.fb.group({
      username: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required])],
    });
  }

  //засылает данные на сервер
  submit(): void {
    this.authService.login({
      //берем данные из формы
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    }).subscribe(data => {
      console.log(data);
      //сохраняем токен и пользователя
      this.tokenStorage.saveToken(data.token);
      this.tokenStorage.saveUser(data);
      //показывает всплывающее окошко
      this.notificationService.showSnackBar('Successfully logged in');
      //при входе на сайт попадаем на главную страницу
      this.router.navigate(['/']);
      //нужно делать перезагрузку тк приложение не знает что мы зашли
      window.location.reload();
      //если вдруг будет ошибка...
    }, error => {
      console.log(error);
      //покажем сообщение с ошибкой
      this.notificationService.showSnackBar(error.message);
    });
  }

}
