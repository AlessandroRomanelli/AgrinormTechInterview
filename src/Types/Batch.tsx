import Score from "./Score";

interface BaseBatch {
	id: number,
	numBoxes: number,
	product: string,
	variety: string,

}

export interface Batch extends BaseBatch {
	arrivalTimestamp: Date,
	latestInspectionTimestamp: Date,
	latestQualityScore: Score
}

export interface JSONBatch extends BaseBatch {
	arrivalTimestamp: string,
	latestInspectionTimestamp: string,
	latestQualityScore: keyof Score
}


