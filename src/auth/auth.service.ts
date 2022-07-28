import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  googleLogin() {
    return 'google login';
  }
  naverLogin() {
    return 'naver login';
  }
}
