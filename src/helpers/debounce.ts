export const delayFn = (fn: Function, ms: number) => {
	let timer: number;
	return (...params: any[]) => {
		if (timer) {
			clearTimeout(timer)
		}
		timer = setTimeout(fn, ms, ...params)
	}
}
