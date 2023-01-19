import DetailedTask from "../Types/DetailedTask";
import _ from "lodash";

export const sort: (tasks: DetailedTask[], sortBy: string, sortDesc: boolean) => DetailedTask[] = (tasks, by, desc) =>  {
	return _.orderBy(tasks, by, desc ? 'desc' : 'asc')
}
