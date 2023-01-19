import React, {Dispatch, ReactEventHandler, SetStateAction, useCallback, useState} from "react"
import {Button, InputGroup} from "react-bootstrap";
import Swal from "sweetalert2";
import DetailedTask from "../../Types/DetailedTask";
import Status from "../../Types/Status";
import APICaller from "../../helpers/Axios";
import TaskEditor from "./TaskEditor";
import Form from "react-bootstrap/Form"
import InspectorTasksTable from "./Table/InspectorTasksTable";
import ManagerTasksTable from "./Table/ManagerTasksTable";

interface TasksVisualizerProps {
	tasks: DetailedTask[],
	setTasks: Dispatch<SetStateAction<DetailedTask[]>>,
	sortBy: string,
	sortDesc: boolean,
	setSortOpts: (by: string, desc: boolean) => void,
	refreshTasks: () => void
	isManager?: boolean
}

const TasksVisualizer: React.FC<TasksVisualizerProps> = ({tasks, setTasks, sortBy, sortDesc, setSortOpts, refreshTasks, isManager}) => {

	const [query, setQuery] = useState<string>("")
	const [taskEdited, setTaskEdited] = useState<DetailedTask>()

	const handleSortChange: (by: string) => ReactEventHandler<HTMLElement> = (by) => () => {
		if (sortBy === by)  return setSortOpts(sortBy, !sortDesc)
		setSortOpts(by, false)
	}

	const handleStatusChange = (task: DetailedTask, status: Status) => async () => {
		try {
			await APICaller.put(`/tasks/${task.id}`, {
				id: task.id,
				inspectorId: task.inspectorId,
				batchId: task.batchId,
				status
			})
			setTasks(oldTasks => [...oldTasks.filter(x => x.id !== task.id), { ...task, status }])
			await Swal.fire({
				icon: 'success',
				title: 'Task Status Updated',
			})


		} catch (e) {
			console.error(e)
			await Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: `Could not set Task #${task.id}'s status to '${status}'!`,
			})
		}

	}

	const matchQuery: (task: DetailedTask) => boolean = useCallback((task) => {
		const searchableObj = Object.values({
			...task.batch,
			id: task.id,
			batchId: task.batchId,
			inspectorId: task.inspectorId,
			status: task.status
		}).join(" ").toLowerCase()
		return Boolean(searchableObj.match(query))
	}, [ query ])

	const removeTask = async (task: DetailedTask) => {
		try {
			const result = await Swal.fire({
				title: 'Do you want to delete the task?',
				showDenyButton: true,
				confirmButtonText: 'Delete',
				denyButtonText: `Cancel`,
			})
			if (result.isDenied) return
			await APICaller.delete(`/tasks/${task.id}`)
			refreshTasks()
			await Swal.fire({
				icon: 'success',
				title: 'Task deleted',
			})
		} catch (e) {
			console.error(e)
			await Swal.fire({
				icon: 'error',
				title: 'Failed to delete task',
			})
		}
	}


	const handleSearch: ReactEventHandler<HTMLInputElement> = (e) => setQuery(e.currentTarget.value.toLowerCase())
	const filteredTasks = tasks.filter(matchQuery)

	return <>
		<InputGroup>
			<InputGroup.Text>🔍 Search: </InputGroup.Text>
			<Form.Control type={'text'} value={query} onInput={handleSearch} placeholder={"Search for a specific task"}></Form.Control>
			<Button onClick={() => setQuery("")}>Clear</Button>
		</InputGroup>
		{isManager ? <ManagerTasksTable
				tasks={filteredTasks}
				handleSortChange={handleSortChange}
				setTaskEdited={setTaskEdited}
				removeTask={removeTask}
			/> :
			<InspectorTasksTable
				tasks={filteredTasks}
				handleStatusChange={handleStatusChange}
				handleSortChange={handleSortChange}
				setTaskEdited={setTaskEdited}
			/>}
		{filteredTasks.length === 0 && <p className={"text-muted"}>No tasks are matching the search filter</p>}
		{taskEdited && taskEdited.batch && <TaskEditor isManager={isManager} taskEdited={taskEdited} setTaskEdited={setTaskEdited} refreshTasks={refreshTasks}/>}
	</>
}

export default TasksVisualizer
