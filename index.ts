interface Action<T> {
    payload?: T;
    type: string;
}

class EffectModule {
    count = 1;
    message = "hello!";

    delay(input: Promise<number>) {
        return input.then(i => ({
            payload: `hello ${i}!`,
            type: 'delay'
        }));
    }

    setMessage(action: Action<Date>) {
        return {
            payload: action.payload!.getMilliseconds(),
            type: "set-message"
        };
    }
}

// 修改 Connect 的类型，让 connected 的类型变成预期的类型
type FunctionProperty<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];
type FunctionTransform<T> = T extends (input: Promise<infer P>) => Promise<Action<infer W>> ? (input: P) => Action<W> : T extends (action: Action<infer E>) => Action<infer R> ? (action: E) => Action<R> : never
type Connect = (module: EffectModule) => {
    [K in FunctionProperty<EffectModule>]: FunctionTransform<EffectModule[K]>
};

const connect: Connect = m => ({
    delay: (input: number) => ({
        type: 'delay',
        payload: `hello 2`
    }),
    setMessage: (input: Date) => ({
        type: "set-message",
        payload: input.getMilliseconds()
    })
});

type Connected = {
    delay(input: number): Action<string>;
    setMessage(action: Date): Action<number>;
};


export const connected: Connected = connect(new EffectModule());
