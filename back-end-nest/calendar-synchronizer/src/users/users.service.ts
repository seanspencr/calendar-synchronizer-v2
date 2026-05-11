import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from "../database/database.service";
import { hash_password } from 'src/lib/hash_password';

@Injectable()
export class UsersService {
  private dbService: DatabaseService;
  constructor(dbService: DatabaseService) {
    this.dbService = dbService;
  }

  async create(createUserDto: CreateUserDto) {
    let hashed_password = createUserDto.password ? await hash_password(createUserDto.password) : undefined;
    if (hashed_password == undefined) {
      throw new Error("Password is required");
    }
    createUserDto.password = hashed_password;

    const existingUser = await this.dbService.users.findFirst({
      where: {
        username: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new UnprocessableEntityException("Email already registered, please login instead");
    }
    return this.dbService.users.create({ data: createUserDto });
  }

  async createOauthUser(createUserDto: CreateUserDto) {
    const password = "null";
    createUserDto.password = password;

    const existingUser = await this.findOauthUser(createUserDto.email);

    if (existingUser) {
      throw new UnprocessableEntityException("Email already registered, please login instead");
    }

    return this.dbService.users.create({ data: createUserDto });
  }

  async findOauthUser(email: string) {
    return this.dbService.users.findFirst({
      where: {
        email: email,
        password: "null"
      },
    });
  }

  async findById(id: string) {
    return this.dbService.users.findUnique({
      where: {
        id: id
      }
    });
  };

  async updateOauthUserRefreshToken(userid: string, provider: "google" | "microsoft", refresh_token: string) {

    const user = await this.findById(userid);

    if (!user) {
      throw new UnprocessableEntityException("User not found");
    }

    if (provider === "google") {
      console.log(`UserService : Updated user ${userid} with  google refresh token ${refresh_token} `)

      return await this.dbService.users.update({
        where: {
          id: userid
        }
        , data: {
          google_refresh_token: refresh_token
        }
      });
    } else if (provider === "microsoft") {
      return await this.dbService.users.update({
        where: {
          id: userid
        }
        , data: {
          microsoft_refresh_token: refresh_token
        }
      });
    }

    throw new UnprocessableEntityException("Invalid provider");
  }

  findAll() {
    return this.dbService.users.findMany();
  }

  findOne(id: number) {
    // return this.dbService.users.findUnique({where: {id}});
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    // return this.dbService.users.update({where: {id}, data: updateUserDto});
  }

  remove(id: number) {
    // return this.dbService.users.delete({where: {id : id}});
  }
}
