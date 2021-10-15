namespace Comparer {
    export function createStringPropertyComparer<T>(propertyName: string): (a: T, b: T) => number {
        return (a, b) => (<string>a[propertyName]).localeCompare(b[propertyName]);
    }

    export function createToStringComparer<T>(): (a: T, b: T) => number {
        return (a, b) => (a.toString()).localeCompare(b.toString());
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

    export function nullsFirstComparer<T>(a: T, b: T): number {
        let aSet = Comparer.isSet(a);
        let bSet = Comparer.isSet(b);
        if(!aSet || !bSet) {
            if(aSet) {
                return 1;
            } else if(bSet) {
                return -1;
            }
        }
        return 0;
    }

    export function isSet(value: any): boolean {
        return value !== null && typeof value !== "undefined";
    }
}
