import React, {Dispatch, ReactEventHandler, SetStateAction} from "react";
import {Button, Table} from "react-bootstrap";
import TimeAgo from "timeago-react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBan, faCog, faTruckLoading} from "@fortawesome/free-solid-svg-icons";
import {renderQuality} from "../../../helpers/render";
import {TasksTableProps} from "./index";
import DetailedTask from "../../../Types/DetailedTask";
import Status from "../../../Types/Status";

const InspectorTasksTable: React.FC<
	TasksTableProps &
	{ handleStatusChange: (task: DetailedTask, status: Status) => ReactEventHandler<HTMLElement> }
	> = ({ handleSortChange, tasks, handleStatusChange, setTaskEdited }) => {
	return <Table striped bordered hover className={'tasks-table'}>
		<thead>
		<tr>
			<th onClick={handleSortChange( "id")}>Task ID</th>
			<th onClick={handleSortChange("status")}>Status</th>
			<th onClick={handleSortChange("batchId")}>Batch ID</th>
			<th onClick={handleSortChange("batch.numBoxes")}>Number of boxes</th>
			<th onClick={handleSortChange("batch.product")}>Product</th>
			<th>Variety</th>
			<th onClick={handleSortChange("batch.arrivalTimestamp")}>Arrival</th>
			<th onClick={handleSortChange("batch.latestInspectionTimestamp")}>Latest Inspection</th>
			<th onClick={handleSortChange( "batch.latestQualityScore")}>Latest Quality</th>
			<th></th>
		</tr>
		</thead>
		<tbody>
		{
			tasks.map(task => {
				if (!task.batch) return null
				return <tr key={task.id}>
					<td >{task.id}</td>
					<td className={"status " + task.status.toString().toLowerCase()}>{task.status}</td>
					<td >{task.batch.id}</td>
					<td >{task.batch.numBoxes}</td>
					<td >{task.batch.product}</td>
					<td>{task.batch.variety}</td>
					<td >
						<div className={"datetime-ago"}>
							<TimeAgo datetime={task.batch.arrivalTimestamp}/>
							<small className={'text-muted'}>{task.batch.arrivalTimestamp.toLocaleString()}</small>
						</div>
					</td>
					<td >
						<div className={"datetime-ago"}>
							<TimeAgo datetime={task.batch.latestInspectionTimestamp}/>
							<small
								className={'text-muted'}>{task.batch.latestInspectionTimestamp.toLocaleString()}
							</small>
						</div>

					</td>
					<td><span className={"quality"}>{renderQuality(task.batch.latestQualityScore)}</span></td>
					<td>
						<span className={"actions"}>
							{task.status === "IN_PROGRESS" ? <Button title={"Stop Task"} onClick={handleStatusChange(task, "TODO")}>
								<FontAwesomeIcon icon={faBan}/>
							</Button>  : <Button disabled={task.status === "DONE"} title={"Begin Task"} onClick={handleStatusChange(task, "IN_PROGRESS")}>
								<FontAwesomeIcon icon={faTruckLoading}/>
							</Button>}
							<Button disabled={task.status === "DONE"} title={"Fill-in Task"}
							        onClick={() => setTaskEdited(task)}
							        className={"edit"}><FontAwesomeIcon icon={faCog}/>
							</Button>
						</span>
					</td>
				</tr>
			})
		}
		</tbody>
	</Table>
}

export default InspectorTasksTable
