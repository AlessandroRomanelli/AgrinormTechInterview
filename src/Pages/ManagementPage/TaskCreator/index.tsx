import React, {Dispatch, ReactEventHandler, SetStateAction, useEffect, useState} from "react"
import Inspector from "../../../Types/Inspector";
import {Batch} from "../../../Types";
import APICaller from "../../../helpers/Axios";
import {Button, Form, Modal} from "react-bootstrap";

import "./index.css"
import Status from "../../../Types/Status";
import Swal from "sweetalert2";

const match = (element: { [key: string]: any } & { id: number }, id: string) => element.id.toString().match(id)

interface TaskCreatorProps {
	show: boolean,
	setShow: Dispatch<SetStateAction<boolean>>
}

const TaskCreator: React.FC<TaskCreatorProps> = ({show, setShow}) => {
	const [inspectors, setInspectors] = useState<Inspector[]>([])
	const [batches, setBatches] = useState<Batch[]>([])


	const [inspectorId, setInspectorId] = useState<string>("")
	const [batchId, setBatchId] = useState<string>("")
	const [status, setStatus] = useState<Status>("TODO")

	const fetchInspectors = async () => {
		const inspectors: Inspector[] = (await APICaller.get("/inspectors")).data
		setInspectors(inspectors)
	}

	const fetchBatches = async () => {
		const batches: Batch[] = (await APICaller.get("/batches")).data
		setBatches(batches)
	}

	useEffect(() => {
		fetchInspectors().then(() => console.log("Inspectors fetched"))
		fetchBatches().then(() => console.log("Batches fetched"))
	}, [])

	const handleClose = () =>
		setShow(false)

	const handleSubmit = async () => {
		try {
			await APICaller.post('/tasks', {
				inspectorId: parseInt(inspectorId, 10),
				batchId: parseInt(batchId, 10),
				status
			})
			await Swal.fire({
				icon: 'success',
				title: 'Task created',
				text: 'The inspector will be notified ASAP',
			})
		} catch (e) {
			console.error(e)
			await Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Something went wrong!',
				footer: '<a href="">Could not create a task like you requested</a>'
			})
		}
		handleClose()
	}

	const handleChange: (fn: Function) => ReactEventHandler<HTMLInputElement> = (fn) => (e) => fn(e.currentTarget.value)

	const handleSelect: ReactEventHandler<HTMLSelectElement> = (e) => {
		const value = ["TODO", "IN_PROGRESS", "DONE"][parseInt(e.currentTarget.value, 10)] as Status
		setStatus(value)
	}

	const select = (id: string, fn: Dispatch<SetStateAction<string>>) => () => {
		(document.activeElement as HTMLElement)?.blur()
		fn(id)
	}

	const matchedInspectors = inspectorId && inspectors.filter(inspector => match(inspector, inspectorId)).slice(0, 5)
	const matchedBatches = batchId && batches.filter(batch => match(batch, batchId)).slice(0, 5)

	return <Modal className={'task-creator'} show={show} onHide={handleClose}>
		<Modal.Header closeButton>
			<Modal.Title>New Task Assignment</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			<Form>
				<Form.Group className="mb-3">
					<Form.Label>Inspector: </Form.Label>
					<span>
						<Form.Control type="number" onInput={handleChange(setInspectorId)} value={inspectorId}
						              placeholder="Enter Inspector ID"/>
						{(inspectorId && matchedInspectors && matchedInspectors.length) ?
							<div className={'suggestions'}>
								{matchedInspectors.map(inspector =>
									<div onClick={select(inspector.id.toString(), setInspectorId)}
									     className={"inspector-list-item"} key={inspector.id}>
										<img alt={"inspector's avatar"} src={"https://picsum.photos/100"}/>
										<span className={'text-muted'}>#{inspector.id}</span>
										<span>{inspector.name}</span>
									</div>)}
							</div> : null}
						{(inspectorId && matchedInspectors && !matchedInspectors.length) &&
                            <small className={'text-muted'}>No inspectors matching the provided ID.</small>}
					</span>
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Label>Batch: </Form.Label>
					<Form.Control type="number" onInput={handleChange(setBatchId)} value={batchId}
					              placeholder="Enter Batch ID"/>
					{(batchId && matchedBatches && matchedBatches.length) ? <div className={'suggestions'}>
						{matchedBatches.map(batch =>
							<div onClick={select(batch.id.toString(), setBatchId)} className={"inspector-list-item"}
							     key={batch.id}>
								<span className={'text-muted'}>#{batch.id}</span>
								<span>{batch.product} - {batch.variety}</span>
								<span>({batch.numBoxes} Boxes)</span>
							</div>)}
					</div> : null}
					{(batchId && matchedBatches && !matchedBatches.length) &&
                        <small className={'text-muted'}>No batches matching the provided ID.</small>}
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Status: </Form.Label>
					<Form.Select onChange={handleSelect}>
						<option value={"TODO"}>TODO</option>
						<option value={"IN_PROGRESS"}>IN PROGRESS</option>
						<option value={"DONE"}>DONE</option>
					</Form.Select>
				</Form.Group>
			</Form>
		</Modal.Body>
		<Modal.Footer>
			<Button variant="secondary" onClick={handleClose}>
				Cancel
			</Button>
			<Button variant="primary" onClick={handleSubmit}>
				Create
			</Button>
		</Modal.Footer>
	</Modal>
}

export default TaskCreator
