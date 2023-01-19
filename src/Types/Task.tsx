import Status from "./Status";

export default interface Task {
	id: number,
	inspectorId: number,
	batchId: number,
	status: Status
}
