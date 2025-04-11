import { useContractRead, useContractWrite } from 'wagmi';
import { contractAddresses } from '../config/web3';
import RevenueRouterABI from '../abis/RevenueRouterABI.json';

export const useRevenueRouter = (tokenId) => {
  const { data: totalRevenue } = useContractRead({
    address: contractAddresses.RevenueRouter,
    abi: RevenueRouterABI,
    functionName: 'getTotalRevenue',
    args: [tokenId],
    enabled: Boolean(tokenId)
  });

  const { data: lastPayout } = useContractRead({
    address: contractAddresses.RevenueRouter,
    abi: RevenueRouterABI,
    functionName: 'getLastPayout',
    args: [tokenId],
    enabled: Boolean(tokenId)
  });

  const { data: nextPayout } = useContractRead({
    address: contractAddresses.RevenueRouter,
    abi: RevenueRouterABI,
    functionName: 'getNextPayout',
    args: [tokenId],
    enabled: Boolean(tokenId)
  });

  const { data: availableRevenue } = useContractRead({
    address: contractAddresses.RevenueRouter,
    abi: RevenueRouterABI,
    functionName: 'getAvailableRevenue',
    args: [tokenId],
    enabled: Boolean(tokenId)
  });

  const { writeContract } = useContractWrite({
    address: contractAddresses.RevenueRouter,
    abi: RevenueRouterABI,
    functionName: 'claimRevenue'
  });

  const getRevenueInfo = () => {
    return {
      totalRevenue,
      lastPayout,
      nextPayout,
      availableRevenue
    };
  };

  const claimRevenue = async () => {
    return await writeContract({
      args: [tokenId]
    });
  };

  return {
    getRevenueInfo,
    claimRevenue
  };
};
