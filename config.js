import assert from 'assert'
import fs from 'fs'
import os from 'os'
import yaml from 'js-yaml'

const configFile = expandTilde(process.env.GITLAB_RADIATOR_CONFIG || '~/.gitlab-radiator.yml')
const yamlContent = fs.readFileSync(configFile, 'utf8')
export const config = validate(yaml.safeLoad(yamlContent))

config.interval = Number(config.interval || 10) * 1000
config.groupSuccessfulProjects = config.groupSuccessfulProjects || false
config.projectsOrder = config.projectsOrder || ['name']
config.gitlabs = config.gitlabs.map((gitlab) => {
  return {
    url: gitlab.url,
    ignoreArchived: gitlab.ignoreArchived === undefined ? true : gitlab.ignoreArchived,
    maxNonFailedJobsVisible: Number(gitlab.maxNonFailedJobsVisible || 999999),
    'access-token': gitlab['access-token'] || process.env.GITLAB_ACCESS_TOKEN,
    projects: {
      excludePipelineStatus: (gitlab.projects || {}).excludePipelineStatus || [],
      include: (gitlab.projects || {}).include || '',
      exclude: (gitlab.projects || {}).exclude || ''
    }
  }
})
config.colors = (config.colors || {})

function expandTilde(path) {
  return path.replace(/^~($|\/|\\)/, `${os.homedir()}$1`)
}

function validate(cfg) {
  assert.ok(cfg.gitlabs, 'Mandatory gitlab properties missing from configuration file')
  cfg.gitlabs.forEach((gitlab) => {
    assert.ok(gitlab.url, 'Mandatory gitlab url missing from configuration file')
    assert.ok(gitlab['access-token'] || process.env.GITLAB_ACCESS_TOKEN, 'Mandatory gitlab access token missing from configuration (and none present at GITLAB_ACCESS_TOKEN env variable)')
  })
  return cfg
}