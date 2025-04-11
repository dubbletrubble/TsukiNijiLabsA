import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Container, Heading, Text, Button, GlassCard, Grid } from '../components/common/StyledComponents';
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

const CategoryCard = styled(GlassCard)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${theme.spacing.md};
  height: 100%;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.hover};
  }
`;

const Icon = styled.div`
  font-size: 2rem;
  margin-bottom: ${theme.spacing.sm};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.xl};
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.md};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.text.primary};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: ${theme.shadows.glow};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${theme.spacing.md};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.text.primary};
  font-size: 1rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: ${theme.shadows.glow};
  }
  
  option {
    background: ${theme.colors.background.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${theme.spacing.md};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.text.primary};
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: ${theme.shadows.glow};
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  padding: ${theme.spacing.md};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.text.primary};
  font-size: 1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const SuccessMessage = styled(motion.div)`
  padding: ${theme.spacing.md};
  background: rgba(46, 213, 115, 0.1);
  border: 1px solid rgba(46, 213, 115, 0.2);
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.lg};
`;

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    walletAddress: '',
    screenshot: null
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = [
    {
      icon: '🔍',
      title: 'Documentation / FAQs',
      description: 'Answers to the most common platform questions.',
      link: '/docs'
    },
    {
      icon: '💬',
      title: 'Discord Community',
      description: 'Join our support server for real-time help and updates.',
      link: 'https://discord.gg/tsukiniji'
    },
    {
      icon: '📄',
      title: 'Submit a Ticket',
      description: 'Need to report an issue or get direct help? Use the form below.',
      action: () => document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' })
    },
    {
      icon: '🐞',
      title: 'Report a Bug',
      description: 'Found something not working? Let us know.',
      action: () => document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' })
    },
    {
      icon: '📣',
      title: 'Follow Updates',
      description: 'Stay up to date on new features, payouts, and launches.',
      link: 'https://twitter.com/tsukiniji'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    // For now, we'll just show a success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      walletAddress: '',
      screenshot: null
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  return (
    <Section>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading size="xl">Support & Contact</Heading>
          <Text color="secondary" style={{ maxWidth: '600px', marginTop: theme.spacing.md }}>
            Need help with a transaction, your wallet, or understanding how Tsuki Niji works? We're here to help.
          </Text>

          <Grid columns={3} mobileColumns={1} gap={theme.spacing.lg} style={{ marginTop: theme.spacing.xl }}>
            {categories.map((category, index) => (
              <CategoryCard
                key={index}
                as={motion.div}
                whileHover={{ y: -4 }}
                onClick={category.action}
                style={{ cursor: category.action ? 'pointer' : 'default' }}
              >
                <Icon>{category.icon}</Icon>
                <Heading size="sm">{category.title}</Heading>
                <Text color="secondary">{category.description}</Text>
                {category.link && (
                  <Button
                    as="a"
                    href={category.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginTop: 'auto' }}
                  >
                    Learn More
                  </Button>
                )}
              </CategoryCard>
            ))}
          </Grid>

          <GlassCard id="contact-form" style={{ marginTop: theme.spacing.xl }}>
            <Heading size="lg">Submit a Support Ticket</Heading>
            <Text color="secondary" style={{ marginTop: theme.spacing.sm }}>
              Fill out the form below and we'll get back to you as soon as possible.
            </Text>

            {showSuccess && (
              <SuccessMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Your message has been sent successfully! We'll get back to you soon.
              </SuccessMessage>
            )}

            <Form onSubmit={handleSubmit}>
              <Input
                type="text"
                name="name"
                placeholder="Your Name (optional)"
                value={formData.name}
                onChange={handleChange}
              />
              <Input
                type="email"
                name="email"
                placeholder="Email Address *"
                required
                value={formData.email}
                onChange={handleChange}
              />
              <Select
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
              >
                <option value="">Select Category *</option>
                <option value="general">General Inquiry</option>
                <option value="wallet">Wallet/Connection Issue</option>
                <option value="token">Token/Revenue Issue</option>
                <option value="nft">NFT Ownership Question</option>
                <option value="bug">Bug Report</option>
                <option value="other">Other</option>
              </Select>
              <Input
                type="text"
                name="walletAddress"
                placeholder="Wallet Address (optional)"
                value={formData.walletAddress}
                onChange={handleChange}
              />
              <TextArea
                name="message"
                placeholder="Your Message *"
                required
                value={formData.message}
                onChange={handleChange}
              />
              <FileLabel>
                <span>📎 Attach Screenshot (optional)</span>
                <FileInput
                  type="file"
                  name="screenshot"
                  accept="image/*"
                  onChange={handleChange}
                />
              </FileLabel>
              <Button
                variant="primary"
                type="submit"
                style={{ marginTop: theme.spacing.md }}
              >
                Submit Request
              </Button>
            </Form>
          </GlassCard>

          <Text
            color="secondary"
            style={{
              textAlign: 'center',
              marginTop: theme.spacing.xl,
              marginBottom: theme.spacing.xl
            }}
          >
            For urgent inquiries, you can also email us directly at{' '}
            <a
              href="mailto:support@tsukiniji.xyz"
              style={{ color: theme.colors.text.primary }}
            >
              support@tsukiniji.xyz
            </a>
          </Text>
        </motion.div>
      </Container>
    </Section>
  );
};

export default Support;
