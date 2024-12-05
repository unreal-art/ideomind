export interface JobSpec {
	module?: string;
	version?: string; //version
	inputs?: Record<string, string>;
}
