declare module 'clamp' {
  export default function clamp(lo: number, hi: number, n: number): number
}
declare module 'linspace' {
  export default function linspace(lo: number, hi: number, n: number): number[]
}
declare module 'logspace' {
  export default function logspace(lo: number, hi: number, n: number): number[]
}
declare module 'log10' {
  export default function log10(n: number): number
}

declare module 'built-in-math-eval' {
  export default function eval(expr: string): any
}
declare module 'interval-arithmetic-eval' {
  export default function eval(expr: string): any

  export class Interval {
    lo: number
    hi: number

    static isEmpty(n: Interval | number): boolean
    static isWhole(n: Interval | number): boolean
    static intervalsOverlap(n: Interval, r: Interval): boolean
    static width(n: Interval): number
    static zeroIn(n: Interval): boolean
  }

  export const policies: any
}

