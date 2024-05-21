import { NearbyProps } from "@/domain/interfaces/employee";
import { Prisma } from "@prisma/client";

export class EmployeeAddressMapper {
    static toDomain(raw: Prisma.EmployeeGetPayload<{ include: { company: { include: { address: { select: { lat: true, lng: true } } } } } }>): NearbyProps {
        return {
            company: {
                address: {
                    lat: raw.company.address.lat,
                    lng: raw.company.address.lng,
                },
                id: raw.id,
                userId: raw.userId,
                addressId: raw.company.addressId,
                categoryId: raw.company.categoryId,
                socialName: raw.company.socialName,
                document: raw.company.document,
                phone: raw.company.phone,
                employeeQuantity: raw.company.employeeQuantity,
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt,
            }
        };
    }
}
