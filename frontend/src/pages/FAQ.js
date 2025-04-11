import React, { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Heading, Text, Input, GlassCard } from '../components/common/StyledComponents';
import { theme } from '../styles/theme';

const Section = styled.section`
  padding: ${theme.spacing.xl} 0;
  min-height: 100vh;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top right, rgba(83, 92, 236, 0.1), transparent 40%);
    z-index: 0;
  }
`;

const SearchContainer = styled.div`
  max-width: 600px;
  margin: ${theme.spacing.xl} auto;
  position: relative;
  
  &::before {
    content: '🔍';
    position: absolute;
    left: ${theme.spacing.md};
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.2rem;
    opacity: 0.5;
  }
`;

const SearchInput = styled(Input)`
  padding-left: 3rem;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 50px;
  font-size: 1rem;
`;

const CategorySection = styled(GlassCard)`
  margin-bottom: ${theme.spacing.lg};
`;

const CategoryTitle = styled(Heading)`
  margin-bottom: ${theme.spacing.md};
  color: ${theme.colors.primary};
`;

const QuestionContainer = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  &:last-child {
    border-bottom: none;
  }
`;

const Question = styled.button`
  width: 100%;
  padding: ${theme.spacing.md};
  background: none;
  border: none;
  color: ${theme.colors.text.primary};
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    color: ${theme.colors.primary};
  }
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.05);
  }
