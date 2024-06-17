"use client"

import React, { useEffect, useState } from "react"
import { v4 } from "uuid"
import { getDogs } from "./utils"

interface Comment {
  id: string
  text: string
  upvotes: number
}

interface Dog {
  id: string
  title: string
  url: string
  comments: Comment[]
}

export function Foo() {
  const [loading, setLoading] = useState(true)
  const [dogs, setDogs] = useState<Dog[]>([])
  const [carouselIndex, setCarouselIndex] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDogs()
      const transformedData = data.map((dog) => ({
        id: v4(),
        title: dog.title,
        url: dog.url,
        comments: [],
      }))

      setDogs(transformedData)
      setLoading(false)
    }

    fetchData()
  }, [])

  const updateCurrentDog = (newDog: Dog) => {
    setDogs(dogs.map((dog) => (dog.id === newDog.id ? newDog : dog)))
  }

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

        <div className="flex flex-col gap-2">
          <span className="w-[500px] text-balance text-center text-2xl">{currentDog.title}</span>

          <input
            name="add-comment"
            type="text"
            className="border"
            onKeyDown={(e) => {
              if (e.key !== "Enter") return
              if (e.target.value === "") return

              const newComment = {
                id: v4(),
                text: e.target.value,
                upvotes: 0,
              }

              const newDog = {
                ...currentDog,
                comments: [...currentDog.comments, newComment],
              }

              updateCurrentDog(newDog)
              e.target.value = ""
            }}
          />

          {currentDog.comments.map((comment) => (
            <div key={comment.id} className="flex flex-row gap-2">
              <span>{comment.text}</span>
              <span>{comment.upvotes}</span>
              <button
                className="bg-purple-400 px-2 hover:bg-purple-700"
                onClick={() => {
                  const newDog = {
                    ...currentDog,
                    comments: currentDog.comments.map((c) =>
                      c.id === comment.id ? { ...c, upvotes: c.upvotes + 1 } : c
                    ),
                  }
                  updateCurrentDog(newDog)
                }}
              >
                Upvote
              </button>

              <button
                className="bg-red-400 px-2 hover:bg-red-700"
                onClick={() => {
                  const newDog = {
                    ...currentDog,
                    comments: currentDog.comments.filter((c) => c.id !== comment.id),
                  }
                  updateCurrentDog(newDog)
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

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
