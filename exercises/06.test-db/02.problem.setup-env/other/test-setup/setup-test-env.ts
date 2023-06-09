import { expect } from 'vitest'
import { installGlobals } from '@remix-run/node'
import { matchers } from './matchers.cjs'
import 'dotenv/config'

expect.extend(matchers)

installGlobals()

// 🐨 put all the setup code here
