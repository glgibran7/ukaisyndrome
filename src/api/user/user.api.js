import request from '../client';
import endpoints from '../enpoints';

export async function getMe() {
  const response = await request(endpoints.me);
  return response.data;
}
export const changePassword = async payload => {
  return await request(endpoints.changePassword, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};
