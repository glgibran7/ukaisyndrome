import client from '../client';

export async function getMentors() {
  return client('/cdn/mentor', {
    useAuth: false,
  });
}

export async function getModules() {
  return client('/cdn/modul', {
    useAuth: false,
  });
}

export async function getNewsAds() {
  return client('/cdn/news', {
    useAuth: false,
  });
}
