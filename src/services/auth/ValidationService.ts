import { User } from "@/entities/user.entity";
import { IAuth } from "@/interfaces/auth.interface";
import { GraphQLError } from "graphql";
import { Repository } from "typeorm";
import validator from 'validator';

export class ValidationService {

  static async validateUser(input: IAuth, userRepository: Repository<User>, type: string) {
    if (!validator.isEmail(input.email)) {
      throw new GraphQLError('Invalid email format');
    }

    if (type === 'register') {
      const existingUser: User | null = await userRepository.findOne({
        where: { email: input.email }
      });
      if (existingUser) {
        throw new GraphQLError('Invalid credentials');
      }
    }

    if (input.password.length < 7) {
      throw new GraphQLError('Password must be least 7 characters.');
    }

    if (!/(?=.*[a-z])(?=.*\d)/.test(input.password)) {
      throw new GraphQLError('Password must contain at least one lowercase and one number.');
    }
  }
}
