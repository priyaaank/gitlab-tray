// import _ from 'lodash'
// import {fetchLatestPipelines} from './pipelines'
// import {fetchProjects} from './projects'

// export async function update(config) {
//   const projectsWithPipelines = await loadProjectsWithPipelines(config)
//   return projectsWithPipelines
//     .filter(project => project.pipelines.length > 0)
// }

// async function loadProjectsWithPipelines(config) {
//   const allProjectsWithPipelines = []
//   await Promise.all(config.gitlabs.map(async (gitlab) => {
//     const projects = await fetchProjects(gitlab)
//     projects.forEach((project) => {
//       if (gitlab.maxNonFailedJobsVisible) {
//         project.maxNonFailedJobsVisible = gitlab.maxNonFailedJobsVisible
//       }
//     })
//     const projectsWithPipelines = await Promise.all(projects.map(project => projectWithPipelines(project, gitlab)))
//     allProjectsWithPipelines.push(...projectsWithPipelines)
//   }))
//   return allProjectsWithPipelines
// }

// async function projectWithPipelines(project, config) {
//   const pipelines = filterOutEmpty(await fetchLatestPipelines(project.id, config))
//     .filter(excludePipelineStatusFilter(config))
//   const status = masterBranchStatus(pipelines)
//   return {
//     project,
//     pipelines: pipelines,
//     status
//   }
// }

// function masterBranchStatus(pipelines) {
//   return _(pipelines)
//     .filter({ref: 'master'})
//     .map('status')
//     .head()
// }

// function filterOutEmpty(pipelines) {
//   return pipelines.filter(pipeline => pipeline.stages)
// }

// function excludePipelineStatusFilter(config) {
//   return pipeline => {
//     if (config.projects && config.projects.excludePipelineStatus) {
//       return !config.projects.excludePipelineStatus.includes(pipeline.status)
//     }
//     return true
//   }
// }