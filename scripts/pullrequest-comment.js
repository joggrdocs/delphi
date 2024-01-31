
/**
 * Used to identify the deployment comment
 */
const COMMENT_HEADER = '<!-- delphi:comment -->';

/**
 * Get url for the action run
 * 
 * @param {{ context, repository }} payload 
 * @returns {string}
 */
function getActionRunUrl({ context, repository }) {
  return `https://github.com/${repository.owner.login}/${repository.name}/actions/runs/${context.runId}`;
}

/**
 * Build the comment to append to the pull request
 *  
 * @param {string} header 
 * @param {string} body 
 * @returns {string} 
 */
function buildComment(header, body) {
  return `
${COMMENT_HEADER}
---
### ${header}
${body}
`.trim();
}

/**
 * Get the comment to append to the pull request when deploying
 * 
 * @param {object} payload
 * @param {object} payload.context
 * @param {object} payload.core
 * @param {object} payload.repository 
 * @returns {string}
 */
function getDeployingComment({ context, core, repository }) {
  return buildComment(
    ':warning: Deploying Preview :warning:',
    `Deploying preview environment, check progress here: [GitHub Action for Previews](${getActionRunUrl({ context, repository })})`
  );
}

/**
 * Get the comment to append to the pull request when successful
 * 
 * @param {object} payload
 * @param {object} payload.context
 * @param {object} payload.core
 * @param {object} payload.repository 
 * @param {string} payload.deploymentUrl
 */
function getDeploymentSuccessComment({ context, repository, core, deploymentUrl }) {
  if (!deploymentUrl) {
    core.setFailed('Deployment URL is required');
  }

  return buildComment(
    ':white_check_mark: Preview Deployment Success',
    `View the deployment: [${deploymentUrl}](${deploymentUrl})`
  );
}

/**
 * Get the comment to append to the pull request when failed 
 * 
 * @param {object} payload
 * @param {object} payload.context
 * @param {object} payload.repository 
 * @returns {string}
 */
function getDeploymentFailedComment({ context, repository }) {
  return buildComment(
    ':x: Preview Deployment Failed',
    `View the issue here: [GitHub Action for Previews](${getActionRunUrl({ context, repository })}) for more information.`
  );
}

/**
 * Append a comment to the pull request
 * 
 * @param {object} payload
 * @param {object} payload.context
 * @param {object} payload.core
 * @param {object} payload.github
 * @param {'deploying' | 'success' | 'failed'} type
 * @param {string|null} deploymentUrl
 * @returns {string}
 */
module.exports = async function (
  { github, context, core },
  type,
  deploymentUrl = null
) {
  try {
    const { repository } = context.payload;

    const { data: comments } = await github.rest.issues.listComments({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.payload.number,
    });

    const botComment = comments.find(
      comment => comment.body.includes(COMMENT_HEADER)
    );

    let commentBody = '';
    if (type === 'deploying') {
      commentBody = getDeployingComment({
        context,
        core,
        repository
      });
    } else if (type === 'success') {
      commentBody = getDeploymentSuccessComment({
        context,
        repository,
        core,
        deploymentUrl
      });
    } else if (type === 'failed') {
      commentBody = getDeploymentFailedComment({ context, repository });
    } else {
      throw new Error(`Type ${type} is not supported`);
    }

    if (botComment) {
      await github.rest.issues.updateComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        comment_id: botComment.id,
        body: commentBody
      })
    } else {
      await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.payload.number,
        body: commentBody
      })
    }
  } catch (error) {
    core.setFailed(error);
  }
};