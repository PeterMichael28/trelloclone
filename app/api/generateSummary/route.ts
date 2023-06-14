import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

const {todos} = await req.json()

    const response = await openai.createChatCompletion( {
        model: 'gpt-3.5-turbo',
        temperature: 0.8,
        n: 1,
        stream: false,
        messages: [
            {
                role: "system",
                content: "When responding, salute the users with their names or not, and welcome them to Michael Peter Trello App! let the response be precise and limit it to 250 characters"
            },
            {
                role: "user",
                content: `Hi there, provide a summary of the following todos, count how many todos are in each category such as To do, In Progress and Completed, then tell the user to have a positive day! Here's the data : ${JSON.stringify(todos)}`
            }
        ]
    })


    const { data } = response


    return NextResponse.json(data.choices[0].message)
}