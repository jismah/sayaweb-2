import { useRouter } from 'next/router'
import { useEffect } from 'react';
import { Button, Card, Text, Title } from "@tremor/react";

export default function Home() {

  const router = useRouter();

  useEffect(() => {
    router.push('/Auth/Login');
  }, []);

  return (
    <>
    </>
  )
}
