import Joi from "joi"
import { ticketTypes, hrTypes, itTypes } from "./constants"

export const createTicketSchema = Joi.object({
    title: Joi.string().trim().min(1).required(),
    description: Joi.string().trim().min(1).required(),

    // HR / ITs
    ticketType: Joi.string()
        .valid(...ticketTypes)
        .insensitive()
        .required(),

    // If request_type is HR, hr_type must be a valid HrType and required,
    // and it_type must be null/absent. Vice‑versa for IT.
    hrType: Joi.when('ticketType', {
        is: Joi.string().valid('HR').insensitive(),
        then: Joi.string()
            .valid(...hrTypes)
            .insensitive()
            .required(),
        otherwise: Joi.valid(null).optional(),
    }),

    itType: Joi.when('ticketType', {
        is: Joi.string().valid('IT').insensitive(),
        then: Joi.string()
            .valid(...itTypes)
            .insensitive()
            .required(),
        otherwise: Joi.valid(null).optional(),
    }),
});
