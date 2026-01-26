import { Subjects } from "./subject"

export interface Student {
    address: string
    class: string
    email: string
    id?: string
    name: string
    subjects: Subjects
    syllabus: string
    createdOn: string
}

