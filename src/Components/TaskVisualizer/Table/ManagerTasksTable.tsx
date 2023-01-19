import React from "react";
import {Button, Table} from "react-bootstrap";
import TimeAgo from "timeago-react";
import {renderQuality} from "../../../helpers/render";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCog, faTimes} from "@fortawesome/free-solid-svg-icons";
import {TasksTableProps} from "./index";
import DetailedTask from "../../../Types/DetailedTask";

const ManagerTasksTable: React.FC<
	TasksTableProps &
	{ removeTask: (task: DetailedTask) => Promise<void> }
	> = ({ handleSortChange, tasks, setTaskEdited, removeTask}) => {
	return <Table striped bordered hover className={'tasks-table'}>
		<thead>
		<tr>
			<th onClick={handleSortChange( "id")}>Task ID</th>
			<th onClick={handleSortChange("inspectorId")}>Inspector ID</th>
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
					<td>{task.inspectorId}</td>
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
							<Button title={"Edit Task"}
							        onClick={() => setTaskEdited(task)}
							        className={"edit"}><FontAwesomeIcon icon={faCog}/>
							</Button>
							<Button variant={"danger"} title={"Delete Task"}
							        onClick={() => removeTask(task)}
							        className={"edit"}><FontAwesomeIcon icon={faTimes}/>
							</Button>
						</span>
					</td>
				</tr>
			})
		}
		</tbody>
	</Table>
}

export default ManagerTasksTable
