interface StoryDefinition {
  section: string
  title: string
  path: string
}

function createStory(
  section: string,
  title: string,
  path: string
): StoryDefinition {
  return {
    section,
    title,
    path,
  }
}

export default [
  createStory('Examples', 'Basic', 'basic'),
  createStory('Examples', 'Async submission', 'async-submission'),
  createStory('Examples', 'Resetting form', 'resetting-form'),
  createStory('Examples/Validation', 'On Submit', 'validate-on-submit'),
  createStory(
    'Examples/Validation',
    'On Submit (async)',
    'validate-on-submit-async'
  ),
  createStory('Examples/Validation', 'On Change', 'validate-on-change'),
]
