import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({ errorFormat: "colorless" })
// const prisma = new PrismaClient()

export interface ExpressContext {
  req: express.Request
  res: express.Response
  // connection?: ExecutionParams;
}

export interface Context {
  prisma: PrismaClient
  req: express.Request
  res: express.Response
}

export function setCookie(res: express.Response, token: string) {
  res.cookie('token', `Bearer ${token}`, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  })
}

export const createContext = ({ req, res }: ExpressContext) => ({
  prisma, req, res
})

