import Task from "./Task";
import {Batch} from "./Batch";

type DetailedTask = Task & {
	batch: Batch
}
export const makeDetailedTask: (task: Task, batch: Batch | undefined) => DetailedTask | undefined = (task, batch) => {
	if (!batch) return undefined
	return {
		...task,
		batch
	} as DetailedTask
}

export default DetailedTask
