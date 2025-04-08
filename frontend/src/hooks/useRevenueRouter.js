import { useReadContract, useWriteContract } from 'wagmi';
import { contractAddresses } from '../config/web3';
import RevenueRouterABI from '../abis/RevenueRouterABI.json';

export const useRevenueRouter = () => {
  const getRevenueInfo = async (tokenId) => {
    const [totalRevenue, lastPayout, nextPayout, availableRevenue] = await Promise.all([
      useReadContract.staticCall({
        address: contractAddresses.RevenueRouter,
        abi: RevenueRouterABI,
        functionName: 'getTotalRevenue',
        args: [tokenId]
      }),
      useReadContract.staticCall({
        address: contractAddresses.RevenueRouter,
        abi: RevenueRouterABI,
        functionName: 'getLastPayout',
        args: [tokenId]
      }),
      useReadContract.staticCall({
        address: contractAddresses.RevenueRouter,
        abi: RevenueRouterABI,
        functionName: 'getNextPayout',
        args: [tokenId]
      }),
      useReadContract.staticCall({
        address: contractAddresses.RevenueRouter,
        abi: RevenueRouterABI,
        functionName: 'getAvailableRevenue',
        args: [tokenId]
      })
    ]);

    return {
      totalRevenue,
      lastPayout,
      nextPayout,
      availableRevenue
    };
  };

  const { writeContract } = useWriteContract();

  const claim = async (args) => {
    return await writeContract({
      address: contractAddresses.RevenueRouter,
      abi: RevenueRouterABI,
      functionName: 'claimRevenue',
      ...args
    });
  };

  return {
    getRevenueInfo,
    claim
  };
};
