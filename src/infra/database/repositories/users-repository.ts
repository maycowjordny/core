import { User } from "@/domain/entities/user-entity";
import { AuthResetToken } from "@/domain/interfaces/auth/auh-reset-token";
import { AuthConfirmationCode } from "@/domain/interfaces/auth/auth-confirmation-code";
import { UpdateUserProps } from "@/domain/interfaces/user";

export interface UserRepository {
  create(user: User): Promise<User>;
  update(user: UpdateUserProps): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findByEmailAndConfirmationCode({ email, confirmationCode }: AuthConfirmationCode): Promise<User | null>;
  findByEmailAndResetToken({ email, resetToken }: AuthResetToken): Promise<User | null>;
}
