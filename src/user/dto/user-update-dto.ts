export interface UserUpdateDto {
  username: string;
  fullname: string;
  picture: string;
}

export interface UpdateUserDto {
  fullname?: string;
  presentation?: string;
}
