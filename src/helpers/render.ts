import Score from "../Types/Score";

export 	const renderQuality = (quality: Score) => {
	return '★'.repeat(quality) + '☆'.repeat(5 - quality)
}
