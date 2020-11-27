import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FirebaseService } from './firebase.service';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    @Inject(FirebaseService) private firebaseService: FirebaseService,
  ) {}

  async getAdminByFirebaseIdToken(firebaseIdToken: string): Promise<Admin> {
    try {
      const uid = await this.firebaseService.getUidFromFirebaseIdToken(
        firebaseIdToken,
      );
      console.log('uid: ', uid);
      //
      return await this.adminRepository.findOne({
        firebase_uid: uid,
      });
    } catch (e) {
      console.log('ERROR: AuthService.getAdminByFirebaseIdToken: ', e.message);
      throw e;
    }
  }
}
