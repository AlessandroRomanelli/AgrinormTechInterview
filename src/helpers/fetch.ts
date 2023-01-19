import Task from "../Types/Task";
import APICaller from "./Axios";
import {Batch, JSONBatch} from "../Types";
import Score from "../Types/Score";
import DetailedTask, {makeDetailedTask} from "../Types/DetailedTask";
import Swal from "sweetalert2";

const isDetailedTask = (task: DetailedTask | undefined): task is DetailedTask => {
	return !!task
}

export const fetchDetailedTasks = async (id?: number) => {
	const tasks: Task[] = (await APICaller.get(`/tasks`)).data
	const jsonBatches: JSONBatch[] = (await APICaller.get("/batches")).data
	const batches: Batch[] = jsonBatches.map(batch => ({
		...batch,
		arrivalTimestamp: new Date(batch.arrivalTimestamp),
		latestInspectionTimestamp: new Date(batch.latestInspectionTimestamp),
		latestQualityScore: Object.values(Score).indexOf(batch.latestQualityScore)
	}))

	const detailedTasks: DetailedTask[] = tasks
		.filter(task => Boolean(id) ? task.inspectorId === id : true)
		.map(task => makeDetailedTask(
			task,
			batches.find(batch => batch.id === task.batchId)
		))
		.filter(isDetailedTask)
	return detailedTasks
}
