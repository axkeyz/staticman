import nock from 'nock';

import config from '../../source/config';
import { fileContent, invitation } from './githubApiMockResponses';

const githubToken = config.get('githubToken');

export function acceptCollaboratorInvitation(inviteId) {
  return nock(/api\.github\.com/, {
    reqheaders: {
      authorization: `token ${githubToken}`,
    },
  })
    .patch(`/user/repository_invitations/${inviteId}`)
    .reply(204);
}

export function deleteBranch(deleteInfo) {
  const endpoint = `/repos/${deleteInfo.username}/${
    deleteInfo.repository
  }/git/refs/heads%2F${encodeURI(deleteInfo.branch)}`;

  return nock(/api\.github\.com/, {
    reqheaders: {
      authorization: 'token '.concat('1q2w3e4r'),
    },
  })
    .delete(endpoint)
    .reply(204);
}

export function fetchCollaboratorInvitations() {
  return nock(/api\.github\.com/, {
    reqheaders: {
      authorization: `token ${githubToken}`,
    },
  })
    .get('/user/repository_invitations')
    .reply(200, [invitation()]);
}

export function fetchConfigFile(configInfo) {
  const configName = configInfo.version === '1' ? '_config.yml' : 'staticman.yml';
  const configContents =
    configInfo.version === '1'
      ? configInfo.contents.replace('comments:', 'staticman:')
      : configInfo.contents;

  const endpoint = `/repos/${configInfo.username}/${configInfo.repository}/contents/${configName}?ref=${configInfo.branch}`;

  return nock(/api\.github\.com/, {
    reqheaders: {
      Authorization: `token ${githubToken}`,
    },
  })
    .get(endpoint)
    .reply(200, fileContent(configName, configContents));
}

export function fetchOauthToken(siteConfig, responseCode = 200, responseBody = {}) {
  return nock(/github\.com/)
    .post('/login/oauth/access_token', {
      client_id: siteConfig.get('githubAuth.clientId'),
      client_secret: siteConfig.get('githubAuth.clientSecret'),
      code: '123',
      redirect_uri: siteConfig.get('githubAuth.redirectUri'),
    })
    .reply(responseCode, responseBody);
}

export function fetchPullRequest(responsePrBody) {
  return nock(/api\.github\.com/, {
    reqheaders: {
      authorization: 'token '.concat('1q2w3e4r'),
    },
  })
    .get(
      `/repos/${responsePrBody.repository.owner.login}/${responsePrBody.repository.name}/pulls/${responsePrBody.number}`
    )
    .reply(200, responsePrBody);
}

export function fetchUser(responseCode = 200, responseBody = {}) {
  return nock(/api\.github\.com/)
    .get('/user')
    .reply(responseCode, responseBody);
}