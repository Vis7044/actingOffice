import React from 'react'
import { CommandBarNav } from '../components/CommandBarNav'
import ClientDetailList from '../components/ClientDetailList'

export const Client = () => {
  return (
    <div>
      <CommandBarNav/>
      <ClientDetailList/>
    </div>
  )
}
