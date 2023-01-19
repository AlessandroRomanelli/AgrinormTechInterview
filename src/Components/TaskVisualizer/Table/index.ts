import DetailedTask from "../../../Types/DetailedTask";
import {Dispatch, ReactEventHandler, SetStateAction} from "react";

export interface TasksTableProps {
	tasks: DetailedTask[],
	handleSortChange: (param: string) => ReactEventHandler<HTMLElement>,
	setTaskEdited: Dispatch<SetStateAction<DetailedTask | undefined>>
}
