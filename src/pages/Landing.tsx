// src/pages/Landing.tsx
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Button, PageContainer } from '../components/common';

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const glow = keyframes`
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
`;

const LandingContainer = styled(PageContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: calc(100vh - 80px);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
    animation: ${float} 20s ease-in-out infinite;
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -20%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
    animation: ${float} 15s ease-in-out infinite reverse;
    pointer-events: none;
  }
`;

const HeroSection = styled.section`
  max-width: 900px;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xxxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  line-height: 1.2;
  background: ${({ theme }) => theme.gradients.primary};
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${gradientAnimation} 3s ease infinite;
  filter: drop-shadow(0 0 30px rgba(99, 102, 241, 0.5));

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize.xl};
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  line-height: 1.8;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const FeaturesSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  width: 100%;
  position: relative;
  z-index: 1;
`;

const FeatureCard = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.1) 0%,
    rgba(139, 92, 246, 0.05) 100%
  );
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.gradients.primary};
    opacity: 0.1;
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: ${({ theme }) => theme.shadows.glow};
    border-color: ${({ theme }) => theme.colors.primary};
    
    &::before {
      left: 100%;
    }
  }
`;

const FeatureIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.5));
  transition: transform 0.3s ease;
  
  ${FeatureCard}:hover & {
    transform: scale(1.1) rotate(5deg);
  }
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const FeatureDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.7;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

export const Landing = () => {
  return (
    <LandingContainer>
      <HeroSection>
        <HeroTitle>TaskManager</HeroTitle>
        <HeroSubtitle>
          Organize your tasks, collaborate with your team, and achieve your goals.
          Built with cutting-edge technology including Web3, AI, and real-time collaboration.
        </HeroSubtitle>
        <CTAButtons>
          <Button as={StyledLink} to="/signup" size="lg">
            Get Started
          </Button>
          <Button as={StyledLink} to="/login" variant="outline" size="lg">
            Sign In
          </Button>
        </CTAButtons>
      </HeroSection>

      <FeaturesSection>
        <FeatureCard>
          <FeatureIcon>📋</FeatureIcon>
          <FeatureTitle>Task Management</FeatureTitle>
          <FeatureDescription>
            Create, organize, and track your tasks with ease. Set priorities, due dates, and collaborate with your team.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>🔗</FeatureIcon>
          <FeatureTitle>Web3 Integration</FeatureTitle>
          <FeatureDescription>
            Connect your crypto wallet, earn token rewards, and mint NFT badges for your achievements.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>🤖</FeatureIcon>
          <FeatureTitle>AI-Powered</FeatureTitle>
          <FeatureDescription>
            Get smart task suggestions, auto-categorization, and intelligent prioritization powered by AI.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>👥</FeatureIcon>
          <FeatureTitle>Real-Time Collaboration</FeatureTitle>
          <FeatureDescription>
            Work together in real-time with live updates, comments, and collaborative editing.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>💰</FeatureIcon>
          <FeatureTitle>Crypto Rewards</FeatureTitle>
          <FeatureDescription>
            Earn tokens and crypto rewards for completing tasks. Stake tokens and grow your earnings.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>📊</FeatureIcon>
          <FeatureTitle>Analytics & Insights</FeatureTitle>
          <FeatureDescription>
            Track your productivity, view detailed analytics, and get insights into your work patterns.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesSection>
    </LandingContainer>
  );
};

