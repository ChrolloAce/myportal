/**
 * Professional AdminStatistics - Beautiful analytics dashboard
 * Modern charts and metrics inspired by professional dashboards
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { professionalTheme } from '../../styles/professionalTheme';
import { Card, Button } from '../../styles/ProfessionalStyles';
import { VideoSubmission, SubmissionStats } from '../../types';
import { 
  ArrowUp,
  ArrowDown,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  Globe,
  Monitor,
  Smartphone
} from 'lucide-react';

interface AdminStatisticsProps {
  stats: SubmissionStats | null;
  submissions: VideoSubmission[];
}

const DashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: ${professionalTheme.spacing[8]};
  
  @media (max-width: ${professionalTheme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${professionalTheme.spacing[6]};
  }
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${professionalTheme.spacing[6]};
`;

const SideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${professionalTheme.spacing[6]};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${professionalTheme.spacing[4]};
  margin-bottom: ${professionalTheme.spacing[6]};
  
  @media (max-width: ${professionalTheme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(Card)<{ gradient: string }>`
  padding: ${professionalTheme.spacing[6]};
  background: ${props => props.gradient};
  border: none;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(30px, -30px);
  }
`;

const StatValue = styled.div`
  font-size: ${professionalTheme.typography.fontSize['2xl']};
  font-weight: ${professionalTheme.typography.fontWeight.bold};
  color: ${professionalTheme.colors.white};
  margin-bottom: ${professionalTheme.spacing[1]};
`;

const StatLabel = styled.div`
  font-size: ${professionalTheme.typography.fontSize.sm};
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: ${professionalTheme.spacing[3]};
`;

const StatChange = styled.div<{ isPositive: boolean }>`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[1]};
  font-size: ${professionalTheme.typography.fontSize.xs};
  color: rgba(255, 255, 255, 0.9);
`;

const ChartCard = styled(Card)`
  padding: ${professionalTheme.spacing[6]};
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${professionalTheme.spacing[6]};
`;

const ChartTitle = styled.h3`
  font-size: ${professionalTheme.typography.fontSize.lg};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  color: ${professionalTheme.colors.gray[900]};
  margin: 0;
`;

const ChartFilters = styled.div`
  display: flex;
  gap: ${professionalTheme.spacing[2]};
`;

const MockChart = styled.div`
  height: 300px;
  background: linear-gradient(180deg, 
    ${professionalTheme.colors.primary[100]} 0%,
    ${professionalTheme.colors.primary[50]} 50%,
    transparent 100%
  );
  border-radius: ${professionalTheme.borderRadius.lg};
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60%;
    background: linear-gradient(45deg,
      ${professionalTheme.colors.primary[400]} 0%,
      ${professionalTheme.colors.primary[500]} 30%,
      ${professionalTheme.colors.primary[600]} 60%,
      ${professionalTheme.colors.primary[400]} 100%
    );
    clip-path: polygon(0 100%, 10% 80%, 20% 85%, 30% 70%, 40% 75%, 50% 60%, 60% 65%, 70% 50%, 80% 55%, 90% 40%, 100% 45%, 100% 100%);
  }
`;

const CalendarCard = styled(Card)`
  padding: ${professionalTheme.spacing[6]};
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${professionalTheme.spacing[4]};
`;

const CalendarTitle = styled.h4`
  font-size: ${professionalTheme.typography.fontSize.base};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  color: ${professionalTheme.colors.gray[900]};
  margin: 0;
`;

const CalendarNav = styled.div`
  display: flex;
  gap: ${professionalTheme.spacing[2]};
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${professionalTheme.spacing[1]};
`;

const CalendarDay = styled.div<{ isActive?: boolean; hasActivity?: boolean }>`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${professionalTheme.borderRadius.md};
  font-size: ${professionalTheme.typography.fontSize.sm};
  cursor: pointer;
  transition: ${professionalTheme.transitions.all};
  
  ${props => props.isActive && `
    background: ${professionalTheme.colors.primary[500]};
    color: ${professionalTheme.colors.white};
  `}
  
  ${props => props.hasActivity && !props.isActive && `
    background: ${professionalTheme.colors.primary[100]};
    color: ${professionalTheme.colors.primary[600]};
  `}
  
  &:hover {
    background: ${professionalTheme.colors.gray[100]};
  }
`;

const PieChartCard = styled(Card)`
  padding: ${professionalTheme.spacing[6]};
  text-align: center;
`;

const PieChartContainer = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto ${professionalTheme.spacing[4]};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    border: 8px solid ${professionalTheme.colors.primary[500]};
    border-top: 8px solid ${professionalTheme.colors.gray[200]};
    border-right: 8px solid ${professionalTheme.colors.gray[200]};
    border-radius: 50%;
  }
  
  &::after {
    content: '63%';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: ${professionalTheme.typography.fontSize.lg};
    font-weight: ${professionalTheme.typography.fontWeight.bold};
    color: ${professionalTheme.colors.gray[900]};
  }
`;

const PieChartLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${professionalTheme.spacing[2]};
  text-align: left;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[2]};
  font-size: ${professionalTheme.typography.fontSize.sm};
`;

const LegendColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  background: ${props => props.color};
  border-radius: ${professionalTheme.borderRadius.sm};
`;

const TrafficCard = styled(Card)`
  padding: ${professionalTheme.spacing[6]};
`;

const TrafficList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${professionalTheme.spacing[4]};
`;

const TrafficItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[3]};
`;

const TrafficIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${professionalTheme.colors.gray[100]};
  border-radius: ${professionalTheme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${professionalTheme.colors.gray[600]};
`;

const TrafficInfo = styled.div`
  flex: 1;
`;

const TrafficLabel = styled.div`
  font-size: ${professionalTheme.typography.fontSize.sm};
  color: ${professionalTheme.colors.gray[900]};
  font-weight: ${professionalTheme.typography.fontWeight.medium};
`;

const TrafficBar = styled.div`
  width: 100%;
  height: 4px;
  background: ${professionalTheme.colors.gray[200]};
  border-radius: ${professionalTheme.borderRadius.full};
  margin-top: ${professionalTheme.spacing[1]};
  overflow: hidden;
`;

const TrafficProgress = styled.div<{ width: number; color: string }>`
  width: ${props => props.width}%;
  height: 100%;
  background: ${props => props.color};
  border-radius: ${professionalTheme.borderRadius.full};
`;

const TrafficPercent = styled.div`
  font-size: ${professionalTheme.typography.fontSize.sm};
  color: ${professionalTheme.colors.gray[600]};
  font-weight: ${professionalTheme.typography.fontWeight.medium};
`;

export const AdminStatistics: React.FC<AdminStatisticsProps> = ({ stats }) => {
  const [selectedDate, setSelectedDate] = useState(7);

  const generateCalendarDays = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(
        <CalendarDay 
          key={i}
          isActive={i === selectedDate}
          hasActivity={[3, 7, 12, 15, 18, 23, 28].includes(i)}
          onClick={() => setSelectedDate(i)}
        >
          {i}
        </CalendarDay>
      );
    }
    return days;
  };

  return (
    <DashboardLayout>
      <MainColumn>
        {/* Top Stats */}
        <StatsGrid>
          <StatCard gradient={`linear-gradient(135deg, ${professionalTheme.colors.primary[500]} 0%, ${professionalTheme.colors.primary[600]} 100%)`}>
            <StatValue>{stats?.total || 36159}</StatValue>
            <StatLabel>Total Views</StatLabel>
            <StatChange isPositive={true}>
              <ArrowUp size={12} />
              +2.5% vs last month
            </StatChange>
          </StatCard>

          <StatCard gradient={`linear-gradient(135deg, ${professionalTheme.colors.success[500]} 0%, ${professionalTheme.colors.success[600]} 100%)`}>
            <StatValue>{stats?.approved || 3159}</StatValue>
            <StatLabel>Approved Content</StatLabel>
            <StatChange isPositive={true}>
              <ArrowUp size={12} />
              +8.2% vs last month
            </StatChange>
          </StatCard>

          <StatCard gradient={`linear-gradient(135deg, ${professionalTheme.colors.warning[500]} 0%, ${professionalTheme.colors.warning[600]} 100%)`}>
            <StatValue>{stats?.pending || 36159}</StatValue>
            <StatLabel>Engagement Rate</StatLabel>
            <StatChange isPositive={false}>
              <ArrowDown size={12} />
              -1.2% vs last month
            </StatChange>
          </StatCard>
        </StatsGrid>

        {/* Main Chart */}
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Analytics Overview</ChartTitle>
            <ChartFilters>
              <Button variant="secondary" size="sm">
                <Filter size={14} />
                Filter
              </Button>
              <Button variant="secondary" size="sm">
                <Download size={14} />
                Export
              </Button>
            </ChartFilters>
          </ChartHeader>
          <MockChart />
        </ChartCard>
      </MainColumn>

      <SideColumn>
        {/* Calendar */}
        <CalendarCard>
          <CalendarHeader>
            <CalendarTitle>January 2025</CalendarTitle>
            <CalendarNav>
              <Button variant="ghost" size="sm">
                <ChevronLeft size={16} />
              </Button>
              <Button variant="ghost" size="sm">
                <ChevronRight size={16} />
              </Button>
            </CalendarNav>
          </CalendarHeader>
          <CalendarGrid>
            {generateCalendarDays().slice(0, 14)}
          </CalendarGrid>
        </CalendarCard>

        {/* Top Product Sale */}
        <PieChartCard>
          <h4 style={{ 
            fontSize: professionalTheme.typography.fontSize.base,
            fontWeight: professionalTheme.typography.fontWeight.semibold,
            color: professionalTheme.colors.gray[900],
            margin: `0 0 ${professionalTheme.spacing[4]} 0`
          }}>
            Top Content Performance
          </h4>
          <PieChartContainer />
          <PieChartLegend>
            <LegendItem>
              <LegendColor color={professionalTheme.colors.primary[500]} />
              <span>TikTok</span>
            </LegendItem>
            <LegendItem>
              <LegendColor color={professionalTheme.colors.gray[400]} />
              <span>Instagram</span>
            </LegendItem>
            <LegendItem>
              <LegendColor color={professionalTheme.colors.gray[300]} />
              <span>Other Platforms</span>
            </LegendItem>
          </PieChartLegend>
        </PieChartCard>

        {/* Traffic Source */}
        <TrafficCard>
          <h4 style={{ 
            fontSize: professionalTheme.typography.fontSize.base,
            fontWeight: professionalTheme.typography.fontWeight.semibold,
            color: professionalTheme.colors.gray[900],
            margin: `0 0 ${professionalTheme.spacing[4]} 0`
          }}>
            Traffic Source
          </h4>
          <TrafficList>
            <TrafficItem>
              <TrafficIcon>
                <Globe size={16} />
              </TrafficIcon>
              <TrafficInfo>
                <TrafficLabel>example.com</TrafficLabel>
                <TrafficBar>
                  <TrafficProgress width={85} color={professionalTheme.colors.primary[500]} />
                </TrafficBar>
              </TrafficInfo>
              <TrafficPercent>85%</TrafficPercent>
            </TrafficItem>

            <TrafficItem>
              <TrafficIcon>
                <Monitor size={16} />
              </TrafficIcon>
              <TrafficInfo>
                <TrafficLabel>example2.com</TrafficLabel>
                <TrafficBar>
                  <TrafficProgress width={65} color={professionalTheme.colors.success[500]} />
                </TrafficBar>
              </TrafficInfo>
              <TrafficPercent>65%</TrafficPercent>
            </TrafficItem>

            <TrafficItem>
              <TrafficIcon>
                <Smartphone size={16} />
              </TrafficIcon>
              <TrafficInfo>
                <TrafficLabel>example3.com</TrafficLabel>
                <TrafficBar>
                  <TrafficProgress width={45} color={professionalTheme.colors.warning[500]} />
                </TrafficBar>
              </TrafficInfo>
              <TrafficPercent>45%</TrafficPercent>
            </TrafficItem>
          </TrafficList>
        </TrafficCard>
      </SideColumn>
    </DashboardLayout>
  );
};