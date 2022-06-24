export const TimeHelper = {
  sleep(miliseconds: number): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, miliseconds));
  },
};
