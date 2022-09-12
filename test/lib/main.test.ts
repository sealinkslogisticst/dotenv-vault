import {expect, test} from '@oclif/test'
import {CliUx} from '@oclif/core'
import {writeFileSync} from 'node:fs'
import { fs } from 'memfs';

import {config} from '../../src/lib/main'

let testPath = 'test/.env'
const dotenvKey = 'key_1111111111111111111111111111111111111111111111111111111111111111'

describe('config', () => {
  afterEach(() => {
    delete process.env.DOTENV_KEY
    delete process.env.DOTENV_ENVIRONMENT
  })

  it('falls back to standard dotenv when no DOTENV_ENVIRONMENT', () => {
    const result = config({path: testPath})

    expect(Object.keys(result)[0]).to.equal('parsed')
  })

  it('parses the .env.vault#DOTENV_ENVIRONMENT production data', () => {
    process.env.DOTENV_KEY = dotenvKey
    process.env.DOTENV_ENVIRONMENT = 'production'

    const result = config({path: testPath})
    const parsed = result.parsed

    expect(parsed.BASIC).to.equal('production')
  })

  it('parses the .env.vault#DOTENV_ENVIRONMENT staging data', () => {
    process.env.DOTENV_KEY = dotenvKey
    process.env.DOTENV_ENVIRONMENT = 'staging'

    const result = config({path: testPath})
    const parsed = result.parsed

    expect(parsed.BASIC).to.equal('staging')
  })

  it('has a short DOTENV_KEY', () => {
    process.env.DOTENV_KEY = 'key_1234'
    process.env.DOTENV_ENVIRONMENT = 'staging'

    expect(function() {
      config({path: testPath})
    }).to.throw(Error)
  })

  it('is missing DOTENV_KEY', () => {
    process.env.DOTENV_KEY = ''
    process.env.DOTENV_ENVIRONMENT = 'staging'

    expect(function() {
      config({path: testPath})
    }).to.throw(Error)
  })

  it('has an incorrect DOTENV_KEY', () => {
    process.env.DOTENV_KEY = 'key_2222222222222222222222222222222222222222222222222222222222222222'
    process.env.DOTENV_ENVIRONMENT = 'staging'

    expect(function() {
      config({path: testPath})
    }).to.throw(Error)
  })

  it('has a malformed ciphertext', () => {
    process.env.DOTENV_KEY = dotenvKey
    process.env.DOTENV_ENVIRONMENT = 'staging'

    testPath = 'test/.env.malformed'

    expect(function() {
      config({path: testPath})
    }).to.throw(Error)
  })
})
