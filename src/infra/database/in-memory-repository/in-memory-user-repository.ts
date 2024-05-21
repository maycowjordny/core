import { User } from "@/domain/entities/user-entity";
import { AuthResetToken } from "@/domain/interfaces/auth/auh-reset-token";
import { AuthConfirmationCode } from "@/domain/interfaces/auth/auth-confirmation-code";
import { UpdateUserProps } from "@/domain/interfaces/user";
import { UserRepository } from "../repositories/users-repository";

export class InMemoryUserRepository implements UserRepository {
    public items: Array<User> = [];

    async findByEmail(email: string): Promise<User | null> {
        const user = this.items.find((item) => item.email == email);

        if (!user) return null;

        return user;
    }

    async create(user: User): Promise<User> {
        this.items.push(user);

        return user;
    }

    async update(user: UpdateUserProps): Promise<User> {
        const users = this.items.filter((item) => item.id == user.id)[0];

        const newUser = new User({
            ...users.props,
            email: user.email,
            name: user.name,
            password: user.password,
        });

        return newUser;
    }

    async findByEmailAndConfirmationCode({ email, confirmationCode }: AuthConfirmationCode): Promise<User | null> {
        const user = this.items.find((item) => item.email == email && item.confirmationCode == confirmationCode);

        if (!user) return null;

        return user;
    }

    async findByEmailAndResetToken({ email, resetToken }: AuthResetToken): Promise<User | null> {
        const user = this.items.find((item) => item.email == email && item.resetToken == resetToken);

        if (!user) return null;

        return user;
    }
}
