declare type RestartType = {
    Restart(reason?: string): void;
    restart(reason?: string): void;
    getReason(): Promise<string>;
    getName(): string;
};
declare const _default: RestartType;
export default _default;
