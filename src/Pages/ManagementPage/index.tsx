import React, {useEffect, useState} from "react"
import {Button} from "react-bootstrap";

import "./index.css"
import TaskCreator from "./TaskCreator";
import TaskVisualizer from "../../Components/TaskVisualizer";
import DetailedTask from "../../Types/DetailedTask";
import {fetchDetailedTasks} from "../../helpers/fetch";
import Swal from "sweetalert2";
import {sort} from "../../helpers/sort";

const ManagementPage: React.FC = () => {
	const [showTaskModal, setShowTaskModal] = useState<boolean>(false)
	const [sortBy, setSortBy] = useState<string>("id")
	const [sortDesc, setSortDesc] = useState<boolean>(true)

	const setSortOpts = (by: string, desc: boolean) => {
		setSortBy(by)
		setSortDesc(desc)
	}

	const [tasks, setTasks] = useState<DetailedTask[]>([])

	const fetchTasks = async () => {
		try {
			const detailedTasks = await fetchDetailedTasks()
			setTasks(detailedTasks)
		} catch (e) {
			console.error(e)
			await Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Something went wrong while retrieving the tasks!',
			})
		}
	}

	useEffect(() => {
		fetchTasks().then(() => console.log("Tasks fetched"))
	}, [])

	return <div className={"management"}>
		<header>
			<h1>Management</h1>
			<p>To create a new task using the provided form, simply click on the "New Task" button located below. Fill
				out the form with the task details and click on the "Create" button. If you need assistance or have any
				questions, please feel free to contact the admins.</p>
		</header>
		<div className={'call-to-action'}>
			<Button onClick={() => setShowTaskModal(true)} className={'jello-horizontal'}>New Task</Button>
		</div>
		<TaskCreator show={showTaskModal} setShow={setShowTaskModal}/>
		<h2>Current Tasks</h2>
		<TaskVisualizer isManager tasks={sort(tasks, sortBy, sortDesc)} setTasks={setTasks} sortBy={sortBy}
		                sortDesc={sortDesc} setSortOpts={setSortOpts} refreshTasks={fetchTasks}/>
	</div>
}

export default ManagementPage
