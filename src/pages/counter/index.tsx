'use client'

import Link from 'next/link'
/* Core */
import { useState } from 'react'

/* Instruments */
import {
  counterSlice,
  useSelector,
  useDispatch,
  selectCount,
  incrementAsync,
  incrementIfOddAsync,
} from '~/lib/redux'
// import styles from './counter.module.css'

export default function Counter() {
  const dispatch = useDispatch()
  const count = useSelector(selectCount)
  const [incrementAmount, setIncrementAmount] = useState(2)

  return (
    <div className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          💻 Count Me! 😁
        </h1>
        <div className="flex justify-center align-center">
          <button
            className="rounded-full text-4xl bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            aria-label="Decrement value"
            onClick={() => dispatch(counterSlice.actions.decrement())}
          >
            -
          </button>
          <span className="text-4xl px-4 mt-2 font-courier">{count}</span>
          <button
            className="rounded-full text-4xl bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            aria-label="Increment value"
            onClick={() => dispatch(counterSlice.actions.increment())}
          >
            +
          </button>
        </div>
        <div className="flex justify-center align-center">
          <input
            className="text-4xl px-2 w-16 text-center mr-4"
            aria-label="Set increment amount"
            value={incrementAmount}
            onChange={(e) => setIncrementAmount(Number(e.target.value ?? 0))}
          />
          <button
            className="bg-white/10 px-10 py-3 mx-2 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={() =>
              dispatch(counterSlice.actions.incrementByAmount(incrementAmount))
            }
          >
            Add Amount
          </button>
          <button
            className="bg-white/10 px-10 py-3 mx-2 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={() => dispatch(incrementAsync(incrementAmount) as any)}
          >
            Add Async
          </button>
          <button
            className="bg-white/10 px-10 py-3 mx-2 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={() => dispatch(incrementIfOddAsync(incrementAmount) as any)}
          >
            Add If Odd
          </button>
        </div>
      </div>
      <div className="flex justify-center align-center">
        <Link href="/">
          <button className="rounded text-xs bg-white/10 px-5 py-2 mx-3 font-semibold text-white no-underline transition hover:bg-white/20"
          >
            Home Page
          </button>
        </Link>
      </div>
    </div>
  )
}
