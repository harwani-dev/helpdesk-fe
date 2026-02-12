import Joi from "joi"

const errorSchema = Joi.object({
    code: Joi.string().required(),
    details: Joi.array().items(Joi.any()).required(),
})

export const responseSchema = Joi.object({
    success: Joi.boolean().required(),
    data: Joi.any().allow(null),
    error: errorSchema.allow(null),
})

export type ApiError = {
    code: string
    details: unknown[]
}

export type ApiResponse<T = unknown> = {
    success: boolean
    data: T | null
    error: ApiError | null
}

export function parseApiResponse<T>(payload: unknown): ApiResponse<T> {
    const { error, value } = responseSchema.validate(payload, { stripUnknown: false })
    if (error) throw new Error(error.message)
    return value as ApiResponse<T>
}
