/*
 * @Author: Soulmate
 * @Date: 2022-06-20 09:39:35
 * @LastEditTime: 2023-02-09 09:39:58
 * @LastEditors: Soulmate
 * @Description:
 * @FilePath: \vue3-store\src\types\api\system\user.d.ts
 * 版权声明
 */
/**
 * 登录用户类型声明
 */
export interface UserInfo {
  user: Infos<object>;
  permissions: string[];
  roles: string[];
}
export interface Infos {
  nickname: string;
  avatar: string;
}