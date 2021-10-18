namespace Comparer {
    export function createStringPropertyComparer<T>(propertyName: string): (a: T, b: T) => number {
        return changeType(stringComparer, (input) => input[propertyName] as string);
    }

    export function createToStringComparer<T>(): (a: T, b: T) => number {
        return changeType(stringComparer, (input) => input.toString());
    }

    export function combine<T>(...comps: Array<(a: T, b: T) => number>): (a: T, b: T) => number {
        return (a, b) => comps.reduce((ret, comp) => (ret !== 0) ? ret : comp(a, b), 0);
    }

    export function reverse<T>(comp: (a: T, b: T) => number): (b: T, a: T) => number {
        return (a, b) => comp(b, a);
    }

    export function changeType<FromT, ToT>(comp: (a: FromT, b: FromT) => number, translate: (input: ToT) => FromT): (b: ToT, a: ToT) => number {
        return (a, b) => comp(translate(a), translate(b));
    }

    export function shortCircuitEqualValues<T>(comp: (a: T, b: T) => number): (a: T, b: T) => number {
        return (a, b) => a === b ? 0 : comp(a, b);
    }

    export function addNullHandling<T>(comp: (a: T, b: T) => number, nullsFirst: boolean): (a: T, b: T) => number {
        return Comparer.combine((nullsFirst) ? nullsFirstComparer : nullsLastComparer, comp);
    }

    export function nullsFirstComparer<T>(a: T, b: T): number {
        return booleanComparer(Comparer.isSet(a), Comparer.isSet(b));
    }

    export function nullsLastComparer<T>(a: T, b: T): number {
        return booleanComparer(Comparer.isSet(b), Comparer.isSet(a));
    }

    export function stringComparer(a: string, b: string): number {
        return a.localeCompare(b);
    }

    export function numberComparer(a: number, b: number): number {
        return a - b;
    }

    export function booleanComparer(a: boolean, b: boolean): number {
        return (a === b) ? 0 : (a ? 1 : -1);
    }

    export function isSet(value: any): boolean {
        return value !== null && typeof value !== "undefined";
    }
}
