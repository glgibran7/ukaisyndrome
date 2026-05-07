import request from '../client';
import endpoints from '../endpoints';

export const getHomeData = () => {
  return request(endpoints.home);
};
