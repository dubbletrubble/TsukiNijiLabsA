import React from 'react';
import styled from '@emotion/styled';
import { formatDistanceToNow } from 'date-fns';
import { theme } from '../../styles/theme';
import { formatEther } from 'viem';

// Icons for different activity types
const icons = {
  claim: '💰',
  purchase: '🛍️',
  bid: '🎯',
  list: '📋',
  delist: '❌',
  convert: '🔄'
};

const ListContainer = styled.div`
  background: ${theme.colors.background.dark}99;
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.subtle};
  overflow: hidden;
`;

const ActivityItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: ${theme.spacing.md};
  align-items: center;
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border.subtle};
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${theme.colors.background.secondary};
  }
`;

const Icon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSize.xl};
`;

const Details = styled.div`
  h4 {
    font-size: ${theme.fontSize.md};
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.xs};
  }

  p {
    font-size: ${theme.fontSize.sm};
    color: ${theme.colors.text.secondary};
  }
`;

const Status = styled.span`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSize.sm};
  background: ${props => 
    props.status === 'success' ? theme.colors.success.background :
    props.status === 'pending' ? theme.colors.warning.background :
    theme.colors.error.background};
  color: ${props =>
    props.status === 'success' ? theme.colors.success.text :
    props.status === 'pending' ? theme.colors.warning.text :
    theme.colors.error.text};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.text.secondary};
`;

const getActivityTitle = (activity) => {
  switch (activity.type) {
    case 'claim':
      return `Claimed Revenue from NFT #${activity.tokenId}`;
    case 'purchase':
      return `Purchased NFT #${activity.tokenId}`;
    case 'bid':
      return `Placed Bid on NFT #${activity.tokenId}`;
    case 'list':
      return `Listed NFT #${activity.tokenId} for Sale`;
    case 'delist':
      return `Delisted NFT #${activity.tokenId}`;
    case 'convert':
      return 'Converted ETH to $TSKJ';
    default:
      return 'Unknown Activity';
  }
};

const getActivityDetails = (activity) => {
  switch (activity.type) {
    case 'claim':
    case 'purchase':
    case 'bid':
      return `Amount: ${formatEther(activity.amount)} ${activity.token}`;
    case 'list':
      return `Listed for: ${formatEther(activity.price)} ${activity.token}`;
    case 'convert':
      return `Converted: ${formatEther(activity.ethAmount)} ETH → ${formatEther(activity.tskjAmount)} TSKJ`;
    default:
      return '';
  }
};

const ActivityList = ({ activities = [] }) => {
  if (activities.length === 0) {
    return (
      <ListContainer>
        <EmptyState>
          <p>No activity to display</p>
        </EmptyState>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      {activities.map((activity) => (
        <ActivityItem key={activity.id}>
          <Icon>{icons[activity.type]}</Icon>
          <Details>
            <h4>{getActivityTitle(activity)}</h4>
            <p>
              {getActivityDetails(activity)} • {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
            </p>
          </Details>
          <Status status={activity.status}>{activity.status}</Status>
        </ActivityItem>
      ))}
    </ListContainer>
  );
};

export default ActivityList;
