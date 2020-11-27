import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FirebaseService {
    constructor(
      @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
    ) {}
  
    async getUidFromFirebaseIdToken(firebaseIdToken: string): Promise<string> {
      const decodedIdToken = await this.firebase.auth.verifyIdToken(
        firebaseIdToken,
      );
  
      // console.log('decodedIdToken in firebase service: ', decodedIdToken);
      return decodedIdToken.uid;
    }
  
  
    async getUser(uid: string) {
      const user = await this.firebase.auth.getUser(uid);
  
      // console.log("Returned user: ", user);
      return user;
    }
  }
  