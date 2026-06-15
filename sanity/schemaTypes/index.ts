import { type SchemaTypeDefinition } from 'sanity'
import { categoryType } from './categoryType'
import { courseType } from './courseType'
import { moduleType } from './moduleType'
import { lessonType } from './lessonType'
import { noteType } from './noteType'
import { userType } from './userType'
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [categoryType, courseType, moduleType, lessonType, noteType, userType],
}