`;

const Answer = styled(motion.div)`
  padding: 0 ${theme.spacing.md} ${theme.spacing.md};
  color: ${theme.colors.text.secondary};
  line-height: 1.6;
  
  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const faqData = {
  'Getting Started': [
    {
      question: 'What is Tsuki Niji Labs?',
      answer: 'Tsuki Niji Labs is a platform that revolutionizes company ownership through blockchain technology. We enable fractional ownership of companies through NFTs, allowing for transparent revenue sharing and decentralized governance.',
      id: 'what-is-tsuki-niji'
    },
    {
      question: 'How do I connect my wallet?',
      answer: 'Click the "Connect Wallet" button in the top right corner and select your preferred wallet. We support MetaMask, WalletConnect, and other major Web3 wallets.',
      id: 'how-to-connect-wallet'
    },
    {
      question: 'What do I need to start using the platform?',
      answer: 'You\'ll need a Web3 wallet (like MetaMask) with some ETH for transactions. No registration is required - just connect your wallet and start exploring.',
      id: 'what-do-i-need'
    },
    {
      question: 'What wallets are supported?',
      answer: 'We support all major Ethereum wallets including MetaMask, WalletConnect, Coinbase Wallet, and Trust Wallet. Any wallet that supports EIP-1193 should work.',
      id: 'supported-wallets'
    },
    {
      question: 'Is this platform free to use?',
      answer: 'The platform is free to browse and explore. Transaction fees (gas) apply when making purchases or claiming revenue, and there\'s a small platform fee on NFT sales.',
      id: 'platform-fees'
    }
  ],
  'Company NFTs': [
    {
      question: 'What is a company NFT?',
      answer: 'A company NFT represents fractional ownership in a real business. Each NFT entitles holders to a share of the company\'s revenue and governance rights.',
      id: 'what-is-company-nft'
    },
    {
      question: 'How are company NFTs different from art NFTs?',
      answer: 'Company NFTs are backed by real business revenue and provide actual ownership rights, unlike art NFTs which are primarily collectibles.',
      id: 'nft-differences'
    },
    {
      question: 'Can multiple people own the same company?',
      answer: 'Yes, companies can have multiple NFT holders. Each NFT represents a percentage of ownership and revenue rights.',
      id: 'multiple-owners'
    },
    {
      question: 'How do I buy or sell a company NFT?',
      answer: 'Visit our marketplace to browse available NFTs. You can buy directly or place bids in auctions. Selling is as simple as listing your NFT with your desired price.',
      id: 'buy-sell-nft'
    },
    {
      question: 'What happens if I lose access to my wallet?',
      answer: 'NFTs are blockchain assets - if you lose access to your wallet, you lose access to your NFTs. Always backup your wallet seed phrase and store it securely.',
      id: 'lost-wallet'
    }
  ],
  'Revenue and Profit Sharing': [
    {
      question: 'How do I earn revenue from my NFT?',
      answer: 'Revenue is distributed automatically based on your NFT ownership. Claims can be made through the dashboard when distributions are available.',
      id: 'earn-revenue'
    },
    {
      question: 'When does revenue get distributed?',
      answer: 'Revenue distributions occur monthly, typically within the first week of each month. Exact timing may vary by company.',
      id: 'revenue-timing'
    },
    {
      question: 'How do I claim profits?',
      answer: 'Visit your dashboard, connect your wallet, and click "Claim" next to any available distributions. The funds will be sent directly to your wallet.',
      id: 'claim-profits'
    },
    {
      question: 'What happens if I don\'t claim in time?',
      answer: 'Revenue claims have a 6-month window. Unclaimed revenue after this period is redistributed to active claimants.',
      id: 'missed-claims'
    }
  ],
  '$TSKJ Token': [
    {
      question: 'What is the $TSKJ token?',
      answer: 'TSKJ is our platform\'s utility token used for governance, staking, and accessing premium features.',
      id: 'what-is-tskj'
    },
    {
      question: 'How can I get $TSKJ?',
      answer: 'You can convert ETH to TSKJ directly in our app or trade on Uniswap. Visit the Token Utility section for more information.',
      id: 'get-tskj'
    },
    {
      question: 'What\'s the maximum supply of $TSKJ?',
      answer: 'TSKJ has a fixed maximum supply of 100 million tokens. No more tokens can be minted beyond this cap.',
      id: 'tskj-supply'
    }
  ],
  'Security and Admin': [
    {
      question: 'Are smart contracts audited?',
      answer: 'Yes, all our smart contracts are audited by leading security firms. Audit reports are publicly available in our documentation.',
      id: 'contract-audits'
    },
    {
      question: 'Who controls the platform?',
      answer: 'The platform uses a decentralized governance model. Major decisions are voted on by TSKJ token holders.',
      id: 'platform-control'
    },
    {
      question: 'Can the platform be paused?',
      answer: 'Critical functions can be paused by multi-sig governance in emergencies, but NFT ownership and revenue rights are immutable.',
      id: 'platform-pause'
    }
  ]
};

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState({});

  const toggleQuestion = useCallback((categoryIndex, questionId) => {
    const key = `${categoryIndex}-${questionId}`;
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, []);

  const filterQuestions = useCallback(() => {
    if (!searchTerm) return faqData;

    const filtered = {};
    Object.entries(faqData).forEach(([category, questions]) => {
      const matchingQuestions = questions.filter(
        q => q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
             q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (matchingQuestions.length > 0) {
        filtered[category] = matchingQuestions;
      }
    });
    return filtered;
  }, [searchTerm]);

  const filteredData = filterQuestions();

  return (
    <Section>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading size="xl" style={{ textAlign: 'center' }}>
            Frequently Asked Questions
          </Heading>
          <Text
            color="secondary"
            style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto', marginTop: theme.spacing.md }}
          >
            Answers to the most common questions about how Tsuki Niji Labs works.
          </Text>

          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>

          {Object.entries(filteredData).map(([category, questions]) => (
            <CategorySection key={category}>
              <CategoryTitle size="lg">{category}</CategoryTitle>
              {questions.map((item) => (
                <QuestionContainer key={item.id} id={item.id}>
                  <Question
                    onClick={() => toggleQuestion(category, item.id)}
                    aria-expanded={expandedItems[`${category}-${item.id}`]}
                  >
                    {item.question}
                    <Text>
                      {expandedItems[`${category}-${item.id}`] ? '−' : '+'}
                    </Text>
                  </Question>
                  <AnimatePresence>
                    {expandedItems[`${category}-${item.id}`] && (
                      <Answer
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.answer}
                      </Answer>
                    )}
                  </AnimatePresence>
                </QuestionContainer>
              ))}
            </CategorySection>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
};

export default FAQ;
