import { Injectable } from '@angular/core';
import { Users } from '../model/users';
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  getLoginProfile(): Users {
    let profile: any = this.get('loginProfile');
    if(JSON.parse(profile) !== null && profile !== ''){
      const user: Users = JSON.parse(profile);
      if(!user) {
        return null;
      }
      if(user.access && user.access.accessPages) {
        user.access.accessPages = user.access?.accessPages?.map(x=> {
          x.modify = x.modify.toString().trim() === "true";
          x.view = x.view.toString().trim() === "true";
          return x;
        })
      }
      if(user.branch) {
        user.branch.isMainBranch = user.branch.isMainBranch && user.branch.isMainBranch.toString().trim() === "true";
      }
      return user;
    }
    else {return null;}
  }
  saveLoginProfile(value: Users){
    return this.set('loginProfile', JSON.stringify(value));
  }
  getAccessToken(){
    return this.get('accessToken');
  }
  saveAccessToken(value: any){
    return this.set('accessToken', value);
  }
  getRefreshToken(){
    return this.get('refreshToken');
  }
  saveRefreshToken(value: any){
    return this.set('refreshToken', value);
  }
  getSessionExpiredDate(){
    return this.get('sessionExpiredDate');
  }
  saveSessionExpiredDate(value: any){
    return this.set('sessionExpiredDate', value);
  }
  getUnreadNotificationCount(){
    return this.get('unReadNotificationCount');
  }
  saveUnreadNotificationCount(value: any){
    return this.set('unReadNotificationCount', value);
  }
  private set(key: string, value: any){
    localStorage.setItem(key, value);
  }
  private get(key: string){
    return localStorage.getItem(key);
  }
}
