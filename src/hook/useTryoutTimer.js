import { useEffect, useState } from 'react';

export default function useTryoutTimer(initialTime = 0) {
  const [remainingTime, setRemainingTime] = useState(initialTime);

  useEffect(() => {
    setRemainingTime(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (remainingTime <= 0) return;

    const interval = setInterval(() => {
      setRemainingTime(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime]);

  return {
    remainingTime,
    setRemainingTime,
  };
}
