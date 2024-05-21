import { User, UserProps } from "@/domain/entities/user-entity";
import { UserRoleEnum, UserStatusEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { prisma } from "@/infra/database/lib/prisma";
import { CreateUserMapper } from "@/infra/database/prisma/mappers/user/create-user-mapper";
import { UserMapper } from "@/infra/database/prisma/mappers/user/user-mapper";
import { faker } from "@faker-js/faker";

type UserOverrides = {
    id?: string;
    name?: string;
    companyId?: string
    confirmationCode?: string
    status?: UserStatusEnum
    resetToken?: string
    email?: string;
    password?: string;
    createdAt?: Date;
    type?: UserTypesEnum;
    role?: UserRoleEnum;
};

export function makeFakeUser(data = {} as UserOverrides) {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const confirmationCode = faker.string.numeric(6);
    const resetToken = faker.string.nanoid();

    const props: UserProps = {
        id: data.id ?? "",
        companyId: data.companyId ?? "",
        name: data.name || name,
        resetToken: data.resetToken || resetToken,
        email: data.email || email,
        confirmationCode: data.confirmationCode || confirmationCode,
        status: data.status || UserStatusEnum.PENDING,
        password: data.password || password,
        type: data.type || UserTypesEnum.COMPANY,
        role: data.role || UserRoleEnum.BASIC,
    };

    const user = User.create(props);

    return user;
}

export class UserFactory {
    constructor() { }

    async makeUser(data = {} as UserOverrides): Promise<User> {
        const user = makeFakeUser(data);

        const result = await prisma.user.create({
            data: CreateUserMapper.convertToPrisma(user)
        });

        return UserMapper.toDomain(result);
    }
}
