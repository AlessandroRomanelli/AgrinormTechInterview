import React, {Dispatch, ReactEventHandler, SetStateAction, useState} from "react"
import DetailedTask from "../../Types/DetailedTask";
import {Button, Form, InputGroup, Modal} from "react-bootstrap";
import Status from "../../Types/Status";
import Score, {numberToScore} from "../../Types/Score";
import APICaller from "../../helpers/Axios";
import Swal from "sweetalert2";


interface TaskEditorProps {
	taskEdited: DetailedTask,
	setTaskEdited: Dispatch<SetStateAction<DetailedTask | undefined>>,
	refreshTasks: () => void,
	isManager?: boolean
}
const TaskEditor: React.FC<TaskEditorProps> = ({ taskEdited, setTaskEdited, refreshTasks, isManager }) => {
	const handleClose = () => setTaskEdited(undefined)

	const [status, setStatus] = useState<Status>(taskEdited.status)
	const [boxes, setBoxes] = useState<number>(taskEdited.batch.numBoxes)
	const [quality, setQuality] = useState<Score>(taskEdited.batch.latestQualityScore)
	const [hoverQuality, setHoverQuality] = useState<number>(0)
	const [inspectorId, setInspectorId] = useState<number>(taskEdited.inspectorId)

	const handleStatusChange: ReactEventHandler<HTMLSelectElement> = (e) => {
		setStatus(e.currentTarget.value as Status)
	}

	const handleBoxChange: ReactEventHandler<HTMLInputElement> = (e) => {
		setBoxes(parseInt(e.currentTarget.value, 10) || 0)
	}

	const handleQuality: (rank: number) => ReactEventHandler<HTMLElement> = (rank) => (e) => {
		setQuality(rank)
	}


	const handleSubmit = async () => {
		try {
			await APICaller.put(`/batches/${taskEdited.batch.id}`, {
				...taskEdited.batch,
				numBoxes: boxes,
				latestQualityScore: numberToScore(quality),
				latestInspectionTimestamp: new Date().toISOString(),
				arrivalTimestamp: taskEdited.batch.arrivalTimestamp.toISOString()
			})
			await APICaller.put(`/tasks/${taskEdited.id}`, {
				id: taskEdited.id,
				inspectorId,
				batchId: taskEdited.batchId,
				status: isManager ? status : "DONE"
			})
			refreshTasks()
			await Swal.fire({
				icon: 'success',
				title: 'Batch updated, task completed!',
				text: 'Thank you for your great work, keep it up!',
			})
		} catch (e) {
			console.error(e)
			await Swal.fire({
				icon: 'error',
				title: 'Oh oh! Something went wrong',
				text: 'Could not update the batch, task suspended',
			})
		}

		handleClose()
	}

	const handleInspectorChange: ReactEventHandler<HTMLInputElement> = (e) => {
		setInspectorId(parseInt(e.currentTarget.value, 10))
	}

	return <Modal className={'task-editor'} show={Boolean(taskEdited)} onHide={handleClose}>
		<Modal.Header closeButton>
			<Modal.Title>Editing Task #{taskEdited.id}</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			<>
				{isManager && <InputGroup className="mb-3">
					<InputGroup.Text id="basic-addon1">Inspector ID: </InputGroup.Text>
					<Form.Control type={"number"} onInput={handleInspectorChange} value={inspectorId}/>
				</InputGroup>}

				{isManager && <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Status: </InputGroup.Text>
                    <Form.Select onChange={handleStatusChange}>
                        <option selected={taskEdited.status === "TODO"} value={"TODO"}>TODO</option>
                        <option selected={taskEdited.status === "IN_PROGRESS"} value={"IN_PROGRESS"}>IN PROGRESS
                        </option>
                        <option selected={taskEdited.status === "DONE"} value={"DONE"}>DONE</option>
                    </Form.Select>
                </InputGroup>}

				<Form.Label>Related to Batch #{taskEdited.batch.id}</Form.Label>
				<InputGroup className="mb-3">
					<Form.Control
						type={"number"}
						placeholder="Number of boxes"
						value={boxes}
						onInput={handleBoxChange}
					/>
					<InputGroup.Text>boxes</InputGroup.Text>
				</InputGroup>

				<Form.Label>Product Quality</Form.Label>
				<div className={'quality-rating'} onMouseOut={() => setHoverQuality(0)}>
					{[1,2,3,4,5].map(rank => <span key={rank} onClick={handleQuality(rank)} onMouseOver={() => setHoverQuality(rank)} className={'rating-star ' + (rank <= hoverQuality ? "active" : '')}>
						{rank <= quality ? '★' : '☆'}
					</span>)}
				</div>

			</>
		</Modal.Body>
		<Modal.Footer>
			<Button variant="secondary" onClick={handleClose}>
				Close
			</Button>
			<Button variant="primary" onClick={handleSubmit}>
				Save Changes
			</Button>
		</Modal.Footer>
	</Modal>
}

export default TaskEditor
