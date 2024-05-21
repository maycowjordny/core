import { HolidayType } from "@/domain/enum/holiday-enum";

export const holidays = [
    {
        name: "Confraternização Universal",
        date: new Date("2024-01-01T03:00:00.000Z"),
        type: HolidayType.NATIONAL,
        isOptional: true
    },
    {
        name: "Carnaval",
        date: new Date("2024-02-12T03:00:00.000Z"),
        type: HolidayType.NATIONAL,
        isOptional: false
    },
    {
        name: "Carnaval",
        date: new Date("2024-02-13T03:00:00.000Z"),
        type: HolidayType.NATIONAL,
        isOptional: false
    },
    {
        name: "Quarta-feira de Cinzas",
        date: new Date("2024-02-14T03:00:00.000Z"),
        type: HolidayType.NATIONAL,
        isOptional: false
    },
    {
        name: "São José",
        date: new Date("2024-03-19T03:00:00.000Z"),
        type: HolidayType.STATE,
        isOptional: false
    },
    {
        name: "Feriado Municipal",
        date: new Date("2024-03-24T03:00:00.000Z"),
        type: HolidayType.MUNICIPAL,
        isOptional: false
    },
    {
        name: "Data Magna do Ceará",
        date: new Date("2024-03-25T03:00:00.000Z"),
        type: HolidayType.STATE,
        isOptional: false
    },
    {
        name: "Sexta-feira Santa",
        date: new Date("2024-03-29T03:00:00.000Z"),
        type: HolidayType.NATIONAL,
        isOptional: false
    },
    {
        name: "Páscoa",
        date: new Date("2024-03-31T03:00:00.000Z"),
        type: HolidayType.NATIONAL,
        isOptional: false
    },
    {
        name: "Dia de Tiradentes",
        date: new Date("2024-04-21T03:00:00.000Z"),
        type: HolidayType.NATIONAL,
        isOptional: true
    },
    {
        name: "Dia do trabalhador",
        date: new Date("2024-05-01T03:00:00.000Z"),
        type: HolidayType.NATIONAL,
        isOptional: true
    },
    {
        name: "Corpus Christi",
        date: new Date("2024-05-30T03:00:00.000Z"),
        type: HolidayType.NATIONAL,
        isOptional: false
    },
    {
        name: "Aniversário de Juazeiro do Norte",
        date: new Date("2024-07-22T03:00:00.000Z"),
        type: HolidayType.MUNICIPAL,
        isOptional: false
    },
    {
        name: "Independência do Brasil",
        date: new Date("2024-09-07T03:00:00.000Z"),
        type: HolidayType.NATIONAL,
        isOptional: true
    },
    {
        name: "Nossa Senhora das Dores",
        date: new Date("2024-09-15T03:00:00.000Z"),
        type: HolidayType.MUNICIPAL,
        isOptional: false
    },
    {
        name: "Dia de Nossa Senhora Aparecida",
        date: new Date("2024-10-12T03:00:00.000Z"),
        type: HolidayType.NATIONAL,
        isOptional: true
    },
    {
        name: "Dia de Finados",
        date: new Date("2024-11-02T03:00:00.000Z"),
        type: HolidayType.NATIONAL,
        isOptional: true
    },
    {
        name: "Proclamação da República do Brasil",
        date: new Date("2024-11-15T03:00:00.000Z"),
        type: HolidayType.NATIONAL,
        isOptional: true
    },
    {
        name: "Natal",
        date: new Date("2024-12-25T03:00:00.000Z"),
        type: HolidayType.NATIONAL,
        isOptional: true
    },
];
