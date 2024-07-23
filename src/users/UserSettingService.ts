import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/graphql/models/User';
import { UserSetting } from 'src/graphql/models/UserSetting';
import { CreateUserSettingsInput } from 'src/graphql/utils/CreateUserSettingsInput';
import { Repository } from 'typeorm';

@Injectable()
export class UserSettingService {
  constructor(
    @InjectRepository(UserSetting)
    private userSettingsRepository: Repository<UserSetting>,
    @InjectRepository(User)
    private userRespository: Repository<User>,
  ) {}

  getUserSettingById(userId: number) {
    return this.userSettingsRepository.findOneBy({ userId });
  }

  async createUserSettings(createUserSettingsData: CreateUserSettingsInput) {
    const findUser = await this.userRespository.findOneBy({
      id: createUserSettingsData.userId,
    });

    if (!findUser) throw new Error('User Not Found');

    const newUserSetting = this.userSettingsRepository.create(
      createUserSettingsData,
    );
    const savedSettings =
      await this.userSettingsRepository.save(newUserSetting);

    findUser.settings = savedSettings;
    await this.userRespository.save(findUser);

    return savedSettings;
  }
}
