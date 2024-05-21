import { Absence, AbsenceProps } from "@/domain/entities/absence-entity";
import { Attachment } from "@/domain/entities/attachment-entity";
import { TypeAbsenceEnum } from "@/domain/enum/absence-enum";
import { prisma } from "@/infra/database/lib/prisma";
import { AbsenceMapper } from "@/infra/database/prisma/mappers/absence/absence-mapper";
import { CreateAbsenceMapper } from "@/infra/database/prisma/mappers/absence/create-absence-mapper";
import { faker } from "@faker-js/faker";

type AbsenceOverrides = {
    id?: string;
    employeeId?: string;
    companyId?: string;
    type?: TypeAbsenceEnum;
    description?: string;
    attachments?: Attachment[]
    initialDate?: Date;
    endDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
};

export function makeFakeAbsence(data = {} as AbsenceOverrides) {
    const description = faker.lorem.lines();
    const initialDate = faker.date.recent();
    const endDate = faker.date.future();

    const props: AbsenceProps = {
        id: data.id ?? "",
        companyId: data.companyId ?? "",
        employeeId: data.employeeId ? data.employeeId : "",
        description: data.description || description,
        initialDate: data.initialDate || initialDate,
        endDate: data.endDate || endDate,
        type: data.type || TypeAbsenceEnum.SUSPENSION,
    };

    const absence = Absence.create(props);

    return absence;
}

export class AbsenceFactory {
    constructor() { }
    async makeAbsence(data = {} as AbsenceOverrides): Promise<Absence> {
        const absence = makeFakeAbsence(data);

        const result = await prisma.absence.create({ data: CreateAbsenceMapper.convertToPrisma(absence) });

        return AbsenceMapper.toDomain(result);
    }
}
