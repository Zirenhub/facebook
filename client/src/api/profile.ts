import {
  EmptyRes,
  GetFriendsRes,
  GetProfilePostsRes,
  GetProfileRes,
  GetRequestsRes,
  SendRequestRes,
} from '../types/Api';
import { TProfile, TProfileWithoutFullName } from '../types/Profile';
import { DefaultReq, TRequest } from '../types/Request';
import getFinal from './getError';

export async function getProfile(id: string): Promise<TProfile> {
  const res = await fetch(`/api/v1/profile/${id}`);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const { status, data, errors, message }: GetProfileRes = await res.json();
  return getFinal(status, data, errors, message);
}

export async function getProfilePosts(id: string) {
  const res = await fetch(`/api/v1/profile/${id}/posts`);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const { status, data, errors, message }: GetProfilePostsRes =
    await res.json();
  return getFinal(status, data, errors, message);
}

export async function sendRequest(id: string): Promise<DefaultReq> {
  const res = await fetch(`/api/v1/profile/${id}/request`, { method: 'POST' });
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const { status, data, errors, message }: SendRequestRes = await res.json();
  return getFinal(status, data, errors, message);
}

export async function getRequests(): Promise<TRequest[]> {
  const res = await fetch(`/api/v1/profile/requests`);
  const { status, data, errors, message }: GetRequestsRes = await res.json();
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return getFinal(status, data, errors, message);
}

export async function acceptRequest(reqID: string): Promise<DefaultReq> {
  const res = await fetch(`/api/v1/profile/${reqID}/accept`, {
    method: 'POST',
  });
  const { status, data, errors, message }: SendRequestRes = await res.json();
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return getFinal(status, data, errors, message);
}

export async function rejectRequest(reqID: string): Promise<null> {
  const res = await fetch(`/api/v1/profile/${reqID}/reject`, {
    method: 'POST',
  });
  const { status, data, errors, message }: EmptyRes = await res.json();
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return getFinal(status, data, errors, message);
}

export async function getFriends(): Promise<TProfileWithoutFullName> {
  const res = await fetch('/api/v1/profile/friends');
  const { status, data, errors, message }: GetFriendsRes = await res.json();
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return getFinal(status, data, errors, message);
}
