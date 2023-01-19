import React, {ReactEventHandler, useCallback, useEffect, useState} from "react"
import Inspector from "../../Types/Inspector"
import Swal from "sweetalert2"

import APICaller from "../../helpers/Axios";
import {Button, Form, InputGroup} from "react-bootstrap";
import DetailedTask from "../../Types/DetailedTask";
import "./index.css"
import TasksVisualizer from "../../Components/TaskVisualizer";
import {fetchDetailedTasks} from "../../helpers/fetch";
import {sort} from "../../helpers/sort";

const isDetailedTask = (task: DetailedTask | undefined): task is DetailedTask => {
	return !!task
}

const InspectorPage: React.FC = () => {
	const [tempInspectorId, setTempInspectorId] = useState<number>()
	const [inspectorId, setInspectorId] = useState<number>()
	const [tasks, setTasks] = useState<DetailedTask[]>([])
	const [sortBy, setSortBy] = useState<string>("id")
	const [sortDesc, setSortDesc] = useState<boolean>(true)

	const setSortOpts = (by: string, desc: boolean) => {
		setSortBy(by)
		setSortDesc(desc)
	}

	const isValid: (id: number) => Promise<boolean> = async (id) => {
		const inspectors: Inspector[] = (await APICaller.get("/inspectors")).data
		return inspectors.map(inspector => inspector.id).includes(id)
	}

	const fetchTasks: (id: number) => Promise<void> = useCallback(async (id) => {
		try {
			if (!await isValid(id)) throw new Error("Invalid ID")
			const detailedTasks = await fetchDetailedTasks(id)
			setTasks(detailedTasks)
		} catch (e) {
			console.error(e)
			await Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Something went wrong!',
				footer: '<a href="">Are you sure your inspector ID is valid?</a>'
			})
			setInspectorId(undefined)
		}
	}, [])

	// When the inspectorId is provided
	useEffect(() => {
		if (!inspectorId) return setTasks([])
		fetchTasks(inspectorId).then(() => console.log("Fetched tasks"))
	}, [inspectorId, fetchTasks])

	const handleInput: ReactEventHandler<HTMLInputElement> = (e) => {
		setTempInspectorId(parseInt(e.currentTarget.value, 10))
	}

	const handleSubmit: ReactEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault()
		console.log(e.currentTarget)
		setInspectorId(tempInspectorId)
	}

	const resetId: ReactEventHandler<HTMLAnchorElement> = (e) => {
		e.preventDefault()
		setInspectorId(undefined)
	}

	const refreshTasks = useCallback(() => {
		if (!inspectorId) return
		fetchTasks(inspectorId)
	}, [inspectorId])

	return <div className={'inspectors'}>
		<header>
			<h1>Inspectors' Area</h1>
			{inspectorId && <small>
                <a href={"#"} onClick={resetId}>(Reset ID?)</a>
            </small>}
		</header>
		<p>Here you will be able to view all tasks that are pending and have been assigned to you. You will find
			detailed information about each task including the product details, the inspection criteria, and the
			deadline for completion. You will also have the ability to update the status of the task as you progress
			through the inspection process. This page serves as your central hub for managing your assigned tasks and
			ensuring that they are completed on time and to the highest standards. If you have any questions or need
			assistance, please do not hesitate to reach out to our support team.</p>
		{!inspectorId && <>
            <p>To see which tasks are assigned to you, please provide your inspector ID below.</p>
            <Form onSubmit={handleSubmit}>
                <InputGroup className="mb-3">
                    <InputGroup.Text>Inspector ID: </InputGroup.Text>
                    <Form.Control type="number" onInput={handleInput} placeholder="Enter Inspector ID"/>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </InputGroup>

            </Form>
        </>}
		{inspectorId && !tasks.length &&
            <p className={'text-muted'}>It seems like you have no tasks registered under your ID. Please, get in touch
                with your manager to be assigned to a task.</p>}
		{tasks.length > 0 && <TasksVisualizer tasks={sort(tasks, sortBy, sortDesc)} setTasks={setTasks} sortBy={sortBy}
                                              sortDesc={sortDesc}
                                              setSortOpts={setSortOpts} refreshTasks={refreshTasks}/>}

	</div>
}

export default InspectorPage
