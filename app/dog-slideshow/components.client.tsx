"use client"

import React, { useEffect, useState } from "react"
import { getDogs } from "./utils"

export function Foo() {
  const [loading, setLoading] = useState(true)
  const [dogs, setDogs] = useState<{ title: string; url: string }[]>([])
  const [carouselIndex, setCarouselIndex] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDogs()
      setDogs(data)
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>

  const currentDog = dogs[carouselIndex]
  return (
    <div className="m-8 flex w-full flex-col gap-4">
      <img
        alt={currentDog.title}
        src={currentDog.url}
        className="mx-auto max-h-[500px] max-w-[500px]"
      />

      <div className="flex flex-row justify-center gap-2">
        <button
          className="size-[50px] bg-purple-400 hover:bg-purple-700"
          onClick={() => setCarouselIndex((carouselIndex - 1 + dogs.length) % dogs.length)}
        >
          {"<"}
        </button>

        <span className="w-[500px] text-balance text-center text-2xl">{currentDog.title}</span>

        <button
          className="size-[50px] items-center justify-center bg-purple-400 hover:bg-purple-700"
          onClick={() => setCarouselIndex((carouselIndex + 1) % dogs.length)}
        >
          {">"}
        </button>
      </div>
    </div>
  )
}
