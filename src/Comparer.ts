namespace Comparer {
    export type Comparer<T> = (a: T, b: T) => number;

    export function createStringPropertyComparer<Key extends string & PropertyKey, T extends Record<Key, string>>(propertyName: Key, nullsFirst: boolean = true): Comparer<T> {
        return createPropertyComparer(propertyName, shortCircuitEqualValues(addNullHandling(stringComparer, nullsFirst)));
    }

    export function createPropertyComparer<T, Key extends string & keyof T>(propertyName: Key, comparer: Comparer<T[Key]>): Comparer < T > {
        return changeType(comparer, (input) => input[propertyName]);
    }

    export function createToStringComparer<T>(nullsFirst: boolean = true): (a: T, b: T) => number {
        return changeType(shortCircuitEqualValues(addNullHandling(stringComparer, nullsFirst)), (input) => input.toString());
    }

    export function combine<T>(...comps: Array<Comparer<T>>): Comparer<T> {
        return (a, b) => comps.reduce((ret, comp) => (ret !== 0) ? ret : comp(a, b), 0);
    }

    export function reverse<T>(comp: Comparer<T>): Comparer<T> {
        return (a, b) => comp(b, a);
    }

    export function changeType<FromT, ToT>(comp: Comparer<FromT>, translate: (input: ToT) => FromT): Comparer<ToT> {
        return (a, b) => comp(translate(a), translate(b));
    }

    export function shortCircuitEqualValues<T>(comp: Comparer<T>): Comparer<T> {
        return (a, b) => a === b ? 0 : comp(a, b);
    }

    export function addNullHandling<T>(comp: Comparer<T>, nullsFirst: boolean): Comparer<T> {
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
