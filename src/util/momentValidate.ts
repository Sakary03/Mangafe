import moment from 'moment';
export const getCurrentTimeInHours = () => {
  return moment().format('h:mma, DD/MM/YYYY');
};
