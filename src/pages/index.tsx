import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Button, Card, Text, Title } from "@tremor/react";

export default function Home() {
  return (
    <>
      <Card>
        <Title>Hola</Title>
        <Button size="xl">Read more</Button>
      </Card>
    </>
  )
}
