import { createEvent } from 'effector'
import type { CategoryId } from '../../../shared/types'

export const searchChanged = createEvent<string>()
export const categoryChanged = createEvent<CategoryId | undefined>()
