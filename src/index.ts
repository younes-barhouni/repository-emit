import {getInput, debug, setFailed} from '@actions/core'
import {getOctokit} from '@actions/github'
import {inspect} from 'util'

;(async function (): Promise<void> {
  try {
    const inputs = {
      token: getInput('token'),
      repo: getInput('repo'),
      event: getInput('event'),
      data: getInput('data')
    }
    debug(`Inputs: ${inspect(inputs)}`)

    const [owner, repo] = inputs.repo.split('/')

    const octokit = getOctokit(inputs.token)

    await octokit.rest.repos.createDispatchEvent({
      owner,
      repo,
      event_type: inputs.event,
      client_payload: JSON.parse(inputs.data)
    })
  } catch (error: any) {
    debug(inspect(error))
    if (error.status == 404) {
      setFailed('Repository not found, OR token has insufficient permissions.')
    } else {
      setFailed(error.message)
    }
  }
})()
